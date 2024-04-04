from datetime import date
from typing import Annotated
from importlib import resources as impresources
from html import escape
import pathlib
from fastapi import Request, Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session
from . import database, crud
from .database import engine
from starlette.middleware.sessions import SessionMiddleware
from starlette.config import Config
from starlette.datastructures import Secret
from authlib.integrations.starlette_client import OAuth
import httpx


def get_session():
    with Session(engine) as session:
        yield session


DbSession = Annotated[Session, Depends(get_session)]


async def get_http_client():
    async with httpx.AsyncClient() as client:
        yield client

HttpClient = Annotated[httpx.AsyncClient, Depends(get_http_client)]

config = Config(env_prefix='DYK_')
SESSION_SECRET = config('SESSION_SECRET', cast=Secret)

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=SESSION_SECRET)

oauth = OAuth(config)

META_WIKI_OAUTH = "https://meta.wikimedia.org/w/index.php?title=Special:OAuth"

oauth.register(
    name='wikimedia',
    request_token_url=f'{META_WIKI_OAUTH}/initiate',
    access_token_url=f'{META_WIKI_OAUTH}/token',
    authorize_url=f'{META_WIKI_OAUTH}/authenticate',
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://localhost:8080", "http://localhost:1234"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/login/wikimedia")
async def login_wmf(request: Request):
    # TODO: add redirect GET param to redirect url
    return await oauth.wikimedia.authorize_redirect(request, "https://did-you-knows.toolforge.org/login/auth_wikimedia")


@app.get("/login/auth_wikimedia")
async def auth_via_wmf(request: Request):
    token = await oauth.wikimedia.authorize_access_token(request)
    return token


@app.get("/api/hook/{hook_id}", response_model=database.Hook)
def read_hook(hook_id: int, session: DbSession):
    hook = crud.get_hook(session, hook_id)
    if hook is None:
        raise HTTPException(status_code=404, detail="Hook not found")
    return hook


@app.get("/api/random_hooks/{number}", response_model=list[database.Hook])
def read_hook(number: int, session: DbSession):
    return crud.get_random_hooks(session, number)


@app.get("/api/suggested_hooks", response_model=list[database.Hook])
def suggested_hooks(request: Request, session: DbSession):
    user = request.session.get('user')
    if not user:
        return []
    # TODO: return suggested hooks


@app.get("/api/like_hook/{number}", response_model=bool)
def like_hook(number: int, request: Request, session: DbSession):
    user = request.session.get('user')
    if not user:
        return False
    if user:
        # TODO: write down the like
        return True


@app.post("/api/images", response_model=dict[int, str | None])
async def get_images(page_ids: list[int], client: HttpClient):
    if not page_ids:
        return {}
    page_ids_param = "|".join(map(str, page_ids))
    url = f"https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&pageids={page_ids_param}&pithumbsize=400"
    r: httpx.Response = await client.get(url)
    data: dict = r.raise_for_status().json()
    pages = data.get("query", {}).get("pages", {})

    return {page_id: blob.get("thumbnail", {}).get("source") for (page_id, blob) in pages.items()}


STATIC_FOLDER = impresources.files("did_you_knows").joinpath("static")
DIST_FOLDER = pathlib.Path("dist")


def get_index(description: str, image: str | None) -> str:
    with DIST_FOLDER.joinpath("index.html").open('r') as f:
        # sanitize
        description = escape(description)
        index_string = f.read()

        index_string = index_string.replace("{prop1}", "og:description").replace("{value1}", description)

        if image:
            image = escape(image)
            index_string = index_string.replace("{prop2}", "og:image").replace("{value2}", image)

        return index_string


@app.get("/")
async def root():
    with DIST_FOLDER.joinpath("index.html").open('r') as f:
        return HTMLResponse(content=get_index("Interesting facts from Wikipedia!", None), status_code=200)


@app.get("/{hook_id}/{hook_slug}")
async def root_with_hook(hook_id: int, hook_slug: str, session: DbSession, client: HttpClient):
    hook = crud.get_hook(session, hook_id)

    if not hook:
        # redirect to root()
        url = app.url_path_for("root")
        return RedirectResponse(url=url)

    with DIST_FOLDER.joinpath("index.html").open('r') as f:

        images = await get_images([hook.page_id], client)
        image_url = hook.image or images.get(str(hook.page_id))
        return HTMLResponse(content=get_index(hook.hook_text, image_url), status_code=200)


app.mount("/", StaticFiles(directory=DIST_FOLDER), name="dist")
