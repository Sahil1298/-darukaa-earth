from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.middleware.cors import CORSMiddleware
import app.models
from app.db.database import get_db
from app.routers import auth
from app.routers import projects
from app.routers import sites
from app.routers import metrics
app = FastAPI(
    title="Darukaa.Earth API",
    description="Geospatial carbon and biodiversity analytics platform",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    projects.router,
    prefix="/api/projects",
)
app.include_router(sites.router)
app.include_router(auth.router)
app.include_router(metrics.router)

@app.get("/")
async def root():
    return {
        "message": "Darukaa.Earth API is running"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }


@app.get("/health/db")
async def database_health(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(text("SELECT 1"))
    value = result.scalar()

    return {
        "database": "connected",
        "result": value,
    }