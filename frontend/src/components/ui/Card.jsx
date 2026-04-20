import { cn } from "../../utils/cn.js";

function Card({ children, className }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/40",
        className
      )}
    >
      {children}
    </div>
  );
}

export default Card;
