from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.models.project import Project
from app.schemas.project import ProjectResponse


router = APIRouter(
    tags=["projects"],
)


@router.get("/", response_model=list[ProjectResponse])
async def get_projects(
    db: Annotated[AsyncSession, Depends(get_db)],
):
    result = await db.execute(
        select(Project).order_by(Project.id)
    )

    return result.scalars().all()


@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
)
async def get_project(
    project_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    result = await db.execute(
        select(Project).where(Project.id == project_id)
    )

    project = result.scalar_one_or_none()

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    return project