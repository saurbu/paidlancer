
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const result = await login(form).unwrap();
      const user =
        result?.user || result?.data?.user || result?.currentUser;

      navigate(
        user?.role === "client"
          ? "/client/dashboard"
          : user?.role === "freelancer"
            ? "/freelancer/dashboard"
            : "/"
      );
    } catch (err) {
      setError(
        err?.data?.message || err?.data?.error || "Unable to sign in."
      );
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-showcase">
        <span className="auth-kicker">WELCOME BACK</span>
        <h1>Good work begins with a fresh start.</h1>
        <p>
          Pick up where you left off. Your next opportunity or great hire is
          only a few steps away.
        </p>
        <div className="auth-quote">
          <span>✳</span>
          <p>Make room for work that matters.</p>
        </div>
      </section>

      <section className="auth-form-area">
        <div className="auth-form-card">
          <p className="section-kicker">YOUR WORKSPACE AWAITS</p>
          <h2>Welcome back.</h2>
          <p className="muted mt-2 text-sm">
            Sign in to your PaidLancer account.
          </p>

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <label className="form-label">
              Email address
              <input
                className="form-input"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                required
              />
            </label>

            <label className="form-label">
              Password
              <input
                className="form-input"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
                required
              />
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="button button-primary w-full justify-center py-3.5"
            >
              {isLoading ? "Signing in..." : "Sign in →"}
            </button>
          </form>

          <p className="muted mt-6 text-center text-sm">
            New to PaidLancer?{" "}
            <Link className="text-link" to="/register">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
