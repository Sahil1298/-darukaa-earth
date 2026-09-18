def login(client, email, password):
    response = client.post(
        "/api/auth/login",
        data={
            "username": email,
            "password": password,
        },
    )

    assert response.status_code == 200

    return response.json()["access_token"]


def test_project_site_metric_flow(client):
    # Create user
    client.post(
        "/api/auth/register",
        json={
            "name": "Sahil",
            "email": "sahil@example.com",
            "password": "password123",
        },
    )

    token = login(
        client,
        "sahil@example.com",
        "password123",
    )

    headers = {
        "Authorization": f"Bearer {token}",
    }

    # Create project
    response = client.post(
        "/api/projects/",
        json={
            "name": "Mangrove Restoration",
            "description": "Test project",
        },
        headers=headers,
    )

    assert response.status_code == 201
    project_id = response.json()["id"]

    # Get projects
    response = client.get(
        "/api/projects/",
        headers=headers,
    )

    assert response.status_code == 200
    assert len(response.json()) == 1

    # Create site
    response = client.post(
        f"/api/projects/{project_id}/sites/",
        json={
            "name": "Mangrove Site",
            "latitude": 19.1176,
            "longitude": 72.906,
            "area_hectares": 12.5,
        },
        headers=headers,
    )

    assert response.status_code == 201
    site_id = response.json()["id"]

    # Get site
    response = client.get(
        f"/api/projects/{project_id}/sites/{site_id}",
        headers=headers,
    )

    assert response.status_code == 200
    assert response.json()["latitude"] == 19.1176

    # Update site
    response = client.put(
        f"/api/projects/{project_id}/sites/{site_id}",
        json={
            "name": "Updated Site",
            "latitude": 19.2,
            "longitude": 72.91,
            "area_hectares": 15,
        },
        headers=headers,
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Updated Site"

    # Create metric
    response = client.post(
        f"/api/projects/{project_id}/sites/{site_id}/metrics/",
        json={
            "recorded_at": "2026-09-18T12:00:00Z",
            "carbon_sequestered": 150,
            "carbon_avoided": 90,
            "biodiversity_score": 92,
            "habitat_area": 14,
        },
        headers=headers,
    )

    assert response.status_code == 201
    metric_id = response.json()["id"]

    # Get metric
    response = client.get(
        f"/api/projects/{project_id}/sites/{site_id}/metrics/{metric_id}",
        headers=headers,
    )

    assert response.status_code == 200
    assert response.json()["carbon_sequestered"] == 150

    # Update metric
    response = client.put(
        f"/api/projects/{project_id}/sites/{site_id}/metrics/{metric_id}",
        json={
            "recorded_at": "2026-09-18T13:00:00Z",
            "carbon_sequestered": 200,
            "carbon_avoided": 100,
            "biodiversity_score": 95,
            "habitat_area": 16,
        },
        headers=headers,
    )

    assert response.status_code == 200
    assert response.json()["carbon_sequestered"] == 200

    # Delete metric
    response = client.delete(
        f"/api/projects/{project_id}/sites/{site_id}/metrics/{metric_id}",
        headers=headers,
    )

    assert response.status_code == 204

    # Delete site
    response = client.delete(
        f"/api/projects/{project_id}/sites/{site_id}",
        headers=headers,
    )

    assert response.status_code == 204