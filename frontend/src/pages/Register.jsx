import { useState } from "react";

import { registerUser } from "../services/api";

function Register({ onRegistered, onBack, onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      onRegistered();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <button
          type="button"
          className="back-button"
          onClick={onBack}
          disabled={loading}
        >
          ← Back
        </button>

        <h2>Create account</h2>
        <p>Join Darukaa.Earth</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="register-name">
            Name
          </label>

          <input
            id="register-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={100}
            autoComplete="name"
          />

          <label htmlFor="register-email">
            Email
          </label>

          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />

          <label htmlFor="register-password">
            Password
          </label>

          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            maxLength={128}
            autoComplete="new-password"
          />

          {error && (
            <p
              className="error"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <button
            type="button"
            className="text-button"
            onClick={onLogin}
            disabled={loading}
          >
            Login
          </button>
        </p>
      </div>
    </main>
  );
}

export default Register;