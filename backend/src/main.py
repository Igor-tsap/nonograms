from fastapi import FastAPI
from database.core import engine, Base

app = FastAPI(title="Nonograms API")

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
async def root():
    return {"message": "Nonograms API is working!"}