from fastapi import FastAPI

app = FastAPI(
    title="Darukaa.Earth API",
    description="Geospatial carbon and biodiversity analytics platform",
    version="1.0.0",
)


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