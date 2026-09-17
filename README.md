# Darukaa.Earth

Darukaa.Earth is a full-stack geospatial analytics platform for managing environmental projects and geographical sites and visualizing carbon and biodiversity performance over time.

## Project Goal

The application allows an administrator to create projects, add multiple geographical sites to projects, view sites on an interactive map, and view carbon and biodiversity analytics for each site.

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

Next phase: Database models and Alembic migrations

## Project Structure

darukaa-earth/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   └── config.py
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   └── database.py
│   │   ├── __init__.py
│   │   └── main.py
│   ├── .python-version
│   ├── pyproject.toml
│   └── uv.lock
├── frontend/
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md

## Phase 1 - FastAPI Foundation

The initial backend was created using Python 3.13, uv and FastAPI.

The FastAPI application is located at:

    backend/app/main.py

The application currently provides:

    GET /

which returns a basic API running message.

The application also provides:

    GET /health

which is used as a simple health-check endpoint.

FastAPI's interactive Swagger documentation was verified through:

    http://127.0.0.1:8000/docs

## Phase 2 - PostgreSQL and PostGIS Database Foundation

PostgreSQL was added as the project database and PostGIS was used to support geographical data.

The local database runs through Docker Compose using the PostGIS image:

    postgis/postgis:17-3.5

The local database uses:

    PostgreSQL 17
    PostGIS 3.5
    Docker Compose

The database container is named:

    darukaa-db

The PostgreSQL service is exposed locally on:

    localhost:5432

The database was started using:

    docker compose up -d

The container was verified using:

    docker compose ps

PostgreSQL access was tested using:

    docker exec -it darukaa-db psql -U darukaa -d darukaa

PostGIS was verified using:

    SELECT PostGIS_Version();

The local environment successfully reported PostGIS 3.5.

## Database Configuration

Database configuration is stored in the local .env file.

The .env file contains local development credentials and is ignored by Git.

The .env.example file provides the required environment variable names without storing the actual local credentials.

Example variables:

    POSTGRES_DB=darukaa
    POSTGRES_USER=darukaa
    POSTGRES_PASSWORD=change_me
    POSTGRES_PORT=5432
    DATABASE_URL=postgresql+psycopg://darukaa:change_me@localhost:5432/darukaa

## Phase 3 - SQLAlchemy Database Integration

SQLAlchemy was integrated with the FastAPI backend to communicate asynchronously with PostgreSQL.

Pydantic Settings is used to load configuration from the root .env file.

The database layer currently contains:

    Async SQLAlchemy engine
    Async session factory
    Declarative model base
    FastAPI database dependency

The database connection uses the PostgreSQL psycopg driver through:

    postgresql+psycopg://

The database session dependency is provided through:

    get_db()

A database health-check endpoint was added:

    GET /health/db

The endpoint executes:

    SELECT 1

A successful response is:

    {
      "database": "connected",
      "result": 1
    }

The endpoint returned HTTP 200, confirming that FastAPI, SQLAlchemy, psycopg and the PostgreSQL database are connected successfully.

## Database Architecture

The planned database relationship is:

    User → Projects → Sites → Metrics

A user can manage multiple projects.

A project can contain multiple geographical sites.

Each site will store its geographical location using PostGIS.

Each site can contain multiple analytical records for carbon and biodiversity measurements.

## Planned Backend Structure

backend/app/

    core/
    db/
    models/
    schemas/
    routers/
    services/

The backend will be gradually separated into these components as the project grows.

## Local Development

Start the database from the project root:

    docker compose up -d

Start the FastAPI backend:

    cd backend
    uv run fastapi dev

The API runs at:

    http://127.0.0.1:8000

Interactive API documentation:

    http://127.0.0.1:8000/docs

## Development Process

The project is being developed in phases.

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

## Planned Features

JWT-based administrator authentication

Project creation and management

Geographical site management

PostGIS-based location storage

Carbon analytics

Biodiversity analytics

Interactive Mapbox visualization

Highcharts analytics

Automated API testing

Ruff linting and formatting

Pre-commit code quality checks using Husky and lint-staged

GitHub Actions CI/CD

Frontend deployment using Vercel

Backend deployment using Render

## Future Documentation

The README will be expanded as the following phases are implemented:

Database models and schema

Alembic migrations

Authentication and JWT

Project and site APIs

Analytics APIs

React frontend

Mapbox integration

Highcharts integration

Testing

CI/CD

Deployment

Live demo