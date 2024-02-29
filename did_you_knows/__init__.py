from datetime import date

from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

from pydantic import BaseModel, Field


app = FastAPI()


@app.get("/")
async def root():
    return HTMLResponse(content=open("static/index.html").read(), status_code=200)
