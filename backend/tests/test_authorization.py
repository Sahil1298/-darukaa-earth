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


def test_ownership_protection(client):
    # User 1
    client.post(
        "/api/auth/register",
        json={
            "name": "Sahil",
            "email": "sahil@example.com",
            "password": "password123",
        },
    )

    sahil_token = login(
        client,
        "sahil@example.com",
        "password123",
    )

    sahil_headers = {
        "Authorization": f"Bearer {sahil_token}",
    }

    # Create project
    response = client.post(
        "/api/projects/",
        json={
            "name": "Private Project",
            "description": "Private",
        },
        headers=sahil_headers,
    )

    assert response.status_code == 201
    project_id = response.json()["id"]

    # Create site
    response = client.post(
        f"/api/projects/{project_id}/sites/",
        json={
            "name": "Private Site",
            "latitude": 19.1,
            "longitude": 72.9,
            "area_hectares": 5,
        },
        headers=sahil_headers,
    )

    assert response.status_code == 201
    site_id = response.json()["id"]

    # User 2
    client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "password123",
        },
    )

    test_token = login(
        client,
        "test@example.com",
        "password123",
    )

    test_headers = {
        "Authorization": f"Bearer {test_token}",
    }

    # Cannot see User 1's project
    response = client.get(
        f"/api/projects/{project_id}",
        headers=test_headers,
    )

    assert response.status_code == 404

    # Cannot see User 1's site
    response = client.get(
        f"/api/projects/{project_id}/sites/{site_id}",
        headers=test_headers,
    )

    assert response.status_code == 404

    # Protected endpoint without token
    response = client.get(
        "/api/projects/",
    )

    assert response.status_code == 401