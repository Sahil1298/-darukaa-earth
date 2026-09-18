import { useEffect, useState } from "react";

import {
  createMetric,
  createSite,
  deleteMetric,
  deleteSite,
  getMetrics,
  getSites,
  updateMetric,
} from "../services/api";
import SiteMap from "../components/SiteMap";

function formatDateTimeLocal(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);

  return localDate.toISOString().slice(0, 16);
}

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

  const [selectedSite, setSelectedSite] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [metricsLoading, setMetricsLoading] =
    useState(false);
  const [metricsError, setMetricsError] = useState("");

  const [showCreateMetric, setShowCreateMetric] =
    useState(false);
  const [editingMetric, setEditingMetric] = useState(null);

  const [recordedAt, setRecordedAt] = useState("");
  const [carbonSequestered, setCarbonSequestered] =
    useState("");
  const [carbonAvoided, setCarbonAvoided] =
    useState("");
  const [biodiversityScore, setBiodiversityScore] =
    useState("");
  const [habitatArea, setHabitatArea] = useState("");

  const [creatingMetric, setCreatingMetric] =
    useState(false);
  const [metricError, setMetricError] = useState("");

  const [siteName, setSiteName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [areaHectares, setAreaHectares] = useState("");

  const [creatingSite, setCreatingSite] = useState(false);
  const [createSiteError, setCreateSiteError] =
    useState("");

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
    setCreateSiteError("");
    setShowCreateSite(true);
    setSelectedSite(null);
  }

  function closeCreateSite() {
    setShowCreateSite(false);
    setCreateSiteError("");
  }

  async function handleCreateSite(event) {
    event.preventDefault();

    const token = localStorage.getItem("access_token");

    if (!token) {
      onLogout();
      return;
    }

    setCreatingSite(true);
    setCreateSiteError("");

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
      setCreateSiteError(error.message);
    } finally {
      setCreatingSite(false);
    }
  }

  async function handleDeleteSite(siteId) {
    const token = localStorage.getItem("access_token");

    if (!token) {
      onLogout();
      return;
    }

    const confirmed = window.confirm(
      "Delete this site?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteSite(token, project.id, siteId);

      setSites((currentSites) =>
        currentSites.filter((site) => site.id !== siteId)
      );

      if (selectedSite?.id === siteId) {
        closeMetrics();
      }
    } catch (error) {
      setError(error.message);
    }
  }

  async function openMetrics(site) {
    const token = localStorage.getItem("access_token");

    if (!token) {
      onLogout();
      return;
    }

    setSelectedSite(site);
    setShowCreateMetric(false);
    setEditingMetric(null);
    setMetricsError("");
    setMetricsLoading(true);

    try {
      const data = await getMetrics(
        token,
        project.id,
        site.id
      );

      setMetrics(data);
    } catch (error) {
      setMetricsError(error.message);
      setMetrics([]);
    } finally {
      setMetricsLoading(false);
    }
  }

  function closeMetrics() {
    setSelectedSite(null);
    setMetrics([]);
    setMetricsError("");
    setShowCreateMetric(false);
    setEditingMetric(null);
    setMetricError("");
  }

  function resetMetricForm() {
    setRecordedAt("");
    setCarbonSequestered("");
    setCarbonAvoided("");
    setBiodiversityScore("");
    setHabitatArea("");
    setMetricError("");
  }

  function openCreateMetric() {
    resetMetricForm();
    setEditingMetric(null);
    setShowCreateMetric(true);
  }

  function openEditMetric(metric) {
    setRecordedAt(
      formatDateTimeLocal(metric.recorded_at)
    );
    setCarbonSequestered(
      String(metric.carbon_sequestered)
    );
    setCarbonAvoided(
      String(metric.carbon_avoided)
    );
    setBiodiversityScore(
      String(metric.biodiversity_score)
    );
    setHabitatArea(
      String(metric.habitat_area)
    );
    setMetricError("");
    setEditingMetric(metric);
    setShowCreateMetric(true);
  }

  function closeMetricForm() {
    setShowCreateMetric(false);
    setEditingMetric(null);
    setMetricError("");
  }

  async function handleSaveMetric(event) {
    event.preventDefault();

    const token = localStorage.getItem("access_token");

    if (!token || !selectedSite) {
      onLogout();
      return;
    }

    setCreatingMetric(true);
    setMetricError("");

    const metricData = {
      recorded_at: new Date(
        recordedAt
      ).toISOString(),
      carbon_sequestered: Number(
        carbonSequestered
      ),
      carbon_avoided: Number(
        carbonAvoided
      ),
      biodiversity_score: Number(
        biodiversityScore
      ),
      habitat_area: Number(habitatArea),
    };

    try {
      if (editingMetric) {
        const updatedMetric = await updateMetric(
          token,
          project.id,
          selectedSite.id,
          editingMetric.id,
          metricData
        );

        setMetrics((currentMetrics) =>
          currentMetrics.map((metric) =>
            metric.id === updatedMetric.id
              ? updatedMetric
              : metric
          )
        );
      } else {
        const metric = await createMetric(
          token,
          project.id,
          selectedSite.id,
          metricData
        );

        setMetrics((currentMetrics) => [
          ...currentMetrics,
          metric,
        ]);
      }

      closeMetricForm();
    } catch (error) {
      setMetricError(error.message);
    } finally {
      setCreatingMetric(false);
    }
  }

  async function handleDeleteMetric(metricId) {
    const token = localStorage.getItem("access_token");

    if (!token || !selectedSite) {
      onLogout();
      return;
    }

    const confirmed = window.confirm(
      "Delete this metric?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMetric(
        token,
        project.id,
        selectedSite.id,
        metricId
      );

      setMetrics((currentMetrics) =>
        currentMetrics.filter(
          (metric) => metric.id !== metricId
        )
      );
    } catch (error) {
      setMetricsError(error.message);
    }
  }

  const latestMetric =
    metrics.length > 0
      ? metrics[metrics.length - 1]
      : null;

  const maxCarbon =
    metrics.length > 0
      ? Math.max(
          ...metrics.map((metric) =>
            Number(metric.carbon_sequestered)
          )
        )
      : 0;

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
          <span>Selected Metrics</span>
          <strong>
            {selectedSite ? metrics.length : "—"}
          </strong>
        </div>
      </section>

      {!selectedSite && (
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
                            Area:{" "}
                            {site.area_hectares} hectares
                          </p>

                          <p>
                            Latitude:{" "}
                            {site.latitude}
                            <br />
                            Longitude:{" "}
                            {site.longitude}
                          </p>

                          <div className="hero-actions">
                            <button
                              className="primary-button"
                              onClick={() =>
                                openMetrics(site)
                              }
                            >
                              View Metrics
                            </button>

                            <button
                              className="secondary-button"
                              onClick={() =>
                                handleDeleteSite(
                                  site.id
                                )
                              }
                            >
                              Delete Site
                            </button>
                          </div>
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
                  <p className="eyebrow">
                    NEW SITE
                  </p>

                  <h3>Add Geographical Site</h3>
                </div>

                <button
                  className="back-button"
                  onClick={closeCreateSite}
                  disabled={creatingSite}
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

                {createSiteError && (
                  <p
                    className="error"
                    role="alert"
                  >
                    {createSiteError}
                  </p>
                )}

                <div className="hero-actions">
                  <button
                    type="submit"
                    className="primary-button"
                    disabled={creatingSite}
                  >
                    {creatingSite
                      ? "Creating..."
                      : "Add Site"}
                  </button>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={closeCreateSite}
                    disabled={creatingSite}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      )}

      {selectedSite && (
        <section className="projects-section">
          <div className="section-header">
            <div>
              <button
                className="back-button"
                onClick={closeMetrics}
              >
                ← Back to Sites
              </button>

              <p className="eyebrow">
                SITE METRICS
              </p>

              <h3>{selectedSite.name}</h3>
            </div>

            <button
              className="primary-button"
              onClick={openCreateMetric}
            >
              Add Metric
            </button>
          </div>

          <div className="dashboard-stats">
            <div className="stat-card">
              <span>Carbon Sequestered</span>
              <strong>
                {latestMetric
                  ? latestMetric.carbon_sequestered
                  : "—"}
              </strong>
            </div>

            <div className="stat-card">
              <span>Carbon Avoided</span>
              <strong>
                {latestMetric
                  ? latestMetric.carbon_avoided
                  : "—"}
              </strong>
            </div>

            <div className="stat-card">
              <span>Biodiversity</span>
              <strong>
                {latestMetric
                  ? latestMetric.biodiversity_score
                  : "—"}
              </strong>
            </div>
          </div>

          {showCreateMetric && (
            <div className="empty-card">
              <div className="section-header">
                <div>
                  <p className="eyebrow">
                    {editingMetric
                      ? "EDIT METRIC"
                      : "NEW METRIC"}
                  </p>

                  <h3>
                    {editingMetric
                      ? "Modify Environmental Metric"
                      : "Add Environmental Metric"}
                  </h3>
                </div>

                <button
                  className="back-button"
                  onClick={closeMetricForm}
                  disabled={creatingMetric}
                >
                  ← Back
                </button>
              </div>

              <form
                className="project-form"
                onSubmit={handleSaveMetric}
              >
                <label htmlFor="recorded-at">
                  Recorded At
                </label>

                <input
                  id="recorded-at"
                  type="datetime-local"
                  value={recordedAt}
                  onChange={(event) =>
                    setRecordedAt(event.target.value)
                  }
                  required
                />

                <label htmlFor="carbon-sequestered">
                  Carbon Sequestered
                </label>

                <input
                  id="carbon-sequestered"
                  type="number"
                  value={carbonSequestered}
                  onChange={(event) =>
                    setCarbonSequestered(
                      event.target.value
                    )
                  }
                  min="0"
                  step="any"
                  required
                />

                <label htmlFor="carbon-avoided">
                  Carbon Avoided
                </label>

                <input
                  id="carbon-avoided"
                  type="number"
                  value={carbonAvoided}
                  onChange={(event) =>
                    setCarbonAvoided(
                      event.target.value
                    )
                  }
                  min="0"
                  step="any"
                  required
                />

                <label htmlFor="biodiversity-score">
                  Biodiversity Score
                </label>

                <input
                  id="biodiversity-score"
                  type="number"
                  value={biodiversityScore}
                  onChange={(event) =>
                    setBiodiversityScore(
                      event.target.value
                    )
                  }
                  min="0"
                  max="100"
                  step="any"
                  required
                />

                <label htmlFor="habitat-area">
                  Habitat Area
                </label>

                <input
                  id="habitat-area"
                  type="number"
                  value={habitatArea}
                  onChange={(event) =>
                    setHabitatArea(event.target.value)
                  }
                  min="0"
                  step="any"
                  required
                />

                {metricError && (
                  <p
                    className="error"
                    role="alert"
                  >
                    {metricError}
                  </p>
                )}

                <div className="hero-actions">
                  <button
                    type="submit"
                    className="primary-button"
                    disabled={creatingMetric}
                  >
                    {creatingMetric
                      ? "Saving..."
                      : editingMetric
                        ? "Update Metric"
                        : "Save Metric"}
                  </button>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={closeMetricForm}
                    disabled={creatingMetric}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {!metricsLoading &&
            !metricsError &&
            metrics.length === 0 &&
            !showCreateMetric && (
              <div className="empty-card">
                <h3>No metrics yet</h3>

                <p>
                  Add environmental measurements for
                  this site.
                </p>
              </div>
            )}

          {metricsLoading && (
            <div className="empty-card">
              Loading metrics...
            </div>
          )}

          {!metricsLoading && metricsError && (
            <div className="empty-card error">
              {metricsError}
            </div>
          )}

          {!metricsLoading &&
            !metricsError &&
            metrics.length > 0 && (
              <>
                <div className="project-grid">
                  {metrics.map((metric) => (
                    <article
                      className="project-card"
                      key={metric.id}
                    >
                      <h3>
                        {new Date(
                          metric.recorded_at
                        ).toLocaleDateString()}
                      </h3>

                      <p>
                        Carbon Sequestered:{" "}
                        {metric.carbon_sequestered}
                      </p>

                      <p>
                        Carbon Avoided:{" "}
                        {metric.carbon_avoided}
                      </p>

                      <p>
                        Biodiversity:{" "}
                        {metric.biodiversity_score}
                      </p>

                      <p>
                        Habitat Area:{" "}
                        {metric.habitat_area}
                      </p>

                      <div className="hero-actions">
                        <button
                          className="primary-button"
                          onClick={() =>
                            openEditMetric(metric)
                          }
                        >
                          Modify
                        </button>

                        <button
                          className="secondary-button"
                          onClick={() =>
                            handleDeleteMetric(
                              metric.id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="map-section">
                  <div className="section-header">
                    <div>
                      <p className="eyebrow">
                        CARBON OVERVIEW
                      </p>

                      <h3>
                        Carbon Sequestered
                      </h3>
                    </div>
                  </div>

                  <div className="metric-chart">
                    {metrics.map((metric) => {
                      const value = Number(
                        metric.carbon_sequestered
                      );

                      const width =
                        maxCarbon > 0
                          ? (value / maxCarbon) * 100
                          : 0;

                      return (
                        <div
                          className="metric-bar-row"
                          key={metric.id}
                        >
                          <span>
                            {new Date(
                              metric.recorded_at
                            ).toLocaleDateString()}
                          </span>

                          <div className="metric-bar-track">
                            <div
                              className="metric-bar"
                              style={{
                                width: `${width}%`,
                              }}
                            />
                          </div>

                          <strong>
                            {metric.carbon_sequestered}
                          </strong>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
        </section>
      )}
    </main>
  );
}

export default ProjectDetails;