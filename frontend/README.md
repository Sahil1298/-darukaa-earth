# Darukaa.Earth Frontend

The Darukaa.Earth frontend is the web interface for the environmental analytics platform.

It provides the user interface for authentication, project management, geographical site management, environmental metric management, and map visualization while communicating with the FastAPI backend.

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
- View project sites on an interactive map
- View environmental metrics for a site
- Add environmental metrics
- Modify environmental metrics
- Delete environmental metrics
- View a simple carbon overview
- Navigate between screens using Back and Cancel actions

The frontend communicates with the FastAPI backend through a centralized API service.

## Technology Stack

Frontend: React, Vite, JavaScript

Backend API: FastAPI

Authentication: JWT bearer token

API Communication: Fetch API

Map: Leaflet, OpenStreetMap

Development: Node.js, npm, Git, GitHub

## Current Development Status

Phase 10A - React and Vite frontend foundation: Completed

Phase 10B - Frontend and FastAPI connection: Completed

Phase 10C - Authentication UI: Completed

Phase 10D - JWT authentication integration: Completed

Phase 10E - Dashboard foundation: Completed

Phase 10F - Project creation and navigation: Completed

Phase 11 - Project Details and Geospatial Sites: Completed

Phase 12 - Interactive Site Map: Completed

Phase 13 - Environmental Metrics and Simple Charts: Completed

Next phase: Final Hackathon Polish and Testing

## Frontend Project Structure

frontend/

├── public/

├── src/

│   ├── components/

│   │   └── SiteMap.jsx

│   │
│   ├── hooks/

│   │
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

A project can be opened from the dashboard.

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

The backend stores the location using PostGIS.

### Site Display

The project details page displays:

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

## Phase 12 - Interactive Site Map

Phase 12 adds a simple interactive map for project sites.

The goal is to provide the main geospatial visualization needed for the hackathon without building a complex GIS dashboard.

### Map Component

The map component is:

    frontend/src/components/SiteMap.jsx

The component receives project sites from:

    ProjectDetails.jsx

The map uses:

    Leaflet

    OpenStreetMap

### Map Features

The current map provides:

    Interactive map

    Zoom controls

    Pan controls

    Site markers

    Automatic map positioning

    Marker popups

Each site marker uses the site's:

    latitude

    longitude

Clicking a marker displays:

    Site name

    Area

    Coordinates

### Map Positioning

When one site exists, the map centers on that site.

When multiple sites exist, the map adjusts its view to include the project sites.

### Map Data

The map uses the site data returned by the FastAPI site API.

The location data continues to come from the backend and PostGIS.

## Phase 13 - Environmental Metrics and Simple Charts

Phase 13 connects the existing environmental metric APIs to the frontend.

Metrics are managed for an individual geographical site.

The metric interface is included in:

    frontend/src/pages/ProjectDetails.jsx

### Metric Retrieval

Metrics are retrieved for the selected site using:

    GET /api/projects/{project_id}/sites/{site_id}/metrics/

The frontend uses:

    getMetrics(token, projectId, siteId)

The backend checks the authenticated user's ownership chain.

### Metric Creation

A new environmental metric can be added.

The form accepts:

    Recorded At

    Carbon Sequestered

    Carbon Avoided

    Biodiversity Score

    Habitat Area

The frontend uses:

    createMetric(token, projectId, siteId, metricData)

The backend endpoint is:

    POST /api/projects/{project_id}/sites/{site_id}/metrics/

### Metric Display

The selected site's metrics are displayed as cards.

Each metric displays:

    Recorded date

    Carbon Sequestered

    Carbon Avoided

    Biodiversity

    Habitat Area

The latest metric is also shown in the summary cards.

### Metric Modification

An existing metric can be modified.

The frontend loads the existing metric values into the form.

The frontend uses:

    updateMetric(token, projectId, siteId, metricId, metricData)

The backend endpoint is:

    PUT /api/projects/{project_id}/sites/{site_id}/metrics/{metric_id}

After a successful update, the frontend replaces the old metric with the updated value.

### Metric Deletion

An existing metric can be deleted.

The frontend asks for confirmation before deletion.

The frontend uses:

    deleteMetric(token, projectId, siteId, metricId)

The backend endpoint is:

    DELETE /api/projects/{project_id}/sites/{site_id}/metrics/{metric_id}

After successful deletion, the metric is removed from the displayed list.

### Carbon Overview

A simple carbon visualization was added without introducing another chart dependency.

The frontend displays a horizontal bar for each metric based on:

    carbon_sequestered

The largest carbon value is used as the reference for the bar width.

This provides a quick visual comparison of carbon sequestration measurements over time.

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

    getMetrics(token, projectId, siteId)

    createMetric(token, projectId, siteId, metricData)

    updateMetric(token, projectId, siteId, metricId, metricData)

    deleteMetric(token, projectId, siteId, metricId)

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

Metric creation does not send ownership information.

The backend determines ownership using the authenticated user.

The map and metric visualization do not change the existing authentication or authorization model.

## UI Design

The frontend uses a simple environmental dashboard design.

The visual system uses:

    Light background

    White cards

    Dark green text

    Minimal borders

    Simple responsive layouts

Styling is centralized in:

    frontend/src/App.css

The interface is intentionally kept simple for the hackathon.

The goal is to clearly demonstrate the main application workflow instead of building a complex enterprise-level web interface.

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

    Interactive map

    Site markers

    Site marker popup

    Metric retrieval

    Metric creation

    Metric modification

    Metric deletion

    Carbon overview

    Logout

    Back navigation

    Cancel actions

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

Phase 12:

    Interactive site map

    Leaflet integration

    OpenStreetMap tiles

    Site markers

    Site marker popups

Phase 13:

    Environmental metric retrieval

    Environmental metric creation

    Environmental metric modification

    Environmental metric deletion

    Carbon overview

    Simple metric visualization

## Next Phase

Phase 14 - Final Hackathon Polish and Testing

The final phase will focus only on:

    End-to-end testing

    Small UI fixes

    Error-state checks

    Final README updates

    Final Git cleanup

    Final project verification

No major new architecture or unnecessary features will be added.

## Future Features

Site editing

More environmental visualizations

Biodiversity trends

Time-based environmental analysis

Reusable frontend components

Final UI polish

CI/CD

Frontend deployment