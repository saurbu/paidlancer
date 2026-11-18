
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGetMeQuery, useLogoutMutation } from "../../services/api";
import FreelancerSidebar from "./FreelancerSidebar";

export default function FreelancerLayout() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: userData } = useGetMeQuery();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const user =
    userData?.user ||
    userData?.data?.user ||
    userData?.currentUser ||
    null;

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      await logout().unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f5] text-stone-900 dark:bg-[#141713] dark:text-stone-100">
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative flex h-full w-[min(300px,85vw)] flex-col bg-white shadow-2xl dark:bg-[#191d19]">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-stone-200 px-4 dark:border-white/10">
              <span className="text-sm font-semibold">
                Your workspace
              </span>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 dark:hover:bg-white/10"
              >
                ×
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <FreelancerSidebar
                user={user}
                onLogout={handleLogout}
                onNavigate={() => setMobileMenuOpen(false)}
                isLoggingOut={isLoggingOut}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-stretch">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 self-stretch lg:block">
          <div className="sticky top-[72px] h-[calc(100vh-72px)]">
            <FreelancerSidebar
              user={user}
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-h-screen min-w-0 flex-1">
          <div className="mb-6 px-4 pt-6 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm font-medium dark:border-white/10 dark:bg-[#191d19]"
            >
              ☰ Menu
            </button>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
