import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useState } from "react";
import Button from "./ui/Button.jsx";
import { cn } from "../utils/cn.js";
import { useTheme } from "../hooks/useTheme.js";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: "◫" },
  { label: "Products", to: "/products", icon: "▦" },
  { label: "Settings", to: "/settings", icon: "⚙" }
];

const pageTitles = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/settings": "Settings"
};

function AppLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const onLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const title = pageTitles[location.pathname] || "StockFlow";

  const linkClass = ({ isActive }) =>
    cn(
      "flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium transition-all duration-150",
      isActive
        ? "bg-blue-600 text-white shadow-sm"
        : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
    );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white p-4 transition-transform duration-200 lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">StockFlow</h1>
            <Button className="lg:hidden" variant="ghost" onClick={() => setSidebarOpen(false)}>
              ✕
            </Button>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass} onClick={() => setSidebarOpen(false)}>
                <span className="text-base leading-none">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="absolute bottom-4 left-4 right-4">
            <Button className="w-full" variant="secondary" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </aside>
        {sidebarOpen && <button className="fixed inset-0 z-30 bg-gray-900/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
        <div className="w-full lg:pl-64">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <Button className="lg:hidden" variant="ghost" onClick={() => setSidebarOpen(true)}>
                  ☰
                </Button>
                <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" className="h-9 px-3" onClick={toggleTheme}>
                  {theme === "light" ? "Dark" : "Light"}
                </Button>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  {user?.email?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="hidden text-sm text-slate-600 sm:block dark:text-slate-400">{user?.email}</div>
                <div className="relative">
                  <Button variant="ghost" className="h-9 px-2" onClick={() => setMenuOpen((prev) => !prev)}>
                    ⋯
                  </Button>
                  {menuOpen && (
                    <div className="absolute right-0 top-10 z-30 w-40 rounded-md border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                      <button
                        className="flex h-9 w-full items-center rounded-md px-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                        onClick={() => {
                          setMenuOpen(false);
                          onLogout();
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
          <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
