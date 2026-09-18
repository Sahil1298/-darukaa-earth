# Darukaa.Earth Backend

Darukaa.Earth is a full-stack geospatial environmental analytics platform for managing environmental projects, geographical sites, and environmental performance data.

This README documents the backend implementation built using FastAPI, SQLAlchemy, PostgreSQL, PostGIS, Pydantic, JWT authentication, and pytest.

## Backend Goal

The backend provides the API and database layer for Darukaa.Earth.

It supports:

- User registration and login
- JWT authentication and authorization
- Environmental project management
- Geographical site management
- PostGIS-based location storage
- Environmental metric management
- Project and resource ownership protection
- Automated API testing

The backend follows the relationship:

User → Projects → Sites → Metrics

## Technology Stack

Backend: Python, FastAPI, SQLAlchemy, Pydantic, JWT

Database: PostgreSQL, PostGIS, GeoAlchemy2

Authentication: OAuth2 bearer tokens, JWT, Argon2 password hashing

Testing: pytest, FastAPI TestClient

Database migrations: Alembic

Development tools: uv, Git, GitHub, Docker

## Backend Development Status

Phase 1 - FastAPI backend foundation: Completed

Phase 2 - PostgreSQL and PostGIS database foundation: Completed

Phase 3 - SQLAlchemy database integration: Completed

Phase 4 - Database models and Alembic migrations: Completed

Phase 5A - Pydantic schemas: Completed

Phase 5B - FastAPI project routers: Completed

Phase 6 - JWT authentication and authorization: Completed

Phase 7 - Geographical site APIs: Completed

Phase 8 - Environmental metric APIs: Completed

Phase 9 - Automated API testing: Completed

The backend is now the API and database foundation for the React frontend.

## Backend Project Structure

backend/

├── alembic/

│   ├── versions/

│   │   └── 6f10c26c3579_create_initial_database_schema.py

│   ├── env.py

│   ├── README

│   └── script.py.mako

├── app/

│   ├── core/

│   │   ├── __init__.py

│   │   ├── config.py

│   │   ├── dependencies.py

│   │   └── security.py

│   │

│   ├── db/

│   │   ├── __init__.py

│   │   └── database.py

│   │

│   ├── models/

│   │   ├── __init__.py

│   │   ├── metric.py

│   │   ├── project.py

│   │   ├── site.py

│   │   └── user.py

│   │

│   ├── schemas/

│   │   ├── __init__.py

│   │   ├── auth.py

│   │   ├── metric.py

│   │   ├── project.py

│   │   ├── site.py

│   │   └── user.py

│   │

│   ├── routers/

│   │   ├── __init__.py

│   │   ├── auth.py

│   │   ├── metrics.py

│   │   ├── projects.py

│   │   └── sites.py

│   │

│   ├── __init__.py

│   └── main.py

├── tests/

│   ├── __init__.py

│   ├── conftest.py

│   ├── test_auth.py

│   ├── test_authorization.py

│   ├── test_main.py

│   └── test_resources.py

├── alembic.ini

├── .python-version

├── pyproject.toml

└── uv.lock

## Phase 1 - FastAPI Foundation

The backend was created using Python 3.13, uv, and FastAPI.

The main application is:

    backend/app/main.py

The backend provides:

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

The endpoint returned HTTP 200, confirming that FastAPI, SQLAlchemy, psycopg, and PostgreSQL are connected.

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

    SiteUpdate

    SiteResponse

    MetricCreate

    MetricUpdate

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

The project API uses the prefix:

    /api/projects

Current project endpoints:

    GET /api/projects/

    GET /api/projects/{project_id}

    POST /api/projects/

Project creation associates the project with the authenticated user.

When a project does not exist, the API returns HTTP 404 with:

    {
      "detail": "Project not found"
    }

The router structure follows the FastAPI pattern of separating API routes into dedicated routers and including them from the main application.

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

The project is associated with the authenticated user.

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

## Phase 7 - Geographical Site APIs

Site management was added using the existing PostGIS Site model and authenticated project ownership.

The site router is located at:

    backend/app/routers/sites.py

The site API uses the prefix:

    /api/projects/{project_id}/sites

Current site endpoints:

    POST /api/projects/{project_id}/sites/

    GET /api/projects/{project_id}/sites/

    GET /api/projects/{project_id}/sites/{site_id}

    PUT /api/projects/{project_id}/sites/{site_id}

    DELETE /api/projects/{project_id}/sites/{site_id}

### Site Creation

A site is created inside an authenticated user's project.

The request accepts:

    name

    latitude

    longitude

    area_hectares

The API converts latitude and longitude into a PostGIS point:

    POINT(longitude latitude)

The geometry uses:

    SRID 4326

The client does not provide project ownership information.

The API verifies that the selected project belongs to the authenticated user before creating the site.

### Site Retrieval

The API converts the stored PostGIS point back into:

    latitude

    longitude

PostGIS functions are used to read:

    ST_Y(location) → latitude

    ST_X(location) → longitude

The site list endpoint returns only sites belonging to a project owned by the authenticated user.

The single-site endpoint checks:

    Site ID

    Project ID

    Project ownership

before returning the site.

### Site Update

A site can be updated using:

    PUT /api/projects/{project_id}/sites/{site_id}

The update request accepts:

    name

    latitude

    longitude

    area_hectares

The PostGIS location is replaced with the updated coordinates.

The API verifies ownership before modifying the site.

### Site Deletion

A site can be deleted using:

    DELETE /api/projects/{project_id}/sites/{site_id}

Successful deletion returns:

    204 No Content

The API verifies ownership before deleting the site.

### Site Authorization

Site creation, retrieval, update, and deletion are protected by JWT authentication.

A user cannot access or modify sites belonging to another user's project.

Authorization was tested using a second user.

Unauthorized site access, update, and deletion requests were rejected.

### PostGIS Verification

The Site location was verified directly in PostgreSQL.

Example stored geometry:

    POINT(72.906 19.1176)

SRID:

    4326

This confirms that the API coordinates are stored as PostGIS geometry rather than plain text or separate database coordinate fields.

## Phase 8 - Environmental Metric APIs

Environmental metric management was added for individual geographical sites.

The metric router is located at:

    backend/app/routers/metrics.py

The metric API uses the prefix:

    /api/projects/{project_id}/sites/{site_id}/metrics

Current metric endpoints:

    POST /api/projects/{project_id}/sites/{site_id}/metrics/

    GET /api/projects/{project_id}/sites/{site_id}/metrics/

    GET /api/projects/{project_id}/sites/{site_id}/metrics/{metric_id}

    PUT /api/projects/{project_id}/sites/{site_id}/metrics/{metric_id}

    DELETE /api/projects/{project_id}/sites/{site_id}/metrics/{metric_id}

### Metric Creation

A metric is created for an authenticated user's site.

The request accepts:

    recorded_at

    carbon_sequestered

    carbon_avoided

    biodiversity_score

    habitat_area

The API verifies:

    Metric site

    Site project

    Project ownership

before creating the metric.

### Metric Retrieval

The API can return all metrics belonging to a site:

    GET /api/projects/{project_id}/sites/{site_id}/metrics/

A single metric can be retrieved using:

    GET /api/projects/{project_id}/sites/{site_id}/metrics/{metric_id}

Metric queries are filtered through the project and site ownership chain.

A missing metric returns:

    404 Not Found

Example:

    {
      "detail": "Metric not found"
    }

### Metric Update

A metric can be updated using:

    PUT /api/projects/{project_id}/sites/{site_id}/metrics/{metric_id}

The update request accepts:

    recorded_at

    carbon_sequestered

    carbon_avoided

    biodiversity_score

    habitat_area

The API validates the data using:

    MetricUpdate

Ownership is checked before the metric is modified.

### Metric Deletion

A metric can be deleted using:

    DELETE /api/projects/{project_id}/sites/{site_id}/metrics/{metric_id}

Successful deletion returns:

    204 No Content

The metric is removed from PostgreSQL.

Ownership is checked before deletion.

### Metric Authorization

Metric creation, retrieval, update, and deletion are protected by JWT authentication.

The ownership chain is:

    User → Project → Site → Metric

A user cannot access or modify metrics belonging to another user's site.

Authorization was tested using a second user.

Unauthorized metric creation, retrieval, update, and deletion requests were rejected.

### Database Verification

Metric creation, update, and deletion were verified against PostgreSQL.

This confirms that the metric API is connected through:

    FastAPI

    Pydantic

    SQLAlchemy

    PostgreSQL

## Phase 9 - Automated API Testing

Automated API tests were added using:

    pytest

    FastAPI TestClient

A separate PostgreSQL database is used for testing:

    darukaa_test

The test database contains the same application schema as the development database.

PostGIS was enabled in the test database.

The test environment uses a Windows SelectorEventLoop so asynchronous psycopg connections work correctly during pytest.

The test configuration is located at:

    backend/tests/conftest.py

The test configuration:

    Points tests to darukaa_test

    Overrides the FastAPI database dependency

    Provides a reusable TestClient fixture

    Cleans database data between tests

Current test files:

    test_main.py

    test_auth.py

    test_resources.py

    test_authorization.py

Current automated coverage includes:

    Basic API health

    Database health

    User registration

    Duplicate registration

    User login

    Wrong-password rejection

    JWT authentication

    Current-user endpoint

    Project CRUD flow

    Site CRUD flow

    Metric CRUD flow

    Ownership protection

The complete test suite was validated successfully.

Current test result:

    4 passed

## Database Architecture

The database relationship is:

    User → Projects → Sites → Metrics

One user can manage multiple projects.

One project can contain multiple geographical sites.

Each site stores its geographical location using PostGIS.

Each site can contain multiple environmental metric records.

## API Endpoint Summary

### Application

    GET /

    GET /health

    GET /health/db

### Authentication

    POST /api/auth/register

    POST /api/auth/login

    GET /api/auth/me

### Projects

    GET /api/projects/

    GET /api/projects/{project_id}

    POST /api/projects/

### Sites

    POST /api/projects/{project_id}/sites/

    GET /api/projects/{project_id}/sites/

    GET /api/projects/{project_id}/sites/{site_id}

    PUT /api/projects/{project_id}/sites/{site_id}

    DELETE /api/projects/{project_id}/sites/{site_id}

### Metrics

    POST /api/projects/{project_id}/sites/{site_id}/metrics/

    GET /api/projects/{project_id}/sites/{site_id}/metrics/

    GET /api/projects/{project_id}/sites/{site_id}/metrics/{metric_id}

    PUT /api/projects/{project_id}/sites/{site_id}/metrics/{metric_id}

    DELETE /api/projects/{project_id}/sites/{site_id}/metrics/{metric_id}

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

Run tests:

    cd backend

    uv run pytest

Check migration status:

    uv run alembic current

Check for pending model changes:

    uv run alembic check

## Security Notes

The backend is responsible for enforcing authentication and authorization.

JWT tokens are validated by the backend.

Protected resources require a valid bearer token.

Project ownership is checked before project access.

Site ownership is checked through the project relationship.

Metric ownership is checked through the site and project relationships.

The frontend does not provide the authoritative user_id for project ownership.

Passwords are stored only as Argon2 password hashes.

JWT secrets and database credentials are stored in the local .env file and must not be committed to Git.

## Development Process

The backend was developed in phases.

Each phase follows:

    Build → Test → Document → Commit

Git commits represent meaningful development milestones.

The backend README documents the completed backend phases.

Features were grouped into meaningful commits instead of committing every small implementation step separately.

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

Phase 7:

    feat: add geographical site APIs

Phase 8:

    feat: add environmental metric APIs

Phase 9:

    feat: add automated API testing

## Backend Completion

The backend foundation is complete through Phase 9.

The backend now provides:

    FastAPI application

    PostgreSQL database

    PostGIS geospatial storage

    SQLAlchemy integration

    Alembic migrations

    Pydantic validation

    JWT authentication

    Authorization and ownership protection

    Project APIs

    Geographical site APIs

    Environmental metric APIs

    Automated API tests

Frontend development is maintained separately in:

    ../frontend/README.md