
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "freelancer",
  });

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await register(form).unwrap();
      navigate("/login", {
        state: { message: "Account created. Please sign in." },
      });
    } catch (err) {
      setError(
        err?.data?.message || err?.data?.error || "Unable to create account."
      );
    }
  };

  return (
    <main className="auth-page register-page">
      <section className="auth-showcase">
        <span className="auth-kicker">MAKE YOUR NEXT MOVE</span>
        <h1>Your skills deserve a bigger stage.</h1>
        <p>
          Find projects, hire exceptional people, and turn good ideas into
          great work with PaidLancer.
        </p>
        <div className="auth-quote">
          <span>◇</span>
          <p>Different skills. Shared ambition. Better work.</p>
        </div>
      </section>

      <section className="auth-form-area">
        <div className="auth-form-card">
          <p className="section-kicker">GET STARTED FOR FREE</p>
          <h2>Create your account.</h2>
          <p className="muted mt-2 text-sm">
            Tell us a little about yourself to get started.
          </p>

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="form-label">
              Full name
              <input
                className="form-input"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </label>

            <label className="form-label">
              Email address
              <input
                className="form-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="form-label">
              Mobile number
              <input
                className="form-input"
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Your mobile number"
                autoComplete="tel"
                required
              />
            </label>

            <label className="form-label">
              Password
              <input
                className="form-input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </label>

            <div>
              <span className="form-label">I want to</span>
              <div className="role-options">
                <label
                  className={`role-option ${form.role === "freelancer" ? "role-selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="freelancer"
                    checked={form.role === "freelancer"}
                    onChange={handleChange}
                  />
                  <span className="role-symbol">↗</span>
                  <span>
                    <strong>Find work</strong>
                    <small>I'm a freelancer</small>
                  </span>
                </label>

                <label
                  className={`role-option ${form.role === "client" ? "role-selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={form.role === "client"}
                    onChange={handleChange}
                  />
                  <span className="role-symbol">◇</span>
                  <span>
                    <strong>Hire talent</strong>
                    <small>I'm a client</small>
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="button button-primary w-full justify-center py-3.5"
            >
              {isLoading ? "Creating account..." : "Create account →"}
            </button>
          </form>

          <p className="muted mt-5 text-center text-sm">
            Already have an account?{" "}
            <Link className="text-link" to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
