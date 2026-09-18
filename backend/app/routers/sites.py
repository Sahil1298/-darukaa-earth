from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from geoalchemy2.elements import WKTElement
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.project import Project
from app.models.site import Site
from app.models.user import User
from app.schemas.site import SiteCreate, SiteResponse, SiteUpdate


router = APIRouter(
    prefix="/api/projects/{project_id}/sites",
    tags=["sites"],
)


@router.get(
    "/",
    response_model=list[SiteResponse],
)
async def get_sites(
    project_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    project_query = select(Project).where(Project.id == project_id)

    if current_user.role != "administrator":
        project_query = project_query.where(
            Project.user_id == current_user.id
        )

    project_result = await db.execute(project_query)
    project = project_result.scalar_one_or_none()

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    result = await db.execute(
        select(
            Site,
            func.ST_Y(Site.location).label("latitude"),
            func.ST_X(Site.location).label("longitude"),
        )
        .where(Site.project_id == project_id)
        .order_by(Site.id)
    )

    rows = result.all()

    return [
        SiteResponse(
            id=site.id,
            name=site.name,
            project_id=site.project_id,
            latitude=latitude,
            longitude=longitude,
            area_hectares=float(site.area_hectares),
            created_at=site.created_at,
        )
        for site, latitude, longitude in rows
    ]


@router.get(
    "/{site_id}",
    response_model=SiteResponse,
)
async def get_site(
    project_id: int,
    site_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    query = (
        select(
            Site,
            func.ST_Y(Site.location).label("latitude"),
            func.ST_X(Site.location).label("longitude"),
        )
        .join(Project, Project.id == Site.project_id)
        .where(
            Site.id == site_id,
            Site.project_id == project_id,
        )
    )

    if current_user.role != "administrator":
        query = query.where(Project.user_id == current_user.id)

    result = await db.execute(query)

    row = result.one_or_none()

    if row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site not found",
        )

    site, latitude, longitude = row

    return SiteResponse(
        id=site.id,
        name=site.name,
        project_id=site.project_id,
        latitude=latitude,
        longitude=longitude,
        area_hectares=float(site.area_hectares),
        created_at=site.created_at,
    )


@router.put(
    "/{site_id}",
    response_model=SiteResponse,
)
async def update_site(
    project_id: int,
    site_id: int,
    site_data: SiteUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    query = (
        select(
            Site,
            func.ST_Y(Site.location).label("latitude"),
            func.ST_X(Site.location).label("longitude"),
        )
        .join(Project, Project.id == Site.project_id)
        .where(
            Site.id == site_id,
            Site.project_id == project_id,
        )
    )

    if current_user.role != "administrator":
        query = query.where(Project.user_id == current_user.id)

    result = await db.execute(query)

    row = result.one_or_none()

    if row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site not found",
        )

    site, _, _ = row

    site.name = site_data.name
    site.location = WKTElement(
        f"POINT({site_data.longitude} {site_data.latitude})",
        srid=4326,
    )
    site.area_hectares = site_data.area_hectares

    await db.commit()
    await db.refresh(site)

    return SiteResponse(
        id=site.id,
        name=site.name,
        project_id=site.project_id,
        latitude=site_data.latitude,
        longitude=site_data.longitude,
        area_hectares=float(site.area_hectares),
        created_at=site.created_at,
    )


@router.delete(
    "/{site_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_site(
    project_id: int,
    site_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    query = (
        select(Site)
        .join(Project, Project.id == Site.project_id)
        .where(
            Site.id == site_id,
            Site.project_id == project_id,
        )
    )

    if current_user.role != "administrator":
        query = query.where(Project.user_id == current_user.id)

    result = await db.execute(query)

    site = result.scalar_one_or_none()

    if site is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site not found",
        )

    await db.delete(site)
    await db.commit()


@router.post(
    "/",
    response_model=SiteResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_site(
    project_id: int,
    site_data: SiteCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    project_query = select(Project).where(Project.id == project_id)

    if current_user.role != "administrator":
        project_query = project_query.where(
            Project.user_id == current_user.id
        )

    project_result = await db.execute(project_query)
    project = project_result.scalar_one_or_none()

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    location = WKTElement(
        f"POINT({site_data.longitude} {site_data.latitude})",
        srid=4326,
    )

    site = Site(
        name=site_data.name,
        project_id=project.id,
        location=location,
        area_hectares=site_data.area_hectares,
        created_at=datetime.now(timezone.utc),
    )

    db.add(site)
    await db.commit()
    await db.refresh(site)

    return SiteResponse(
        id=site.id,
        name=site.name,
        project_id=site.project_id,
        latitude=site_data.latitude,
        longitude=site_data.longitude,
        area_hectares=float(site.area_hectares),
        created_at=site.created_at,
    )