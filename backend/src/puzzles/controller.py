from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from database.core import get_session
from . import service
from .schema import PuzzleCreate, PuzzleUpdate, PuzzleResponse

router = APIRouter(prefix="/api/puzzles", tags=["puzzles"])

@router.get("/", response_model=list[PuzzleResponse])
async def read_puzzles(
    db: AsyncSession = Depends(get_session),
    hor_size: int = Query(None),
    ver_size: int = Query(None),
    difficulty: str = Query(None),
    sort_by: str = Query("created_at", enum=["created_at", "updated_at"]),
    direction: str = Query("desc", enum=["asc", "desc"]),
    offset: int = Query(0),
    limit: int = Query(100),
):
    puzzles = await service.get_puzzles(db, hor_size, ver_size, difficulty, sort_by, direction, offset, limit)
    return puzzles

@router.get("/{puzzle_id}", response_model=PuzzleResponse)
async def read_puzzle(puzzle_id: int, db: AsyncSession = Depends(get_session)):
    db_puzzle = await service.get_puzzle(db, puzzle_id)
    if not db_puzzle:
        raise HTTPException(status_code=404, detail="Puzzle not found")
    return db_puzzle

@router.post("/", response_model=PuzzleResponse, status_code=201)
async def create_puzzle(puzzle: PuzzleCreate, db: AsyncSession = Depends(get_session)):
    return await service.create_puzzle(db, puzzle)

@router.patch("/{puzzle_id}", response_model=PuzzleResponse)
async def update_puzzle(puzzle_id: int, puzzle: PuzzleUpdate, db: AsyncSession = Depends(get_session)):
    db_puzzle = await service.get_puzzle(db, puzzle_id)
    if not db_puzzle:
        raise HTTPException(status_code=404, detail="Puzzle not found")

    updated_puzzle = await service.update_puzzle(db, db_puzzle, puzzle)
    return updated_puzzle

@router.delete("/{puzzle_id}", response_model=PuzzleResponse)
async def delete_puzzle(puzzle_id: int, db: AsyncSession = Depends(get_session)):
    db_puzzle = await service.get_puzzle(db, puzzle_id)
    if not db_puzzle:
        raise HTTPException(status_code=404, detail="Puzzle not found")

    deleted_puzzle = await service.delete_puzzle(db, db_puzzle)
    return deleted_puzzle