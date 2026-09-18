import { useEffect, useState } from "react";

import {
  createSite,
  deleteSite,
  getSites,
} from "../services/api";
import SiteMap from "../components/SiteMap";

function ProjectDetails({
  project,
  onBack,
  onLogout,
}) {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateSite, setShowCreateSite] =
    useState(false);

  const [siteName, setSiteName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [areaHectares, setAreaHectares] = useState("");

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      onLogout();
      return;
    }

    getSites(token, project.id)
      .then((data) => {
        setSites(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [project.id, onLogout]);

  function openCreateSite() {
    setSiteName("");
    setLatitude("");
    setLongitude("");
    setAreaHectares("");
    setCreateError("");
    setShowCreateSite(true);
  }

  function closeCreateSite() {
    setShowCreateSite(false);
    setCreateError("");
  }

  async function handleCreateSite(event) {
    event.preventDefault();

    const token = localStorage.getItem("access_token");

    if (!token) {
      onLogout();
      return;
    }

    setCreating(true);
    setCreateError("");

    try {
      const site = await createSite(token, project.id, {
        name: siteName.trim(),
        latitude: Number(latitude),
        longitude: Number(longitude),
        area_hectares: Number(areaHectares),
      });

      setSites((currentSites) => [
        ...currentSites,
        site,
      ]);

      closeCreateSite();
    } catch (error) {
      setCreateError(error.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteSite(siteId) {
    const token = localStorage.getItem("access_token");

    if (!token) {
      onLogout();
      return;
    }

    try {
      await deleteSite(token, project.id, siteId);

      setSites((currentSites) =>
        currentSites.filter((site) => site.id !== siteId)
      );
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <button
            className="back-button"
            onClick={onBack}
          >
            ← Back to Dashboard
          </button>

          <p className="eyebrow">
            PROJECT DETAILS
          </p>

          <h2>{project.name}</h2>

          <p className="description">
            {project.description ||
              "No project description provided."}
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
          <span>Project ID</span>
          <strong>{project.id}</strong>
        </div>

        <div className="stat-card">
          <span>Sites</span>
          <strong>{sites.length}</strong>
        </div>

        <div className="stat-card">
          <span>Metrics</span>
          <strong>—</strong>
        </div>
      </section>

      <section className="projects-section">
        {!showCreateSite ? (
          <>
            <div className="section-header">
              <div>
                <p className="eyebrow">
                  GEOGRAPHICAL SITES
                </p>

                <h3>Sites</h3>
              </div>

              <button
                className="primary-button"
                onClick={openCreateSite}
              >
                Add Site
              </button>
            </div>

            {loading && (
              <div className="empty-card">
                Loading sites...
              </div>
            )}

            {!loading && error && (
              <div className="empty-card error">
                {error}
              </div>
            )}

            {!loading &&
              !error &&
              sites.length === 0 && (
                <div className="empty-card">
                  <h3>No sites yet</h3>

                  <p>
                    Add a geographical site to this
                    environmental project.
                  </p>
                </div>
              )}

            {!loading &&
              !error &&
              sites.length > 0 && (
                <>
                  <div className="project-grid">
                    {sites.map((site) => (
                      <article
                        className="project-card"
                        key={site.id}
                      >
                        <h3>{site.name}</h3>

                        <p>
                          Area: {site.area_hectares} hectares
                        </p>

                        <p>
                          Latitude: {site.latitude}
                          <br />
                          Longitude: {site.longitude}
                        </p>

                        <button
                          className="secondary-button"
                          onClick={() =>
                            handleDeleteSite(site.id)
                          }
                        >
                          Delete Site
                        </button>
                      </article>
                    ))}
                  </div>

                  <div className="map-section">
                    <div className="section-header">
                      <div>
                        <p className="eyebrow">
                          SITE LOCATIONS
                        </p>

                        <h3>Map</h3>
                      </div>
                    </div>

                    <SiteMap sites={sites} />
                  </div>
                </>
              )}
          </>
        ) : (
          <div className="empty-card">
            <div className="section-header">
              <div>
                <p className="eyebrow">NEW SITE</p>

                <h3>Add Geographical Site</h3>
              </div>

              <button
                className="back-button"
                onClick={closeCreateSite}
                disabled={creating}
              >
                ← Back
              </button>
            </div>

            <form
              className="project-form"
              onSubmit={handleCreateSite}
            >
              <label htmlFor="site-name">
                Site Name
              </label>

              <input
                id="site-name"
                type="text"
                value={siteName}
                onChange={(event) =>
                  setSiteName(event.target.value)
                }
                placeholder="Enter site name"
                maxLength={150}
                required
                autoFocus
              />

              <label htmlFor="latitude">
                Latitude
              </label>

              <input
                id="latitude"
                type="number"
                value={latitude}
                onChange={(event) =>
                  setLatitude(event.target.value)
                }
                placeholder="e.g. 19.0760"
                min="-90"
                max="90"
                step="any"
                required
              />

              <label htmlFor="longitude">
                Longitude
              </label>

              <input
                id="longitude"
                type="number"
                value={longitude}
                onChange={(event) =>
                  setLongitude(event.target.value)
                }
                placeholder="e.g. 72.8777"
                min="-180"
                max="180"
                step="any"
                required
              />

              <label htmlFor="area-hectares">
                Area (hectares)
              </label>

              <input
                id="area-hectares"
                type="number"
                value={areaHectares}
                onChange={(event) =>
                  setAreaHectares(event.target.value)
                }
                placeholder="e.g. 12.5"
                min="0.01"
                step="any"
                required
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
                    : "Add Site"}
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeCreateSite}
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

export default ProjectDetails;