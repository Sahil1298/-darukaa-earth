def test_basic_api(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "Darukaa.Earth API is running"

    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

    response = client.get("/health/db")
    assert response.status_code == 200
    assert response.json() == {
        "database": "connected",
        "result": 1,
    }