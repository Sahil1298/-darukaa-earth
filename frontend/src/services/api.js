const API_BASE_URL = "http://127.0.0.1:8000";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  return text || null;
}

async function request(url, options = {}) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      data && typeof data === "object" && data.detail
        ? data.detail
        : "Request failed";

    throw new ApiError(message, response.status);
  }

  return data;
}

export async function getApiStatus() {
  return request("/");
}

export async function registerUser(userData) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function loginUser(email, password) {
  const body = new URLSearchParams();

  body.append("username", email.trim());
  body.append("password", password);

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      data && typeof data === "object" && data.detail
        ? data.detail
        : "Login failed";

    throw new ApiError(message, response.status);
  }

  return data;
}

export async function getCurrentUser(token) {
  return request("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getProjects(token) {
  return request("/api/projects/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createProject(token, projectData) {
  return request("/api/projects/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projectData),
  });
}