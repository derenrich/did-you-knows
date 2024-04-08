from fastapi import APIRouter
import httpx
from .dependencies import DbSession, HttpClient
from . import database, crud
from fastapi import Request, HTTPException


api_router = APIRouter(prefix="/api", tags=["api"])


@api_router.get("/hook/{hook_id}", response_model=database.Hook)
def read_hook(hook_id: int, session: DbSession):
    hook = crud.get_hook(session, hook_id)
    if hook is None:
        raise HTTPException(status_code=404, detail="Hook not found")
    return hook


@api_router.get("/random_hooks/{number}", response_model=list[database.Hook])
def random_hooks(number: int, session: DbSession):
    return crud.get_random_hooks(session, number)


@api_router.get("/suggested_hooks", response_model=list[database.Hook])
def suggested_hooks(request: Request, session: DbSession):
    user = request.session.get("user")
    if not user:
        return []
    # TODO: return suggested hooks


@api_router.get("/like_hook/{number}", response_model=bool)
def like_hook(number: int, request: Request, session: DbSession):
    user = request.session.get("user")
    if not user:
        return False
    if user:
        # TODO: write down the like
        return True


@api_router.post("/images", response_model=dict[int, str | None])
async def get_images(page_ids: list[int], client: HttpClient):
    if not page_ids:
        return {}
    page_ids_param = "|".join(map(str, page_ids))
    url = f"https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&pageids={page_ids_param}&pithumbsize=400"
    r: httpx.Response = await client.get(url)
    data: dict = r.raise_for_status().json()
    pages = data.get("query", {}).get("pages", {})

    return {
        page_id: blob.get("thumbnail", {}).get("source")
        for (page_id, blob) in pages.items()
    }
