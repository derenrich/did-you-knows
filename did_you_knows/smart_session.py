# taken from https://github.com/widgetti/solara/blob/master/packages/solara-enterprise/solara_enterprise/auth/middleware.py
# but released under open source at https://github.com/encode/starlette/issues/2019
import json
import sys
import typing
from base64 import b64decode, b64encode

import itsdangerous
from itsdangerous.exc import BadSignature
from starlette.datastructures import MutableHeaders, Secret
from starlette.middleware.sessions import SessionMiddleware
from starlette.requests import HTTPConnection
from starlette.types import ASGIApp, Message, Receive, Scope, Send

if sys.version_info >= (3, 8):  # pragma: no cover
    from typing import Literal
else:  # pragma: no cover
    from typing_extensions import Literal


# mutable mapping that keeps track of whether it has been modified
class ModifiedDict(dict):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.modified = False

    def __setitem__(self, key, value):
        super().__setitem__(key, value)
        self.modified = True

    def __delitem__(self, key):
        super().__delitem__(key)
        self.modified = True

    def clear(self):
        super().clear()
        self.modified = True

    def pop(self, key, default=None):
        value = super().pop(key, default)
        self.modified = True
        return value

    def popitem(self):
        value = super().popitem()
        self.modified = True
        return value

    def setdefault(self, key, default=None):
        value = super().setdefault(key, default)
        self.modified = True
        return value

    def update(self, *args, **kwargs):
        super().update(*args, **kwargs)
        self.modified = True


class MutateDetectSessionMiddleware(SessionMiddleware):
    def __init__(
        self,
        app: ASGIApp,
        secret_key: typing.Union[str, Secret],
        session_cookie: str = "session",
        max_age: typing.Optional[int] = 14 * 24 * 60 * 60,  # 14 days, in seconds
        path: str = "/",
        same_site: Literal["lax", "strict", "none"] = "lax",
        https_only: bool = False,
    ) -> None:
        self.app = app
        self.signer = itsdangerous.TimestampSigner(str(secret_key))
        self.session_cookie = session_cookie
        self.max_age = max_age
        self.path = path
        self.security_flags = "httponly; samesite=" + same_site
        if https_only:  # Secure flag can be used with HTTPS only
            self.security_flags += "; secure"

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] not in ("http", "websocket"):  # pragma: no cover
            await self.app(scope, receive, send)
            return

        connection = HTTPConnection(scope)
        initial_session_was_empty = True

        if self.session_cookie in connection.cookies:
            data = connection.cookies[self.session_cookie].encode("utf-8")
            try:
                data = self.signer.unsign(data, max_age=self.max_age)
                scope["session"] = ModifiedDict(json.loads(b64decode(data)))
                initial_session_was_empty = False
            except BadSignature:
                scope["session"] = ModifiedDict()
        else:
            scope["session"] = ModifiedDict()

        async def send_wrapper(message: Message) -> None:
            if message["type"] == "http.response.start":
                if scope["session"]:
                    # this deviates for starlette, we only update the cookie if the session has been modified
                    # this avoids race conditions where the session is modified by another request
                    if scope["session"].modified:
                        # We have session data to persist.
                        data = b64encode(json.dumps(scope["session"]).encode("utf-8"))
                        data = self.signer.sign(data)
                        headers = MutableHeaders(scope=message)
                        header_value = "{session_cookie}={data}; path={path}; {max_age}{security_flags}".format(  # noqa E501
                            session_cookie=self.session_cookie,
                            data=data.decode("utf-8"),
                            path=self.path,
                            max_age=f"Max-Age={self.max_age}; " if self.max_age else "",
                            security_flags=self.security_flags,
                        )
                        headers.append("Set-Cookie", header_value)
                elif not initial_session_was_empty:
                    # The session has been cleared.
                    headers = MutableHeaders(scope=message)
                    header_value = "{session_cookie}={data}; path={path}; {expires}{security_flags}".format(  # noqa E501
                        session_cookie=self.session_cookie,
                        data="null",
                        path=self.path,
                        expires="expires=Thu, 01 Jan 1970 00:00:00 GMT; ",
                        security_flags=self.security_flags,
                    )
                    headers.append("Set-Cookie", header_value)
            await send(message)

        await self.app(scope, receive, send_wrapper)
