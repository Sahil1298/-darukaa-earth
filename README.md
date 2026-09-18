# Darukaa.Earth

Darukaa.Earth is a full-stack geospatial environmental analytics platform for managing environmental projects, geographical sites, carbon measurements, biodiversity data, and habitat information.

The platform combines a React frontend, FastAPI backend, PostgreSQL/PostGIS database, interactive Mapbox mapping, and Chart.js visualization.

## Project Overview

Darukaa.Earth allows authenticated users to create and manage environmental projects, add geographical sites to projects, record environmental metrics, and view the data through an interactive map and charts.

The platform also includes an Administrator role. Administrators can access projects across the platform, while normal users remain restricted to their own project data.

The project is designed as a practical environmental monitoring and analytics platform with a focus on geospatial data, secure APIs, and clear data visualization.

## Core User Stories

### Administrator

- As an administrator, I want to create a new project and add geographical sites to it.
- As an administrator, I want to view projects and sites on an interactive map.
- As an administrator, I want to open a specific site and view its environmental analytics and performance over time.

### Normal User

- As a user, I want to create my own environmental projects.
- As a user, I want to add geographical sites to my projects.
- As a user, I want to record environmental metrics for my sites.
- As a user, I want to view my environmental data through maps and charts.
- As a user, I should not be able to access another user's private project data.

## Key Features

### User Authentication

- User registration
- User login
- JWT-based authentication
- Password hashing using Argon2 through `pwdlib`
- Authenticated user profile endpoint
- Administrator and normal user roles

### Role-Based Access

The platform supports two roles:

- `user`
- `administrator`

Normal users can access only their own projects, sites, and metrics.

Administrators can access projects, sites, and metrics across users.

Normal registration does not allow a user to assign the `administrator` role to themselves.

### Project Management

- Create projects
- View projects
- Open individual projects
- Project ownership enforcement
- Administrator access to all projects

### Geospatial Site Management

- Create sites using latitude and longitude
- Store site locations using PostGIS
- View geographical sites on an interactive Mapbox map
- Update site information and coordinates
- Delete sites
- Store area in hectares
- GiST spatial index for site location data

### Environmental Metrics

Each site can contain environmental measurements including:

- Carbon sequestered
- Carbon avoided
- Biodiversity score
- Habitat area
- Recorded timestamp

Metrics can be:

- Created
- Viewed
- Updated
- Deleted
- Displayed as historical data

### Data Visualization

Environmental data is visualized using Chart.js.

The frontend provides a time-based chart for environmental metrics so project and site performance can be viewed over time.

### Interactive Mapping

Mapbox GL JS is used for geographical visualization.

The map displays site locations and provides:

- Interactive map navigation
- Site markers
- Site information popups
- Automatic map fitting for multiple sites
- Site-focused navigation for individual sites

### Automated Testing

The backend contains automated integration tests covering:

- API health
- Database health
- User registration
- Duplicate registration protection
- Authentication
- JWT-based `/me` access
- Project creation
- Site creation
- Metric creation
- Resource access
- Ownership protection
- Administrator access

Current backend test result:

```text
5 passed
```

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- Mapbox GL JS
- Chart.js
- React Chart.js 2
- CSS

### Backend

- Python
- FastAPI
- SQLAlchemy
- SQLAlchemy Async
- Pydantic
- PostgreSQL
- PostGIS
- GeoAlchemy2
- Alembic
- PyJWT
- OAuth2 Password Flow
- `pwdlib` with Argon2 password hashing

### Development and Deployment

- Git
- GitHub
- Docker
- Docker Desktop
- uv
- Render

## System Architecture

```text
                         ┌─────────────────────────┐
                         │       React Frontend    │
                         │        Vite + React     │
                         │                         │
                         │  Mapbox GL JS + Chart.js│
                         └────────────┬────────────┘
                                      │
                                      │ HTTP / JSON
                                      │ JWT
                                      ▼
                         ┌─────────────────────────┐
                         │      FastAPI Backend    │
                         │                         │
                         │  Authentication         │
                         │  Authorization          │
                         │  Projects               │
                         │  Sites                  │
                         │  Metrics                │
                         └────────────┬────────────┘
                                      │
                                      │ SQLAlchemy
                                      ▼
                         ┌─────────────────────────┐
                         │   PostgreSQL + PostGIS  │
                         │                         │
                         │ Users                   │
                         │ Projects                │
                         │ Sites                   │
                         │ Metrics                 │
                         │ Geospatial data         │
                         └─────────────────────────┘
```

## Data Model

The application follows this ownership hierarchy:

```text
User
  │
  └── Projects
        │
        └── Sites
              │
              └── Metrics
```

### User

Stores:

- ID
- Name
- Email
- Password hash
- Role
- Created timestamp

### Project

Stores:

- ID
- Name
- Description
- Owner user ID
- Created timestamp

### Site

Stores:

- ID
- Name
- Project ID
- PostGIS location
- Area in hectares
- Created timestamp

The current site location is stored as a PostGIS `POINT` with SRID `4326`.

Coordinates are stored using:

```text
POINT(longitude latitude)
```

### Metric

Stores:

- ID
- Site ID
- Recorded timestamp
- Carbon sequestered
- Carbon avoided
- Biodiversity score
- Habitat area

## Project Structure

```text
darukaa-earth/
│
├── backend/
│   ├── .venv/
│   ├── .python-version
│   ├── pyproject.toml
│   ├── uv.lock
│   ├── alembic.ini
│   │
│   ├── alembic/
│   │   ├── README
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   └── versions/
│   │       ├── 6f10c26c3579_create_initial_database_schema.py
│   │       └── xxxxxxxxxxxx_add_user_role.py
│   │
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   │
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py
│   │   │   ├── dependencies.py
│   │   │   └── security.py
│   │   │
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   └── database.py
│   │   │
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── project.py
│   │   │   ├── site.py
│   │   │   └── metric.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── user.py
│   │   │   ├── project.py
│   │   │   ├── site.py
│   │   │   └── metric.py
│   │   │
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── auth.py
│   │       ├── projects.py
│   │       ├── sites.py
│   │       └── metrics.py
│   │
│   └── tests/
│       ├── __init__.py
│       ├── conftest.py
│       ├── test_main.py
│       ├── test_auth.py
│       ├── test_resources.py
│       └── test_authorization.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── SiteMap.jsx
│   │   │
│   │   ├── hooks/
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ProjectDetails.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   └── vite.config.js
│
├── .env
├── .env.example
├── .gitignore
└── README.md
```

## Backend API

### Authentication

#### Register

```http
POST /api/auth/register
```

Creates a normal user account.

#### Login

```http
POST /api/auth/login
```

Uses OAuth2 password form data and returns a JWT access token.

#### Current User

```http
GET /api/auth/me
```

Returns the authenticated user's information, including role.

Example response:

```json
{
  "id": 1,
  "name": "Example User",
  "email": "example@example.com",
  "role": "user"
}
```

An administrator account returns:

```json
{
  "id": 1,
  "name": "Example Admin",
  "email": "admin@example.com",
  "role": "administrator"
}
```

### Projects

```http
GET /api/projects/
GET /api/projects/{project_id}
POST /api/projects/
```

Normal users receive only their own projects.

Administrators can view projects across users.

### Sites

```http
GET /api/projects/{project_id}/sites/
GET /api/projects/{project_id}/sites/{site_id}
POST /api/projects/{project_id}/sites/
PUT /api/projects/{project_id}/sites/{site_id}
DELETE /api/projects/{project_id}/sites/{site_id}
```

### Metrics

```http
GET /api/projects/{project_id}/sites/{site_id}/metrics/
GET /api/projects/{project_id}/sites/{site_id}/metrics/{metric_id}
POST /api/projects/{project_id}/sites/{site_id}/metrics/
PUT /api/projects/{project_id}/sites/{site_id}/metrics/{metric_id}
DELETE /api/projects/{project_id}/sites/{site_id}/metrics/{metric_id}
```

### Health

```http
GET /
GET /health
GET /health/db
```

The database health endpoint checks whether the FastAPI application can communicate with PostgreSQL.

## Authentication and Authorization

Darukaa.Earth uses JWT bearer authentication.

The authentication flow is:

```text
User
  ↓
Register / Login
  ↓
FastAPI validates credentials
  ↓
JWT access token generated
  ↓
Frontend stores token
  ↓
Frontend sends Bearer token with protected API requests
  ↓
FastAPI validates token
  ↓
Current user loaded from database
  ↓
Authorization rules applied
```

### Normal User

A normal user can access only resources connected to their own account.

For example:

```text
User A
 └── Project A
      └── Site A
           └── Metric A
```

User B cannot access User A's private resources.

### Administrator

An administrator can access projects, sites, and metrics across users.

The role is stored in the `users.role` column.

The supported values are:

```text
user
administrator
```

Registration always creates:

```text
role = user
```

Administrator accounts are promoted separately by an authorized database operation.

## Database and Migrations

Alembic is used for database schema management.

Initial schema migration:

```text
6f10c26c3579_create_initial_database_schema.py
```

Administrator role migration:

```text
xxxxxxxxxxxx_add_user_role.py
```

The administrator migration adds:

```text
users.role
```

with:

```text
user
```

as the default role for existing users.

## Local Development

### Prerequisites

Install:

- Python
- uv
- Node.js
- npm
- Docker Desktop
- Git

### Clone the Repository

```bash
git clone https://github.com/Sahil1298/-darukaa-earth.git
cd darukaa-earth
```

## Backend Setup

Move into the backend directory:

```powershell
cd backend
```

Create or sync the Python environment:

```powershell
uv sync
```

Run the database migrations:

```powershell
uv run alembic upgrade head
```

Start the FastAPI development server:

```powershell
uv run uvicorn app.main:app --reload
```

The backend will normally be available at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

## Frontend Setup

Open a second terminal and move into:

```powershell
cd C:\darukaa-earth\frontend
```

Install dependencies:

```powershell
npm install
```

Start the Vite development server:

```powershell
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

## Environment Variables

Environment-specific values are stored in environment files and should not be committed to Git.

The root `.gitignore` includes `.env`.

### Backend

The backend uses configuration values for:

- Database connection
- JWT secret
- JWT algorithm
- Access token expiration

Use `.env.example` as the template for local configuration.

### Frontend

The frontend uses:

```text
VITE_API_BASE_URL
VITE_MAPBOX_TOKEN
```

`VITE_API_BASE_URL` points to the FastAPI backend.

`VITE_MAPBOX_TOKEN` is used by Mapbox GL JS.

Do not commit private environment values or production secrets.

## Docker PostgreSQL/PostGIS

For local development, PostgreSQL with PostGIS can be run using Docker.

The project uses a PostGIS-enabled PostgreSQL image.

The local database configuration is conceptually:

```text
Database: darukaa
User: <local database user>
Password: <local database password>
Host: localhost
Port: 5432
```

The test database is separate:

```text
Database: darukaa_test
```

This keeps application development data separate from automated test data.

## Testing

Run the complete backend test suite from the backend directory:

```powershell
uv run pytest
```

Current verified result:

```text
5 passed
```

The tests cover authentication, resource CRUD, ownership protection, and administrator access.

The test database uses:

```text
darukaa_test
```

and the test configuration points the application database dependency to that database.

## Frontend Build

To verify that the production frontend builds successfully:

```powershell
npm run build
```

The production build completes successfully.

Vite may report a warning about large JavaScript chunks. This is a build-size warning rather than a build failure.

## Deployment

Darukaa.Earth is deployed using Render.

### Backend

Backend service:

```text
darukaa-backend
```

Production backend:

```text
https://darukaa-backend-ogqp.onrender.com
```

The backend is deployed from the `main` branch.

Build command:

```text
uv sync && uv run alembic upgrade head
```

Start command:

```text
uv run uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend

Frontend service:

```text
darukaa-frontend
```

Production frontend:

```text
https://darukaa-frontend-5mc6.onrender.com
```

Build command:

```text
npm ci && npm run build
```

Publish directory:

```text
dist
```

The frontend uses the production backend through:

```text
VITE_API_BASE_URL
```

and Mapbox through:

```text
VITE_MAPBOX_TOKEN
```

### Deployment Status

The current deployed version includes:

- React frontend
- FastAPI backend
- PostgreSQL/PostGIS
- JWT authentication
- Role-based administrator access
- Mapbox GL JS mapping
- Chart.js visualization
- Project management
- Site management
- Environmental metric management
- Automated backend tests

## Security

The application includes several security measures.

### Password Security

Passwords are never stored in plain text.

Passwords are hashed using Argon2 through `pwdlib`.

### JWT Authentication

Protected endpoints require a valid bearer token.

Invalid, expired, or malformed tokens are rejected.

### Ownership Protection

Normal users can access only their own project hierarchy.

The ownership chain is:

```text
User
 ↓
Project
 ↓
Site
 ↓
Metric
```

This prevents normal users from accessing another user's resources.

### Administrator Authorization

Administrator privileges are based on the authenticated user's database role.

A normal registration request cannot provide an administrator role.

### CORS

The FastAPI application allows the configured local development frontend origins and the deployed Darukaa.Earth frontend.

## Frontend Flow

The frontend uses a simple state-based navigation model rather than React Router.

Main views include:

```text
Landing Page
    ↓
Login / Register
    ↓
Dashboard
    ↓
Project Details
    ↓
Site Management
    ↓
Environmental Metrics
```

The frontend retrieves the current user after login using:

```http
GET /api/auth/me
```

The returned role is used to display the appropriate user interface.

## Administrator Experience

The administrator dashboard provides a broader view of the application.

Administrator users see:

```text
ADMINISTRATOR DASHBOARD
```

and:

```text
ALL PROJECTS
```

Administrators can:

- View projects across users
- Open projects
- Access sites associated with projects
- Manage environmental metrics
- Create projects

Normal users continue to see:

```text
YOUR PROJECTS
```

and remain restricted by backend ownership rules.

## Environmental Data Flow

Environmental data is handled through the following flow:

```text
Project
   ↓
Geographical Site
   ↓
Environmental Metrics
   ↓
Chart.js Visualization
```

Geographical information is stored in PostGIS and displayed using Mapbox GL JS.

Environmental measurements are retrieved from the FastAPI API and visualized on the project details page.

## Mapping

The application currently stores a geographical site as a point using:

```text
latitude
longitude
```

The backend converts these coordinates into a PostGIS geometry:

```text
POINT(longitude latitude)
```

with SRID:

```text
4326
```

The frontend retrieves the coordinates and displays the site using Mapbox GL JS.

## Visualization

Chart.js is used for environmental metric visualization.

The project details page uses recorded environmental measurements to show changes over time.

The current implementation includes a chart based on carbon sequestration measurements.

The visualization layer can be extended later for:

- Carbon avoided
- Biodiversity score
- Habitat area
- Additional environmental indicators

## Development Approach

The project was developed incrementally.

### Completed Development Phases

```text
Phase 1
Project planning and backend foundation

Phase 2
Database models and migrations

Phase 3
Project API

Phase 4
Geospatial site API

Phase 5
Environmental metric API

Phase 6
JWT authentication

Phase 7
Authorization and ownership protection

Phase 8
Automated backend testing

Phase 9
React frontend foundation

Phase 10
Frontend-backend integration

Phase 11
Project and site management UI

Phase 12
Interactive Mapbox map

Phase 13
Environmental metrics and Chart.js visualization

Phase 14
Production deployment

Phase 15
Administrator role and access control
```

## Git Workflow

The project uses Git for version control.

Meaningful commits are used for major feature groups rather than making a commit for every small code change.

Recent major feature commits include:

```text
feat: add environmental metrics and charts
feat: add interactive site map
feat: complete Phase 11 project and site management
feat: add React frontend foundation
feat: configure frontend API for deployment
feat: align frontend with hackathon mapping and charts
feat: add administrator role and access control
```

Latest administrator feature commit:

```text
560732e feat: add administrator role and access control
```

## Project Repository

GitHub repository:

```text
https://github.com/Sahil1298/-darukaa-earth
```

## Current Status

Darukaa.Earth is currently deployed and operational.

```text
Frontend      → Live
Backend       → Live
Database      → Connected
Authentication→ Working
Authorization → Working
Admin Role    → Working
Mapbox        → Integrated
Chart.js      → Integrated
Testing       → 5 tests passing
GitHub        → Up to date
```

## Current Limitations

The current implementation represents geographical sites as point locations rather than drawn polygons.

The application currently focuses on project, site, and metric management rather than a large-scale administrative control panel.

The current analytics layer uses the environmental data stored in the application database and does not yet include advanced predictive analytics or external environmental datasets.

## Future Improvements

Potential future improvements include:

- Polygon-based site boundaries
- Advanced spatial analysis
- More environmental indicators
- External environmental datasets
- Satellite imagery integration
- Historical spatial analysis
- Advanced dashboards
- Richer administrator controls
- Exportable reports
- Background processing for large datasets
- More advanced analytics and machine learning

These features are outside the current core implementation.

## Hackathon Relevance

Darukaa.Earth demonstrates a complete full-stack workflow for environmental data management:

```text
Authentication
      ↓
Project Management
      ↓
Geospatial Site Management
      ↓
Environmental Metrics
      ↓
Interactive Mapping
      ↓
Data Visualization
      ↓
Role-Based Administration
```

The platform combines software engineering, geospatial databases, secure API development, frontend visualization, and environmental data management into one deployable application.

## Acknowledgements and References

The backend development approach follows common FastAPI patterns including:

- Router-based application organization
- Dependency injection
- OAuth2 bearer authentication
- JWT access tokens
- Database-backed user lookup
- Automated API testing

FastAPI learning and project structure were influenced by Corey Schafer's FastAPI course and repository:

```text
https://github.com/CoreyMSchafer/FastAPI-Full-Course
```

## License

This project was developed as a hackathon/academic project.

The repository does not currently define a separate open-source license.