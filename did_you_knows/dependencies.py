from typing import Annotated
from fastapi import Depends
from sqlmodel import Session
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
