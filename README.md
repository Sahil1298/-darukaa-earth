# Darukaa.Earth

Darukaa.Earth is a full-stack geospatial environmental analytics platform for managing environmental projects, geographical sites, and environmental performance data.

The platform is designed to help users organize environmental projects, manage geographical locations, and analyze carbon, biodiversity, and habitat-related information.

## Project Goal

Darukaa.Earth provides a single platform for:

- Creating and managing environmental projects
- Adding and managing geographical sites
- Storing site locations using PostGIS
- Recording environmental measurements
- Visualizing geographical sites on a map
- Analyzing carbon and biodiversity performance over time

The main application relationship is:

    User → Projects → Sites → Metrics

## System Architecture

    React Frontend
          ↓
       HTTP API
          ↓
      FastAPI Backend
          ↓
       SQLAlchemy
          ↓
    PostgreSQL + PostGIS

The frontend is responsible for the user interface and communication with the backend API.

The backend is responsible for authentication, authorization, business logic, validation, and database operations.

PostGIS is used for storing and working with geographical site locations.

## Technology Stack

### Frontend

React

Vite

JavaScript

Fetch API

Planned:

Mapbox GL JS

Highcharts

### Backend

Python

FastAPI

SQLAlchemy

Pydantic

JWT Authentication

Argon2 Password Hashing

### Database

PostgreSQL

PostGIS

GeoAlchemy2

Alembic

### Testing

pytest

FastAPI TestClient

### Development

uv

Node.js

npm

Docker

Git

GitHub

### Planned CI/CD and Deployment

GitHub Actions

Husky

lint-staged

Vercel for frontend

Render for backend

## Current Development Status

### Backend

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

### Frontend

Phase 10A - React and Vite frontend foundation: Completed

Phase 10B - Frontend and FastAPI connection: Completed

Phase 10C - Authentication UI: Completed

Phase 10D - JWT authentication integration: Completed

Phase 10E - Dashboard foundation: Completed

Phase 10F - Project creation and navigation: Completed

### Next Phase

Phase 11 - Project Details and Geospatial Sites

## Current Features

### Authentication

User registration

User login

JWT bearer authentication

Current-user authentication

Logout

Protected API requests

### Projects

Create projects

View authenticated user's projects

Project ownership protection

Project listing on the dashboard

### Geographical Sites

Backend CRUD APIs are implemented.

Site locations are stored as PostGIS POINT geometry using SRID 4326.

Site ownership is protected through the project relationship.

Frontend site management is planned for the next phase.

### Environmental Metrics

Backend CRUD APIs are implemented for site-level environmental metrics.

Current metric data includes:

    recorded_at

    carbon_sequestered

    carbon_avoided

    biodiversity_score

    habitat_area

Frontend metric visualization is planned for a later phase.

## Frontend

The React frontend currently provides:

- Landing page
- Login page
- Registration page
- JWT authentication flow
- Authenticated dashboard
- Project listing
- Project creation
- Back and Cancel navigation
- Logout
- API status display
- Frontend loading and error states

The frontend communicates with the FastAPI backend through a centralized API service.

## Backend API

The backend currently provides:

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

Interactive API documentation is available during local development at:

    http://127.0.0.1:8000/docs

## Project Structure

darukaa-earth/

├── backend/

│   ├── app/

│   ├── alembic/

│   ├── tests/

│   ├── alembic.ini

│   ├── README.md

│   ├── pyproject.toml

│   └── uv.lock

│

├── frontend/

│   ├── public/

│   ├── src/

│   ├── README.md

│   ├── package.json

│   ├── package-lock.json

│   └── vite.config.js

│

├── docker-compose.yml

├── .env.example

├── .gitignore

└── README.md

## Database Architecture

The main database relationship is:

    User
      ↓
    Projects
      ↓
    Sites
      ↓
    Metrics

One user can manage multiple projects.

One project can contain multiple geographical sites.

Each site contains a geographical location stored using PostGIS.

Each site can contain multiple environmental metric records.

## Security

Authentication is implemented using JWT bearer tokens.

Passwords are hashed using Argon2 and are never stored as plain text.

Protected backend resources require authentication.

Project access is restricted to the authenticated user's projects.

Site access is protected through project ownership.

Metric access is protected through site and project ownership.

The frontend does not provide the authoritative user ID when creating projects.

Database credentials and JWT secrets are stored in the local `.env` file and are excluded from Git.

The backend remains the authoritative layer for authentication and authorization.

## Testing

The backend uses an isolated PostgreSQL test database and automated API tests.

Current automated backend test result:

    4 passed

The test suite covers:

    API health

    Database health

    Registration

    Duplicate registration

    Login

    Invalid password

    JWT authentication

    Current-user endpoint

    Project CRUD

    Site CRUD

    Metric CRUD

    Ownership protection

The frontend is currently validated using:

    npm run lint

    npm run build

Manual frontend testing covers:

    Registration

    Login

    Authentication persistence

    Dashboard access

    Project retrieval

    Project creation

    Logout

    Back navigation

## Local Development

### Start the Database

From the project root:

    docker compose up -d

### Start the Backend

    cd backend

    uv run fastapi dev

Backend:

    http://127.0.0.1:8000

Swagger:

    http://127.0.0.1:8000/docs

### Run Backend Tests

    cd backend

    uv run pytest

### Start the Frontend

    cd frontend

    npm run dev

Frontend:

    http://localhost:5173

### Build the Frontend

    cd frontend

    npm run build

### Lint the Frontend

    cd frontend

    npm run lint

## Development Process

The project is developed in meaningful phases.

Each phase follows:

    Build → Test → Document → Commit

Git commits represent development milestones rather than every small implementation change.

Backend and frontend documentation are maintained separately.

Detailed backend documentation is available in:

    backend/README.md

Detailed frontend documentation is available in:

    frontend/README.md

## Git Milestones

Backend:

    feat: initialize FastAPI backend

    feat: add PostgreSQL PostGIS development database

    feat: integrate SQLAlchemy database connection

    feat: add database models and Alembic migration

    feat: add Pydantic request and response schemas

    feat: add project API routers

    feat: add JWT authentication and authorization

    feat: add geographical site APIs

    feat: add environmental metric APIs

    feat: add automated API testing

Frontend:

    React and Vite frontend foundation

    Frontend and FastAPI connection

    Authentication UI

    JWT authentication integration

    Dashboard foundation

    Project creation and navigation

## Development References

The backend architecture and learning process were developed with reference to Corey Schafer's FastAPI course and standard FastAPI project patterns.

Corey Schafer FastAPI repository:

    https://github.com/CoreyMSchafer/FastAPI-Full-Course

FastAPI documentation:

    https://fastapi.tiangolo.com/

## Roadmap

Phase 11 - Project Details and Geospatial Sites

Phase 12 - Interactive Mapbox Site Visualization

Phase 13 - Environmental Metrics Interface

Phase 14 - Carbon and Biodiversity Analytics

Phase 15 - Frontend UX and Security Improvements

Phase 16 - CI/CD and Deployment

Planned platform capabilities include:

    Project details

    Site management interface

    Interactive geographical map

    Environmental metric visualization

    Carbon analytics

    Biodiversity analytics

    Time-based environmental trends

    Geospatial queries

    Automated CI/CD

    Production deployment

## Project Documentation

Backend documentation:

    backend/README.md

Frontend documentation:

    frontend/README.md