from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .smart_session import MutateDetectSessionMiddleware
from starlette.config import Config
from starlette.datastructures import Secret
from authlib.integrations.starlette_client import OAuth
from authlib.integrations.httpx_client import OAuth1Auth
from .static import static_router, mount_static
from .api import api_router
from .dependencies import HttpClient

config = Config(env_prefix="DYK_")
SESSION_SECRET = config("SESSION_SECRET", cast=Secret)

app = FastAPI()
app.add_middleware(MutateDetectSessionMiddleware, secret_key=SESSION_SECRET)

oauth = OAuth(config)

META_WIKI_OAUTH = "https://meta.wikimedia.org/w/index.php?title=Special:OAuth"
META_WIKI_USERINFO = "https://meta.wikimedia.org/w/api.php?action=query&meta=userinfo&uiprop=rights&format=json"

oauth.register(
    name="wikimedia",
    request_token_url=f"{META_WIKI_OAUTH}/initiate",
    access_token_url=f"{META_WIKI_OAUTH}/token",
    authorize_url=f"{META_WIKI_OAUTH}/authenticate",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000",
        "http://localhost:8080",
        "http://localhost:1234",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/login/wikimedia")
async def login_wmf(request: Request):
    # TODO: add redirect GET param to redirect url
    return await oauth.wikimedia.authorize_redirect(
        request, "https://did-you-knows.toolforge.org/login/auth_wikimedia"
    )


@app.get("/login/auth_wikimedia")
async def auth_via_wmf(request: Request, client: HttpClient) -> bytes:
    token = await oauth.wikimedia.authorize_access_token(request)

    if token:
        auth = OAuth1Auth(
            client_id=config("WIKIMEDIA_CLIENT_ID"),
            client_secret=config("WIKIMEDIA_CLIENT_SECRET"),
            token=token.get("oauth_token"),
            token_secret=token.get("oauth_token_secret"),
        )

        d = await client.get(META_WIKI_USERINFO, auth=auth)
        return d.content

    raise HTTPException(401, "could not get access token - " + str(token))


@app.get("/login/user")
async def get_user():
    pass


app.include_router(api_router)
app.include_router(static_router)
mount_static(app)
