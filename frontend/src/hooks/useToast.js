import { useContext } from "react";
import { ToastContext } from "../context/ToastContextValue.js";

export function useToast() {
  return useContext(ToastContext);
}
