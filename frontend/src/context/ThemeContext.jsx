import { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./ThemeContextValue.js";

const THEME_STORAGE_KEY = "stockflow_theme";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    const timeout = window.setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 260);
    return () => window.clearTimeout(timeout);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((prev) => (prev === "light" ? "dark" : "light"))
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
