from fastapi import FastAPI
from contextlib import asynccontextmanager
from database.core import engine, Base
from puzzles.model import Puzzles
from users.model import Users
from attempts.model import Attempts


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title="Nonograms API", lifespan=lifespan)


@app.get("/")
async def root():
    return {"message": "Nonograms API is working!"}