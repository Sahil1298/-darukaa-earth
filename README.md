# Darukaa.Earth

Darukaa.Earth is a full-stack geospatial analytics platform for managing environmental projects and geographical sites and visualizing carbon and biodiversity performance over time.

## Project Goal

The application allows an administrator to create projects, add geographical sites to projects, view sites on an interactive map, and view carbon and biodiversity analytics for each site.

## Technology Stack

Frontend: React, Mapbox GL JS, Highcharts

Backend: Python, FastAPI, SQLAlchemy, Pydantic, JWT

Database: PostgreSQL, PostGIS, GeoAlchemy2

Development and CI/CD: Git, GitHub, GitHub Actions, Husky, lint-staged

Deployment: Vercel for frontend and Render for backend

## Current Development Status

Phase 1 - FastAPI backend foundation: Completed

Phase 2 - PostgreSQL and PostGIS database foundation: Completed

Phase 3 - SQLAlchemy database integration: Completed

Phase 4 - Database models and Alembic migrations: Completed

Phase 5A - Pydantic schemas: Completed

Next phase: FastAPI routers and API endpoints

## Project Structure

darukaa-earth/
├── backend/
│   ├── alembic/
│   │   ├── versions/
│   │   │   └── 6f10c26c3579_create_initial_database_schema.py
│   │   ├── env.py
│   │   ├── README
│   │   └── script.py.mako
│   ├── app/
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   └── config.py
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   └── database.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── metric.py
│   │   │   ├── project.py
│   │   │   ├── site.py
│   │   │   └── user.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── metric.py
│   │   │   ├── project.py
│   │   │   ├── site.py
│   │   │   └── user.py
│   │   ├── __init__.py
│   │   └── main.py
│   ├── alembic.ini
│   ├── .python-version
│   ├── pyproject.toml
│   └── uv.lock
├── frontend/
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md

## Phase 1 - FastAPI Foundation

The backend was created using Python 3.13, uv and FastAPI.

The main application is:

    backend/app/main.py

Current endpoints:

    GET /
    GET /health

FastAPI's interactive API documentation is available at:

    http://127.0.0.1:8000/docs

## Phase 2 - PostgreSQL and PostGIS Database Foundation

PostgreSQL was added as the application database and PostGIS was enabled for geospatial data.

The local database runs through Docker Compose using:

    postgis/postgis:17-3.5

The local stack uses:

    PostgreSQL 17
    PostGIS 3.5
    Docker Compose

Database container:

    darukaa-db

PostgreSQL is exposed locally on:

    localhost:5432

The database can be started with:

    docker compose up -d

PostGIS was verified using:

    SELECT PostGIS_Version();

The local environment reports PostGIS 3.5.

## Database Configuration

Database settings are loaded from the root .env file.

The .env file contains local development credentials and is ignored by Git.

The .env.example file provides the required environment variable names.

Example:

    POSTGRES_DB=darukaa
    POSTGRES_USER=darukaa
    POSTGRES_PASSWORD=change_me
    POSTGRES_PORT=5432
    DATABASE_URL=postgresql+psycopg://darukaa:change_me@localhost:5432/darukaa

## Phase 3 - SQLAlchemy Database Integration

SQLAlchemy was integrated with FastAPI using asynchronous database sessions.

The database layer contains:

    Async SQLAlchemy engine
    Async session factory
    Declarative model base
    FastAPI database dependency

Configuration is loaded using Pydantic Settings.

The database connection uses:

    postgresql+psycopg://

A database health endpoint was added:

    GET /health/db

The endpoint executes:

    SELECT 1

Successful response:

    {
      "database": "connected",
      "result": 1
    }

The endpoint returned HTTP 200, confirming that FastAPI, SQLAlchemy, psycopg and PostgreSQL are connected.

## Phase 4 - Database Models and Alembic Migrations

The application database schema is represented using SQLAlchemy models.

Current models:

    User
    Project
    Site
    Metric

The relationships are:

    User → Projects → Sites → Metrics

The Site model contains a PostGIS geometry column:

    POINT
    SRID 4326

The Site location uses a GiST spatial index:

    idx_sites_location

Alembic was added as the database migration system.

The initial migration was generated using:

    uv run alembic revision --autogenerate -m "create initial database schema"

The generated migration was reviewed before being applied.

The migration was applied using:

    uv run alembic upgrade head

Current migration revision:

    6f10c26c3579

The database contains:

    users
    projects
    sites
    metrics

The Site table was verified with a PostGIS geometry column and GiST spatial index.

Alembic is used to manage future database schema changes.

## Phase 5A - Pydantic Schemas

Pydantic schemas were added to separate API request and response validation from the SQLAlchemy database models.

Current schemas:

    UserCreate
    UserResponse
    Token
    ProjectCreate
    ProjectResponse
    SiteCreate
    SiteResponse
    MetricCreate
    MetricResponse

Request schemas validate incoming API data before it reaches the database.

The SiteCreate schema accepts:

    latitude
    longitude
    area_hectares

Latitude is validated between -90 and 90.

Longitude is validated between -180 and 180.

Area must be greater than zero.

The UserResponse schema does not expose the stored password hash.

Schema validation was tested with valid data and invalid latitude input.

## Database Architecture

The planned database relationship is:

    User → Projects → Sites → Metrics

One user can manage multiple projects.

One project can contain multiple geographical sites.

Each site stores its geographical location using PostGIS.

Each site can contain multiple analytical records for carbon and biodiversity measurements.

## Local Development

Start the database from the project root:

    docker compose up -d

Start the backend:

    cd backend
    uv run fastapi dev

API:

    http://127.0.0.1:8000

Swagger:

    http://127.0.0.1:8000/docs

Check migration status:

    uv run alembic current

Check for pending model changes:

    uv run alembic check

## Development Process

The project is developed in phases.

Each phase follows:

    Build → Test → Document → Commit

Git commits represent meaningful development milestones.

The README is updated as each phase is completed.

## Git Milestones

Phase 1:

    feat: initialize FastAPI backend

Phase 2:

    feat: add PostgreSQL PostGIS development database

Phase 3:

    feat: integrate SQLAlchemy database connection

Phase 4:

    feat: add database models and Alembic migration

Phase 5A:

    feat: add Pydantic request and response schemas

## Planned Features

JWT-based administrator authentication

Project creation and management

Geographical site management

PostGIS-based location storage

Carbon analytics

Biodiversity analytics

Interactive Mapbox visualization

Highcharts analytics

REST API routers

Automated API testing

Ruff linting and formatting

Husky and lint-staged

GitHub Actions CI/CD

Frontend deployment using Vercel

Backend deployment using Render