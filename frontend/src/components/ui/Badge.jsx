import { cn } from "../../utils/cn.js";

const styles = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  danger: "bg-red-50 text-red-700 ring-red-200",
  neutral: "bg-gray-100 text-gray-700 ring-gray-200"
};

function Badge({ children, variant = "neutral", className }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1", styles[variant], className)}>
      {children}
    </span>
  );
}

export default Badge;
