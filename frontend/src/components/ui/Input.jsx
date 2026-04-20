import { cn } from "../../utils/cn.js";

function Input({
  id,
  label,
  error,
  className,
  containerClassName,
  required = false,
  ...props
}) {
  return (
    <div className={cn("space-y-1", containerClassName)}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required ? " *" : ""}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "h-10 w-full rounded-md border bg-white px-3 text-sm text-slate-900 outline-none transition-all duration-150 placeholder:text-slate-400 focus:ring-2 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500",
          error
            ? "border-red-400 focus:border-red-400 focus:ring-red-200 dark:border-red-500 dark:focus:ring-red-900/50"
            : "border-slate-300 focus:border-blue-500 focus:ring-blue-200 dark:border-slate-700 dark:focus:ring-blue-900/50",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

export default Input;
