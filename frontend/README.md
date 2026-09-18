# Darukaa.Earth Frontend

The Darukaa.Earth frontend is the web interface for the environmental analytics platform.

It provides the user interface for authentication, project management, geographical site management, and future environmental visualization while communicating with the FastAPI backend.

## Frontend Goal

The frontend allows authenticated users to:

- Register an account
- Log in
- Maintain an authenticated session using JWT
- View a dashboard
- View environmental projects
- Create environmental projects
- Open individual projects
- View geographical sites belonging to a project
- Add geographical sites
- Delete geographical sites
- Navigate between screens using Back and Cancel actions

The frontend communicates with the FastAPI backend through a centralized API service.

## Technology Stack

Frontend: React, Vite, JavaScript

Backend API: FastAPI

Authentication: JWT bearer token

API Communication: Fetch API

Development: Node.js, npm, Git, GitHub

Planned visualization: Mapbox GL JS, Highcharts

## Current Development Status

Phase 10A - React and Vite frontend foundation: Completed

Phase 10B - Frontend and FastAPI connection: Completed

Phase 10C - Authentication UI: Completed

Phase 10D - JWT authentication integration: Completed

Phase 10E - Dashboard foundation: Completed

Phase 10F - Project creation and navigation: Completed

Phase 11 - Project Details and Geospatial Sites: Completed

Next phase: Interactive Site Map

## Frontend Project Structure

frontend/

├── public/

├── src/

│   ├── components/

│   ├── hooks/

│   ├── pages/

│   │   ├── Dashboard.jsx

│   │   ├── Login.jsx

│   │   ├── ProjectDetails.jsx

│   │   └── Register.jsx

│   │

│   ├── services/

│   │   └── api.js

│   │

│   ├── App.css

│   ├── App.jsx

│   ├── index.css

│   └── main.jsx

│

├── .gitignore

├── eslint.config.js

├── index.html

├── package.json

├── package-lock.json

├── README.md

└── vite.config.js

## Phase 10 - React Frontend Foundation

### Phase 10A - React and Vite Foundation

The frontend was created using React and Vite.

The main application files are:

    frontend/src/main.jsx

    frontend/src/App.jsx

The development server runs at:

    http://localhost:5173

The frontend can be started using:

    npm run dev

The production build can be generated using:

    npm run build

ESLint is used for frontend code quality checks.

Linting:

    npm run lint

The initial Vite starter assets were removed and replaced with the Darukaa.Earth frontend structure.

### Phase 10B - Frontend and FastAPI Connection

The React frontend was connected to the FastAPI backend.

Backend:

    http://127.0.0.1:8000

Frontend API communication is centralized in:

    frontend/src/services/api.js

The API service provides functions for:

    API health status

    User registration

    User login

    Current-user retrieval

    Project retrieval

    Project creation

The FastAPI backend was configured with CORS support for the React development server.

The frontend successfully receives the backend API status.

### Phase 10C - Authentication UI

Login and registration interfaces were added.

Files:

    frontend/src/pages/Login.jsx

    frontend/src/pages/Register.jsx

Registration sends data to:

    POST /api/auth/register

Login sends credentials to:

    POST /api/auth/login

The frontend displays authentication errors returned by the backend.

### Phase 10D - JWT Authentication Integration

JWT authentication was connected between React and FastAPI.

The authentication flow is:

    Login

    ↓

    POST /api/auth/login

    ↓

    Access token

    ↓

    localStorage

    ↓

    GET /api/auth/me

    ↓

    Authenticated user

The access token is sent using:

    Authorization: Bearer <token>

The frontend checks for an existing token when the application starts.

If the token is invalid, it is removed.

The backend remains responsible for validating the JWT and enforcing authorization.

Logout removes the stored access token and returns the user to the landing page.

### Phase 10E - Dashboard Foundation

An authenticated dashboard was added.

Dashboard file:

    frontend/src/pages/Dashboard.jsx

The dashboard provides:

    Welcome message

    Project count

    Site count placeholder

    Metric count placeholder

    Project listing

    Logout

Projects are retrieved using:

    GET /api/projects/

Project cards display:

    Project name

    Description

    Project ID

Loading, error, and empty-project states are handled.

### Phase 10F - Project Creation and Navigation

Project creation was added to the dashboard.

The creation form accepts:

    Project Name

    Description

The request is sent using:

    createProject(token, projectData)

The backend endpoint is:

    POST /api/projects/

The frontend does not send user_id.

The authenticated backend user is responsible for project ownership.

After creation, the project immediately appears in the dashboard.

Basic navigation was also added.

Current flow:

    Landing
        ↓
    Login

    Landing
        ↓
    Register

    Login
        ↓
    Create Account

    Dashboard
        ↓
    New Project

    New Project
        ↓
    Back / Cancel
        ↓
    Dashboard

## Phase 11 - Project Details and Geospatial Sites

Phase 11 extends the dashboard into project-level site management.

A project can now be opened from the dashboard.

The project details page is:

    frontend/src/pages/ProjectDetails.jsx

The flow is:

    Dashboard

    ↓

    Select Project

    ↓

    Project Details

    ↓

    Geographical Sites

### Project Details

The project details page displays:

    Project name

    Project description

    Project ID

    Number of sites

The page provides:

    Back to Dashboard

    Logout

### Site Retrieval

Sites are retrieved using:

    GET /api/projects/{project_id}/sites/

The request includes the authenticated user's bearer token.

The frontend uses:

    getSites(token, projectId)

The backend remains responsible for checking project ownership.

### Site Creation

A geographical site can be added to the selected project.

The site form accepts:

    Site Name

    Latitude

    Longitude

    Area in hectares

The frontend uses:

    createSite(token, projectId, siteData)

The backend endpoint is:

    POST /api/projects/{project_id}/sites/

Coordinates are sent as numeric latitude and longitude values.

The backend stores the location using PostGIS.

### Site Display

The project details page currently displays:

    Site name

    Area

    Latitude

    Longitude

Each site appears as a project card.

### Site Deletion

A site can be deleted from the project details page.

The frontend uses:

    deleteSite(token, projectId, siteId)

The backend endpoint is:

    DELETE /api/projects/{project_id}/sites/{site_id}

After successful deletion, the site is removed from the frontend list.

### Navigation

The project details page provides:

    ← Back to Dashboard

The site creation form provides:

    ← Back

    Cancel

These actions only change frontend UI state.

They do not bypass authentication or backend authorization.

## API Service

The frontend API functions are centralized in:

    frontend/src/services/api.js

Current functions include:

    getApiStatus()

    registerUser(userData)

    loginUser(email, password)

    getCurrentUser(token)

    getProjects(token)

    createProject(token, projectData)

    getSites(token, projectId)

    createSite(token, projectId, siteData)

    deleteSite(token, projectId, siteId)

The shared API helper handles:

    HTTP requests

    JSON responses

    API errors

    HTTP status codes

Authentication failures are exposed using the HTTP status code so the frontend can distinguish a 401 Unauthorized response from normal application errors.

## Frontend Security

The frontend does not act as the final authorization layer.

The FastAPI backend remains responsible for:

    JWT validation

    Authentication

    Project ownership

    Site ownership

    Metric ownership

The frontend sends the bearer token when accessing protected resources.

Project creation does not send user_id.

Site creation does not send ownership information.

The backend determines ownership using the authenticated user.

Passwords are sent to the backend login and registration endpoints and are not stored by the frontend as persistent application data.

The real backend database credentials and JWT secret are not stored in frontend source files.

## UI Design

The frontend currently uses a simple environmental dashboard design.

The visual system uses:

    Light background

    White cards

    Dark green text

    Minimal borders

    Simple responsive layouts

Styling is centralized in:

    frontend/src/App.css

The interface is designed to remain simple enough for the hackathon while still presenting the main project functionality clearly.

## Testing

Frontend code is checked using:

    npm run lint

The production build is checked using:

    npm run build

Manual testing currently covers:

    Landing page

    Registration

    Login

    JWT authentication

    Dashboard

    Project retrieval

    Project creation

    Project opening

    Site retrieval

    Site creation

    Site deletion

    Logout

    Back navigation

    Cancel actions

The frontend lint and build checks have been validated successfully during development.

## Development Process

Frontend development follows:

    Build → Test → Document → Commit

Features are grouped into meaningful milestones rather than creating a commit for every small change.

Frontend documentation is maintained separately from backend documentation.

## Git Milestones

Phase 10:

    React frontend foundation

    Frontend and FastAPI connection

    Authentication UI

    JWT authentication integration

    Dashboard foundation

    Project creation and navigation

Phase 11:

    Project details

    Geographical site retrieval

    Geographical site creation

    Geographical site deletion

    Site navigation

## Next Phase

Phase 12 - Interactive Site Map

The next phase will add a simple interactive map to the project details page.

The map will:

    Display project sites

    Use site latitude and longitude

    Show site markers

    Allow basic map interaction

The goal is to provide the main geospatial visualization needed for the hackathon without building an unnecessarily complex GIS dashboard.

## Future Features

Interactive site map

Site editing

Environmental metric interface

Carbon analytics

Biodiversity analytics

Highcharts visualization

Time-based environmental trends

Reusable frontend components

Final UI polish

CI/CD

Frontend deployment