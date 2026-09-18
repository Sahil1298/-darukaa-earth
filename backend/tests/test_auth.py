def test_authentication_flow(client):
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123",
    }

    # Register
    response = client.post(
        "/api/auth/register",
        json=user_data,
    )

    assert response.status_code == 201
    assert response.json()["email"] == "test@example.com"
    assert "password" not in response.json()
    assert "password_hash" not in response.json()

    # Duplicate registration
    response = client.post(
        "/api/auth/register",
        json=user_data,
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

    # Login
    response = client.post(
        "/api/auth/login",
        data={
            "username": "test@example.com",
            "password": "password123",
        },
    )

    assert response.status_code == 200

    token = response.json()["access_token"]

    assert token
    assert response.json()["token_type"] == "bearer"

    # Current user
    response = client.get(
        "/api/auth/me",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"

    # Wrong password
    response = client.post(
        "/api/auth/login",
        data={
            "username": "test@example.com",
            "password": "wrongpassword",
        },
    )

    assert response.status_code == 401