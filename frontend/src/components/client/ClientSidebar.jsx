
import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

function Icon({ name, size = 20 }) {
  const paths = {
    overview: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    jobs: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 5V3h8v2M3 11h18M10 11v2h4v-2" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4 4" />
      </>
    ),
    arrow: <path d="M7 17 17 7M7 7h10v10" />,
    moon: (
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5M15 12H3" />
        <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export default function ClientSidebar({
  user,
  onLogout,
  onNavigate,
  isLoggingOut = false,
}) {
  const { theme, toggleTheme } = useTheme();

  const handleNavigation = () => {
    onNavigate?.();
  };

  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden border-r border-stone-200 bg-white dark:border-white/10 dark:bg-[#191d19]">
      {/* Profile */}
      <div className="shrink-0 px-4 pb-5 pt-5">
        <div className="rounded-2xl bg-stone-50 p-4 dark:bg-white/[0.04]">
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-stone-400">
            Your workspace
          </p>

          <div className="mt-4 flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
              {(user?.name || "C").charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-stone-900 dark:text-stone-100">
                {user?.name || "Client"}
              </p>

              <p className="mt-1 truncate text-xs text-stone-500 dark:text-stone-400">
                {user?.email || "Client account"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation scrolls if the available height is limited */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.17em] text-stone-400">
          Workspace
        </p>

        <NavLink
          to="/client/dashboard"
          end
          onClick={handleNavigation}
          className={({ isActive }) =>
            `mb-1 flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300"
                : "text-stone-500 hover:bg-stone-50 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-white"
            }`
          }
        >
          <Icon name="overview" size={18} />
          Overview
        </NavLink>

        <Link
          to="/client/dashboard#projects"
          onClick={handleNavigation}
          className="mb-1 flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-stone-500 transition hover:bg-stone-50 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-white"
        >
          <Icon name="jobs" size={18} />
          My projects
        </Link>

        <Link
          to="/"
          onClick={handleNavigation}
          className="mb-1 flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-stone-500 transition hover:bg-stone-50 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-white"
        >
          <Icon name="search" size={18} />
          Browse marketplace
        </Link>

        <div className="mt-6 rounded-2xl bg-[#183f2c] p-4 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
            <Icon name="jobs" size={19} />
          </div>

          <h3 className="mt-3 text-sm font-semibold">
            Have a project in mind?
          </h3>

          <p className="mt-2 text-xs leading-5 text-white/70">
            Share your idea and discover the right talent.
          </p>

          <Link
            to="/client/post-job"
            onClick={handleNavigation}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-[#183f2c] transition hover:bg-emerald-50"
          >
            Post a project
            <Icon name="arrow" size={15} />
          </Link>
        </div>
      </nav>

      {/* Controls remain at the bottom of the sidebar */}
      <div className="shrink-0 border-t border-stone-200 bg-white p-3 dark:border-white/10 dark:bg-[#191d19]">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          aria-pressed={theme === "dark"}
          className="mb-1 flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-stone-300 dark:hover:bg-white/5 dark:hover:text-white"
        >
          <Icon name={theme === "light" ? "moon" : "sun"} size={18} />
          {theme === "light" ? "Dark mode" : "Light mode"}
        </button>

        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-stone-600 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-60 dark:text-stone-300 dark:hover:bg-red-400/10 dark:hover:text-red-300"
        >
          <Icon name="logout" size={18} />
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
