from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.metric import Metric
from app.models.project import Project
from app.models.site import Site
from app.models.user import User
from app.schemas.metric import MetricCreate, MetricResponse, MetricUpdate


router = APIRouter(
    prefix="/api/projects/{project_id}/sites/{site_id}/metrics",
    tags=["metrics"],
)

@router.get(
    "/",
    response_model=list[MetricResponse],
)
async def get_metrics(
    project_id: int,
    site_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    site_result = await db.execute(
        select(Site)
        .join(Project, Project.id == Site.project_id)
        .where(
            Site.id == site_id,
            Site.project_id == project_id,
            Project.user_id == current_user.id,
        )
    )

    site = site_result.scalar_one_or_none()

    if site is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site not found",
        )

    result = await db.execute(
        select(Metric)
        .where(Metric.site_id == site_id)
        .order_by(Metric.recorded_at)
    )

    metrics = result.scalars().all()

    return [
        MetricResponse(
            id=metric.id,
            site_id=metric.site_id,
            recorded_at=metric.recorded_at,
            carbon_sequestered=float(metric.carbon_sequestered),
            carbon_avoided=float(metric.carbon_avoided),
            biodiversity_score=float(metric.biodiversity_score),
            habitat_area=float(metric.habitat_area),
        )
        for metric in metrics
    ]

@router.get(
    "/{metric_id}",
    response_model=MetricResponse,
)
async def get_metric(
    project_id: int,
    site_id: int,
    metric_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    result = await db.execute(
        select(Metric)
        .join(Site, Site.id == Metric.site_id)
        .join(Project, Project.id == Site.project_id)
        .where(
            Metric.id == metric_id,
            Metric.site_id == site_id,
            Site.project_id == project_id,
            Project.user_id == current_user.id,
        )
    )

    metric = result.scalar_one_or_none()

    if metric is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Metric not found",
        )

    return MetricResponse(
        id=metric.id,
        site_id=metric.site_id,
        recorded_at=metric.recorded_at,
        carbon_sequestered=float(metric.carbon_sequestered),
        carbon_avoided=float(metric.carbon_avoided),
        biodiversity_score=float(metric.biodiversity_score),
        habitat_area=float(metric.habitat_area),
    )

@router.put(
    "/{metric_id}",
    response_model=MetricResponse,
)
async def update_metric(
    project_id: int,
    site_id: int,
    metric_id: int,
    metric_data: MetricUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    result = await db.execute(
        select(Metric)
        .join(Site, Site.id == Metric.site_id)
        .join(Project, Project.id == Site.project_id)
        .where(
            Metric.id == metric_id,
            Metric.site_id == site_id,
            Site.project_id == project_id,
            Project.user_id == current_user.id,
        )
    )

    metric = result.scalar_one_or_none()

    if metric is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Metric not found",
        )

    metric.recorded_at = metric_data.recorded_at
    metric.carbon_sequestered = metric_data.carbon_sequestered
    metric.carbon_avoided = metric_data.carbon_avoided
    metric.biodiversity_score = metric_data.biodiversity_score
    metric.habitat_area = metric_data.habitat_area

    await db.commit()
    await db.refresh(metric)

    return MetricResponse(
        id=metric.id,
        site_id=metric.site_id,
        recorded_at=metric.recorded_at,
        carbon_sequestered=float(metric.carbon_sequestered),
        carbon_avoided=float(metric.carbon_avoided),
        biodiversity_score=float(metric.biodiversity_score),
        habitat_area=float(metric.habitat_area),
    )

@router.delete(
    "/{metric_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_metric(
    project_id: int,
    site_id: int,
    metric_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    result = await db.execute(
        select(Metric)
        .join(Site, Site.id == Metric.site_id)
        .join(Project, Project.id == Site.project_id)
        .where(
            Metric.id == metric_id,
            Metric.site_id == site_id,
            Site.project_id == project_id,
            Project.user_id == current_user.id,
        )
    )

    metric = result.scalar_one_or_none()

    if metric is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Metric not found",
        )

    await db.delete(metric)
    await db.commit()

@router.post(
    "/",
    response_model=MetricResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_metric(
    project_id: int,
    site_id: int,
    metric_data: MetricCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    result = await db.execute(
        select(Site)
        .join(Project, Project.id == Site.project_id)
        .where(
            Site.id == site_id,
            Site.project_id == project_id,
            Project.user_id == current_user.id,
        )
    )

    site = result.scalar_one_or_none()

    if site is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site not found",
        )

    metric = Metric(
        site_id=site.id,
        recorded_at=metric_data.recorded_at,
        carbon_sequestered=metric_data.carbon_sequestered,
        carbon_avoided=metric_data.carbon_avoided,
        biodiversity_score=metric_data.biodiversity_score,
        habitat_area=metric_data.habitat_area,
    )

    db.add(metric)
    await db.commit()
    await db.refresh(metric)

    return MetricResponse(
        id=metric.id,
        site_id=metric.site_id,
        recorded_at=metric.recorded_at,
        carbon_sequestered=float(metric.carbon_sequestered),
        carbon_avoided=float(metric.carbon_avoided),
        biodiversity_score=float(metric.biodiversity_score),
        habitat_area=float(metric.habitat_area),
    )