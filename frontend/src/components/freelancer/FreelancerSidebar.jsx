
import { NavLink } from "react-router-dom";

function Icon({ name, size = 18 }) {
  const paths = {
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4 4" />
      </>
    ),
    applications: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h4" />
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

export default function FreelancerSidebar({
  user,
  onLogout,
  onNavigate,
  isLoggingOut = false,
}) {
  return (
    <aside className="sticky top-0 flex h-[calc(100dvh-84px)] min-h-0 w-full flex-col overflow-hidden border-r border-stone-200 bg-white dark:border-white/10 dark:bg-[#191d19]">

      {/* Profile */}
      <div className="shrink-0 px-4 pb-3 pt-4">
        <div className="rounded-xl bg-stone-50 p-3 dark:bg-white/[0.04]">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-400">
            Your workspace
          </p>

          <div className="mt-3 flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-sm font-bold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
              {user?.profileImg ? (
                <img
                  src={user.profileImg}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                (user?.name || "F").charAt(0).toUpperCase()
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-stone-900 dark:text-stone-100">
                {user?.name || "Freelancer"}
              </p>
              <p className="mt-0.5 truncate text-xs text-stone-500 dark:text-stone-400">
                {user?.email || "Freelancer account"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="min-h-0 flex-1 px-3 py-3">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-stone-400">
          Workspace
        </p>

        <NavLink
          to="/freelancer/dashboard"
          end
          onClick={onNavigate}
          className={({ isActive }) =>
            `mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300"
                : "text-stone-500 hover:bg-stone-50 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-white"
            }`
          }
        >
          <Icon name="search" />
          Discover jobs
        </NavLink>

        <NavLink
          to="/freelancer/applications"
          onClick={onNavigate}
          className={({ isActive }) =>
            `mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300"
                : "text-stone-500 hover:bg-stone-50 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-white"
            }`
          }
        >
          <Icon name="applications" />
          My applications
        </NavLink>
      </nav>

      {/* Always-visible logout */}
      <div className="shrink-0 border-t border-stone-200 bg-white p-3 dark:border-white/10 dark:bg-[#191d19]">
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50 dark:text-stone-300 dark:hover:bg-red-400/10 dark:hover:text-red-300"
        >
          <Icon name="logout" />
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
