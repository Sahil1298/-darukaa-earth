# Darukaa.Earth

Darukaa.Earth is a full-stack geospatial analytics platform for managing environmental projects and geographical sites and visualizing carbon and biodiversity performance over time.

## Project Goal

The application allows an administrator to create projects, add geographical sites to those projects, view the sites on an interactive map, and view carbon and biodiversity analytics for each site.

## Technology Stack

Frontend: React, Mapbox GL JS, Highcharts

Backend: Python, FastAPI, SQLAlchemy, Pydantic, JWT

Database: PostgreSQL, PostGIS, GeoAlchemy2

Development and CI/CD: Git, GitHub, GitHub Actions, Husky, lint-staged

Deployment: Vercel for frontend and Render for backend

## Current Development Status

Phase 1 - FastAPI backend foundation: Completed

Phase 2 - PostgreSQL and PostGIS database foundation: Completed

Next phase: SQLAlchemy database integration and application models

## Project Structure

darukaa-earth/
├── backend/
│   ├── app/
│   │   └── main.py
│   ├── pyproject.toml
│   ├── uv.lock
│   └── .python-version
├── frontend/
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md

## Backend Setup

The backend uses Python 3.13 and uv for dependency and virtual environment management.

From the backend directory:

    cd backend
    uv run fastapi dev app/main.py

The FastAPI application runs at:

    http://127.0.0.1:8000

Interactive API documentation is available at:

    http://127.0.0.1:8000/docs

## Phase 1 - FastAPI Foundation

The initial FastAPI application was created in backend/app/main.py.

The application currently provides:

    GET /

which returns a basic API running message.

The application also provides:

    GET /health

which is used as a simple health-check endpoint.

FastAPI Swagger documentation was verified through the /docs endpoint.

## Database

Darukaa.Earth uses PostgreSQL with PostGIS because the application needs to store and work with geographical site locations.

The local database runs in Docker using Docker Compose.

The local database stack uses:

PostgreSQL 17

PostGIS 3.5

Docker Compose

## Database Configuration

Database configuration is stored in the local .env file.

The .env file contains local development values and is ignored by Git.

The .env.example file provides the variable names required to configure the database without storing real local secrets in the repository.

Example variables:

    POSTGRES_DB=darukaa
    POSTGRES_USER=darukaa
    POSTGRES_PASSWORD=change_me
    POSTGRES_PORT=5432

## Starting the Database

From the project root:

    docker compose up -d

Check the database container:

    docker compose ps

The PostgreSQL database is exposed locally on port 5432.

The container name is:

    darukaa-db

## PostgreSQL and PostGIS Verification

The database can be accessed from inside the container using:

    docker exec -it darukaa-db psql -U darukaa -d darukaa

PostgreSQL was verified successfully.

PostGIS was verified using:

    SELECT PostGIS_Version();

The current local environment successfully reports PostGIS 3.5.

## Database Architecture

The planned database structure is:

User → Projects → Sites → Metrics

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

The application will be gradually separated into these components as development continues.

## Development Process

The project is being developed in phases.

Each phase follows:

Build → Test → Document → Commit

Git commits represent meaningful development milestones.

## Git Milestones

Phase 1 commit:

    feat: initialize FastAPI backend

Phase 2 database commit:

    feat: add PostgreSQL PostGIS development database

## Local Development

Start the database:

    docker compose up -d

Start the FastAPI backend:

    cd backend
    uv run fastapi dev app/main.py

The frontend will be added in a later phase.

## Planned Features

Administrator authentication using JWT

Project creation and management

Geographical site management

PostGIS-based location storage

Carbon analytics

Biodiversity analytics

Interactive Mapbox visualization

Highcharts analytics

Automated testing

Linting and formatting

GitHub Actions CI/CD

Frontend deployment

Backend deployment