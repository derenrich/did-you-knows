from datetime import date
from typing import Annotated
from importlib import resources as impresources
import pathlib
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session
from . import database, crud
from .database import engine
import httpx


def get_session():
    with Session(engine) as session:
        yield session


DbSession = Annotated[Session, Depends(get_session)]


async def get_http_client():
    async with httpx.AsyncClient() as client:
        yield client

HttpClient = Annotated[httpx.AsyncClient, Depends(get_http_client)]

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://localhost:8080", "http://localhost:1234"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/hook/{hook_id}", response_model=database.Hook)
def read_hook(hook_id: int, session: DbSession):
    hook = crud.get_hook(session, hook_id)
    if hook is None:
        raise HTTPException(status_code=404, detail="Hook not found")
    return hook


@app.get("/api/random_hooks/{number}", response_model=list[database.Hook])
def read_hook(number: int, session: DbSession):
    return crud.get_random_hooks(session, number)


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


@app.get("/")
async def root():
    with DIST_FOLDER.joinpath("index.html").open('r') as f:
        return HTMLResponse(content=f.read(), status_code=200)

app.mount("/", StaticFiles(directory=DIST_FOLDER), name="dist")
