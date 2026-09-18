import { useEffect, useState } from "react";

import {
  createProject,
  getProjects,
} from "../services/api";

function Dashboard({ user, onLogout }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      onLogout();
      return;
    }

    getProjects(token)
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [onLogout]);

  function openCreateForm() {
    setCreateError("");
    setProjectName("");
    setProjectDescription("");
    setShowCreateForm(true);
  }

  function closeCreateForm() {
    setShowCreateForm(false);
    setCreateError("");
    setProjectName("");
    setProjectDescription("");
  }

  async function handleCreateProject(event) {
    event.preventDefault();

    const token = localStorage.getItem("access_token");

    if (!token) {
      onLogout();
      return;
    }

    setCreateError("");
    setCreating(true);

    try {
      const data = await createProject(token, {
        name: projectName.trim(),
        description: projectDescription.trim() || null,
      });

      setProjects((currentProjects) => [
        data,
        ...currentProjects,
      ]);

      closeCreateForm();
    } catch (error) {
      setCreateError(error.message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">DASHBOARD</p>

          <h2>Welcome, {user.name}.</h2>

          <p className="description">
            Manage your environmental projects, geographical
            sites, and environmental metrics.
          </p>
        </div>

        <button
          className="login-button"
          onClick={onLogout}
        >
          Logout
        </button>
      </header>

      <section className="dashboard-stats">
        <div className="stat-card">
          <span>Projects</span>
          <strong>{projects.length}</strong>
        </div>

        <div className="stat-card">
          <span>Sites</span>
          <strong>—</strong>
        </div>

        <div className="stat-card">
          <span>Metrics</span>
          <strong>—</strong>
        </div>
      </section>

      <section className="projects-section">
        {!showCreateForm ? (
          <>
            <div className="section-header">
              <div>
                <p className="eyebrow">YOUR PROJECTS</p>
                <h3>Projects</h3>
              </div>

              <button
                className="primary-button"
                onClick={openCreateForm}
              >
                New Project
              </button>
            </div>

            {loading && (
              <div className="empty-card">
                Loading projects...
              </div>
            )}

            {!loading && error && (
              <div className="empty-card error">
                {error}
              </div>
            )}

            {!loading &&
              !error &&
              projects.length === 0 && (
                <div className="empty-card">
                  <h3>No projects yet</h3>

                  <p>
                    Create your first environmental project to
                    start managing sites and metrics.
                  </p>
                </div>
              )}

            {!loading &&
              !error &&
              projects.length > 0 && (
                <div className="project-grid">
                  {projects.map((project) => (
                    <article
                      className="project-card"
                      key={project.id}
                    >
                      <h3>{project.name}</h3>

                      <p>
                        {project.description ||
                          "No description provided."}
                      </p>

                      <span>
                        Project #{project.id}
                      </span>
                    </article>
                  ))}
                </div>
              )}
          </>
        ) : (
          <div className="empty-card">
            <div className="section-header">
              <div>
                <p className="eyebrow">NEW PROJECT</p>
                <h3>Create Project</h3>
              </div>

              <button
                type="button"
                className="back-button"
                onClick={closeCreateForm}
                disabled={creating}
              >
                ← Back
              </button>
            </div>

            <form
              className="project-form"
              onSubmit={handleCreateProject}
            >
              <label htmlFor="project-name">
                Project Name
              </label>

              <input
                id="project-name"
                type="text"
                value={projectName}
                onChange={(event) =>
                  setProjectName(event.target.value)
                }
                placeholder="Enter project name"
                maxLength={150}
                required
                autoFocus
              />

              <label htmlFor="project-description">
                Description
              </label>

              <textarea
                id="project-description"
                value={projectDescription}
                onChange={(event) =>
                  setProjectDescription(event.target.value)
                }
                placeholder="Describe your environmental project"
                rows="4"
              />

              {createError && (
                <p
                  className="error"
                  role="alert"
                >
                  {createError}
                </p>
              )}

              <div className="hero-actions">
                <button
                  type="submit"
                  className="primary-button"
                  disabled={creating}
                >
                  {creating
                    ? "Creating..."
                    : "Create Project"}
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeCreateForm}
                  disabled={creating}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;