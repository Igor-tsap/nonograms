from database.core import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy import select
from model import Puzzles
from database.core import AsyncSession




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



