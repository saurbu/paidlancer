
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  useGetMeQuery,
  useLogoutMutation,
} from "../services/api";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const { data, isLoading } = useGetMeQuery();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [logoutError, setLogoutError] = useState("");

  const logo = theme === "light" ? "/logo.png" : "/logo1.png";

  const user =
    data?.user || data?.data?.user || data?.currentUser || null;

  const dashboard =
    user?.role === "client"
      ? "/client/dashboard"
      : "/freelancer/dashboard";

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive
        ? "text-emerald-700 dark:text-emerald-400"
        : "muted hover:text-emerald-700"
    }`;

  const handleLogout = async () => {
    setLogoutError("");

    try {
      await logout().unwrap();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      setLogoutError(
        error?.data?.message || "Logout failed. Please try again."
      );
    }
  };

  return (
    <header className="site-header">
      <nav className="site-nav">
        <Link to="/" className="brand flex items-center">
          <img
            src={logo}
            alt="PaidLancer"
            className="h-10 w-10 object-contain"
          />
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>

          <a href="/#jobs" className="nav-link muted">
            Find work
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {!isLoading &&
            (user ? (
              <>
                <span className="hidden max-w-28 truncate text-sm font-medium sm:block">
                  {user.name}
                </span>

                <Link to={dashboard} className="button button-primary">
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="button"
                >
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden text-sm font-semibold sm:block"
                >
                  Log in
                </Link>

                <Link to="/register" className="button button-primary">
                  Get started
                </Link>
              </>
            ))}

          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={`Switch to ${
              theme === "light" ? "dark" : "light"
            } mode`}
            title={`Switch to ${
              theme === "light" ? "dark" : "light"
            } mode`}
          >
            {theme === "light" ? "☾" : "☀"}
          </button>
        </div>
      </nav>

      {logoutError && (
        <p className="px-4 py-2 text-sm text-red-600" role="alert">
          {logoutError}
        </p>
      )}
    </header>
  );
}
