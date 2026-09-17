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

Phase 5B - FastAPI project routers: Completed

Phase 6 - JWT authentication and authorization: Completed

Next phase: Geographical site APIs

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
│   │   │   ├── config.py
│   │   │   ├── dependencies.py
│   │   │   └── security.py
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
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   └── projects.py
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

JWT configuration is also loaded from the root .env file.

Example:

    JWT_SECRET_KEY=change_me
    JWT_ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=30

The real JWT secret must never be committed to Git.

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

## Phase 5B - FastAPI Project Routers

FastAPI routing was separated from the main application file using APIRouter.

The project router is located at:

    backend/app/routers/projects.py

The router is registered in:

    backend/app/main.py

The project API uses the prefix:

    /api/projects

Current endpoints:

    GET /api/projects/
    GET /api/projects/{project_id}

The project list endpoint reads projects from PostgreSQL using SQLAlchemy.

The project detail endpoint retrieves a project by ID.

When a project does not exist, the API returns HTTP 404 with:

    {
      "detail": "Project not found"
    }

The project list endpoint was tested successfully.

The project detail endpoint was tested with a missing project ID and correctly returned HTTP 404.

This follows the FastAPI router structure used in Corey Schafer's FastAPI course, where API routes are separated into routers and included from the main application.

## Phase 6 - JWT Authentication and Authorization

JWT authentication was added using FastAPI's OAuth2 bearer-token pattern.

The authentication system contains:

    Password hashing with Argon2
    Password verification
    JWT creation
    OAuth2 bearer-token extraction
    Current-user dependency
    User registration
    User login
    Current-user endpoint
    Protected project endpoints
    Project ownership checks

### Password Hashing

Passwords are hashed using:

    pwdlib
    Argon2

Plain-text passwords are never stored in the database.

The password hashing utility is located at:

    backend/app/core/security.py

### User Registration

Registration endpoint:

    POST /api/auth/register

Registration validates the request using:

    UserCreate

A new user's password is hashed before the User record is stored.

Duplicate email registration returns:

    400 Bad Request

Example:

    {
      "detail": "Email already registered"
    }

Successful registration returns:

    201 Created

The response uses:

    UserResponse

so the password and password hash are not returned.

### JWT Login

Login endpoint:

    POST /api/auth/login

The login follows the OAuth2 password form format.

The username field contains the user's email.

The login process:

    Find user by email
    Verify password
    Create JWT
    Return bearer token

Successful login returns:

    {
      "access_token": "...",
      "token_type": "bearer"
    }

Invalid credentials return:

    401 Unauthorized

with:

    {
      "detail": "Incorrect email or password"
    }

### Current User

The OAuth2 bearer scheme is defined using:

    OAuth2PasswordBearer

The token URL is:

    /api/auth/login

The current-user dependency is located at:

    backend/app/core/dependencies.py

The dependency:

    Reads the bearer token
    Decodes the JWT
    Reads the user ID from the "sub" claim
    Finds the user in PostgreSQL
    Returns the authenticated User object

Current-user endpoint:

    GET /api/auth/me

A valid bearer token returns the authenticated user's safe profile.

Requests without a valid bearer token return:

    401 Unauthorized

### Protected Project APIs

Project creation is protected by JWT authentication.

Endpoint:

    POST /api/projects/

The authenticated user's ID is taken from:

    current_user.id

The client does not provide user_id.

The project is therefore associated with the authenticated user.

Project read endpoints are also protected:

    GET /api/projects/
    GET /api/projects/{project_id}

Project queries are filtered by the authenticated user's ID.

This prevents one user from reading another user's projects.

Ownership was tested using a second user.

The second user could:

    GET /api/projects/ → 200 with an empty list

but could not access the first user's project:

    GET /api/projects/1 → 404 Project not found

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

The README is updated as each major phase is completed.

Authentication work is grouped into a meaningful feature commit instead of committing every small implementation step separately.

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

Phase 5B:

    feat: add project API routers

Phase 6:

    feat: add JWT authentication and authorization

## Planned Features

Geographical site creation and management

PostGIS location queries

Carbon analytics

Biodiversity analytics

Interactive Mapbox visualization

Highcharts analytics

Metric APIs

Automated API testing

Ruff linting and formatting

Husky and lint-staged

GitHub Actions CI/CD

Frontend development using React

Frontend deployment using Vercel

Backend deployment using Render