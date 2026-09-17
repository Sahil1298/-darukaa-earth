from datetime import datetime

from pydantic import BaseModel, Field


class MetricCreate(BaseModel):
    recorded_at: datetime

    carbon_sequestered: float = Field(
        ge=0,
    )

    carbon_avoided: float = Field(
        ge=0,
    )

    biodiversity_score: float = Field(
        ge=0,
        le=100,
    )

    habitat_area: float = Field(
        ge=0,
    )


class MetricResponse(BaseModel):
    id: int
    site_id: int
    recorded_at: datetime
    carbon_sequestered: float
    carbon_avoided: float
    biodiversity_score: float
    habitat_area: float