from datetime import datetime

from pydantic import BaseModel, Field


class SiteCreate(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=150,
    )

    latitude: float = Field(
        ge=-90,
        le=90,
    )

    longitude: float = Field(
        ge=-180,
        le=180,
    )

    area_hectares: float = Field(
        gt=0,
    )

class SiteUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    area_hectares: float = Field(gt=0)
    
class SiteResponse(BaseModel):
    id: int
    name: str
    project_id: int
    latitude: float
    longitude: float
    area_hectares: float
    created_at: datetime