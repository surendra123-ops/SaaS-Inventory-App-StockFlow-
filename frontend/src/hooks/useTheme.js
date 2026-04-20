import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContextValue.js";

export const useTheme = () => useContext(ThemeContext);
