import { useEffect, useMemo, useRef, useState } from "react";
import Button from "./ui/Button.jsx";

const pageTitleMap = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/settings": "Settings"
};

function Topbar({ pathname, userEmail, theme, onToggleTheme, onOpenSidebar, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const title = useMemo(() => {
    if (pathname.startsWith("/products")) return pageTitleMap["/products"];
    if (pathname.startsWith("/settings")) return pageTitleMap["/settings"];
    return pageTitleMap["/dashboard"];
  }, [pathname]);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Button className="lg:hidden" variant="ghost" onClick={onOpenSidebar}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" className="h-9 px-3" onClick={onToggleTheme}>
            {theme === "dark" ? "☀ Light" : "🌙 Dark"}
          </Button>

          <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-900 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              {userEmail?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="max-w-[180px] truncate text-sm text-slate-600 dark:text-slate-300">{userEmail}</span>
          </div>

          <div className="relative" ref={menuRef}>
            <Button variant="ghost" className="h-9 px-2" onClick={() => setMenuOpen((prev) => !prev)}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <circle cx="6" cy="12" r="1.7" />
                <circle cx="12" cy="12" r="1.7" />
                <circle cx="18" cy="12" r="1.7" />
              </svg>
            </Button>
            <div
              className={`absolute right-0 top-11 w-44 origin-top-right rounded-lg border border-slate-200 bg-white p-1 shadow-lg transition-all duration-200 dark:border-slate-700 dark:bg-slate-900 ${
                menuOpen ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
              }`}
            >
              <button
                className="flex h-9 w-full items-center rounded-md px-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
