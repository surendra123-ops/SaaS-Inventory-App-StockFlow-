import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useState } from "react";
import { useTheme } from "../hooks/useTheme.js";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

function AppLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userEmail={user?.email}
          onLogout={onLogout}
        />
        <div className="w-full lg:pl-60">
          <Topbar
            pathname={location.pathname}
            userEmail={user?.email}
            theme={theme}
            onToggleTheme={toggleTheme}
            onOpenSidebar={() => setSidebarOpen(true)}
            onLogout={onLogout}
          />
          <main className="mx-auto w-full max-w-7xl px-6 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
