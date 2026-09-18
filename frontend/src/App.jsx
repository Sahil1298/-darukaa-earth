import { useCallback, useEffect, useState } from "react";

import "./App.css";
import {
  getApiStatus,
  getCurrentUser,
} from "./services/api";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [apiStatus, setApiStatus] = useState("Checking backend...");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getApiStatus()
      .then((data) => {
        setApiStatus(data.message);
      })
      .catch(() => {
        setApiStatus("Backend unavailable");
      });

    const token = localStorage.getItem("access_token");

    if (token) {
      getCurrentUser(token)
        .then((data) => {
          setUser(data);
        })
        .catch(() => {
          localStorage.removeItem("access_token");
        });
    }
  }, []);

  function handleLogin(newToken) {
    localStorage.setItem("access_token", newToken);

    getCurrentUser(newToken)
      .then((data) => {
        setUser(data);
        setShowLogin(false);
        setShowRegister(false);
      })
      .catch(() => {
        localStorage.removeItem("access_token");
      });
  }

  const handleLogout = useCallback(() => {
    localStorage.removeItem("access_token");
    setUser(null);
    setShowLogin(false);
    setShowRegister(false);
  }, []);

  function openLogin() {
    setShowRegister(false);
    setShowLogin(true);
  }

  function openRegister() {
    setShowLogin(false);
    setShowRegister(true);
  }

  function goToLanding() {
    setShowLogin(false);
    setShowRegister(false);
  }

  if (showLogin) {
    return (
      <Login
        onLogin={handleLogin}
        onBack={goToLanding}
        onRegister={openRegister}
      />
    );
  }

  if (showRegister) {
    return (
      <Register
        onRegistered={openLogin}
        onBack={goToLanding}
        onLogin={openLogin}
      />
    );
  }

  if (user) {
    return (
      <div className="app">
        <header className="navbar">
          <div className="brand">
            <h1>Darukaa.Earth</h1>
            <p>Environmental Analytics Platform</p>
          </div>

          <span>{user.name}</span>
        </header>

        <Dashboard
          user={user}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <h1>Darukaa.Earth</h1>
          <p>Environmental Analytics Platform</p>
        </div>

        <button
          className="login-button"
          onClick={openLogin}
        >
          Login
        </button>
      </header>

      <main className="hero">
        <div className="hero-content">
          <p className="eyebrow">
            GEOSPATIAL ENVIRONMENTAL PLATFORM
          </p>

          <h2>
            Understand and
            <br />
            Protect Our Planet.
          </h2>

          <p className="description">
            Manage environmental projects, geographical sites,
            carbon measurements, and biodiversity data from one
            platform.
          </p>

          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={openLogin}
            >
              Login
            </button>

            <button
              className="secondary-button"
              onClick={openRegister}
            >
              Create Account
            </button>
          </div>

          <div className="status-card">
            <span className="status-dot"></span>
            {apiStatus}
          </div>
        </div>
      </main>

      <section className="features">
        <div className="feature-card">
          <h3>Projects</h3>
          <p>
            Organize and manage environmental projects.
          </p>
        </div>

        <div className="feature-card">
          <h3>Geospatial Sites</h3>
          <p>
            Manage geographical locations using PostGIS.
          </p>
        </div>

        <div className="feature-card">
          <h3>Environmental Metrics</h3>
          <p>
            Track carbon and biodiversity data.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;