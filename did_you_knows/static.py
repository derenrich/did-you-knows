from fastapi import APIRouter, FastAPI
from fastapi.staticfiles import StaticFiles
from .dependencies import DbSession, HttpClient
from . import crud
from fastapi.responses import HTMLResponse, RedirectResponse
from importlib import resources as impresources
import pathlib
from html import escape
from .api import get_images

static_router = APIRouter(tags=["api"])

STATIC_FOLDER = impresources.files("did_you_knows").joinpath("static")
DIST_FOLDER = pathlib.Path("dist")


def get_index(description: str, image: str | None) -> str:
    with DIST_FOLDER.joinpath("index.html").open("r") as f:
        # sanitize
        description = escape(description)
        index_string = f.read()

        index_string = index_string.replace("{prop1}", "og:description").replace(
            "{value1}", description
        )

        if image:
            image = escape(image)
            index_string = index_string.replace("{prop2}", "og:image").replace(
                "{value2}", image
            )

        return index_string


@static_router.get("/")
async def root():
    return HTMLResponse(
        content=get_index("Interesting facts from Wikipedia!", None),
        status_code=200,
    )


@static_router.get("/{hook_id}/{hook_slug}")
async def root_with_hook(
    hook_id: int, hook_slug: str, session: DbSession, client: HttpClient
):
    hook = crud.get_hook(session, hook_id)

    if not hook:
        # redirect to root()
        url = static_router.url_path_for("root")
        return RedirectResponse(url=url)

    images = await get_images([hook.page_id], client)
    image_url = hook.image or images.get(str(hook.page_id))
    return HTMLResponse(
        content=get_index(hook.hook_text, image_url), status_code=200
    )


def mount_static(app: FastAPI) -> None:
    app.mount("/", StaticFiles(directory=DIST_FOLDER), name="dist")
