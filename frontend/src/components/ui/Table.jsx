import { cn } from "../../utils/cn.js";

export function Table({ children, className }) {
  return (
    <div className="overflow-x-auto">
      <table className={cn("min-w-full text-sm", className)}>{children}</table>
    </div>
  );
}

export function THead({ children }) {
  return <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">{children}</thead>;
}

export function TH({ children, className }) {
  return <th className={cn("px-4 py-3 text-left text-sm font-semibold text-slate-500 dark:text-slate-400", className)}>{children}</th>;
}

export function TBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TR({ children, className }) {
  return (
    <tr
      className={cn(
        "border-b border-gray-100 odd:bg-white even:bg-gray-50/40 transition-colors duration-150 hover:bg-gray-50",
        "dark:border-slate-800 dark:odd:bg-slate-950 dark:even:bg-slate-900/70 dark:hover:bg-slate-900",
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TD({ children, className }) {
  return <td className={cn("px-4 py-4 text-sm text-slate-700 dark:text-slate-300", className)}>{children}</td>;
}
