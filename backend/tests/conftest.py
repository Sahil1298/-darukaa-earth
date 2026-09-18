import asyncio
import os
import sys

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text

os.environ["DATABASE_URL"] = (
    "postgresql+psycopg://"
    "darukaa:darukaa_dev_password@localhost:5432/darukaa_test"
)

if sys.platform == "win32":
    asyncio.set_event_loop_policy(
        asyncio.WindowsSelectorEventLoopPolicy()
    )

from app.db.database import AsyncSessionLocal, get_db
from app.main import app


async def reset_database():
    async with AsyncSessionLocal() as session:
        await session.execute(
            text(
                "TRUNCATE TABLE "
                "metrics, sites, projects, users "
                "RESTART IDENTITY CASCADE"
            )
        )
        await session.commit()


@pytest.fixture(scope="session", autouse=True)
def configure_database():
    async def override_get_db():
        async with AsyncSessionLocal() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db

    yield

    app.dependency_overrides.clear()


@pytest.fixture(autouse=True)
def clean_database():
    asyncio.run(reset_database())

    yield

    asyncio.run(reset_database())


@pytest.fixture
def client():
    return TestClient(app)