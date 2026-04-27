from database.core import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy import select
from model import Puzzles
from database.core import AsyncSession
from schema import PuzzleCreate, PuzzleUpdate
from utils import generate_clues, calculate_difficulty




async def get_puzzles(db: AsyncSession, hor_size=None, ver_size=None, difficulty=None, sort_by="created_at", direction="desc", offset: int = 0, limit: int = 100, ):
    filter_options = {"hor_size": hor_size, "ver_size": ver_size, "difficulty": difficulty}
    filters = []

    limit = min(limit, 100)
    offset = max(offset, 0)
    order_by = getattr(Puzzles, sort_by)

    if direction == "asc":
        order_by = order_by.asc()
    else:
        order_by = order_by.desc()

    for f in filter_options:
        if filter_options[f]:
            filters.append(getattr(Puzzles, f) == filter_options[f])

    result = await db.execute(select(Puzzles).where(*filters).order_by(order_by).offset(offset).limit(limit))
    return result.scalars().all()

async def get_puzzle(db: AsyncSession, puzzle_id: int):
    result = await db.execute(select(Puzzles).where(Puzzles.id == puzzle_id))
    return result.scalars().first()

async def create_puzzle(db: AsyncSession, puzzle: PuzzleCreate):
    db_puzzle = Puzzles(**puzzle.model_dump())
    row_clues, col_clues = generate_clues(puzzle.solution_grid)
    db_puzzle.row_clues = row_clues
    db_puzzle.col_clues = col_clues
    db_puzzle.difficulty = calculate_difficulty(puzzle.solution_grid)
    db.add(db_puzzle)
    await db.commit()
    await db.refresh(db_puzzle)
    return db_puzzle

async def update_puzzle(db: AsyncSession, puzzle_id: int, puzzle: PuzzleUpdate):
    db_puzzle = await get_puzzle(db, puzzle_id)
    if not db_puzzle:
        return None
    clean_data = puzzle.model_dump(exclude_unset=True)
    if "solution_grid" in clean_data:
        row_clues, col_clues = generate_clues(clean_data["solution_grid"])
        clean_data["row_clues"] = row_clues
        clean_data["col_clues"] = col_clues
    for key, value in clean_data.items():
        setattr(db_puzzle, key, value)
    await db.commit()
    await db.refresh(db_puzzle)
    return db_puzzle

async def delete_puzzle(db: AsyncSession, puzzle_id: int):
    db_puzzle = await get_puzzle(db, puzzle_id)
    if not db_puzzle:
        return None
    await db.delete(db_puzzle)
    await db.commit()
    return db_puzzle

