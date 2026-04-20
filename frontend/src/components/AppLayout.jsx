import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useState } from "react";
import Button from "./ui/Button.jsx";
import { cn } from "../utils/cn.js";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Products", to: "/products" },
  { label: "Settings", to: "/settings" }
];

const pageTitles = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/settings": "Settings"
};

function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const title = pageTitles[location.pathname] || "StockFlow";

  const linkClass = ({ isActive }) =>
    cn(
      "flex h-10 items-center rounded-md px-3 text-sm font-medium transition",
      isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
    );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-200 bg-white p-4 transition-transform lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight">StockFlow</h1>
            <Button className="lg:hidden" variant="ghost" onClick={() => setSidebarOpen(false)}>
              ✕
            </Button>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass} onClick={() => setSidebarOpen(false)}>
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
          <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <Button className="lg:hidden" variant="ghost" onClick={() => setSidebarOpen(true)}>
                  ☰
                </Button>
                <h2 className="text-lg font-semibold">{title}</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                  {user?.email?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="hidden text-sm text-gray-600 sm:block">{user?.email}</div>
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
