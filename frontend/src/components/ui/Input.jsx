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
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
          {required ? " *" : ""}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "h-10 w-full rounded-md border bg-white px-3 text-sm text-gray-900 outline-none transition-colors duration-150 placeholder:text-gray-400 focus:ring-2",
          error
            ? "border-red-400 focus:border-red-400 focus:ring-red-200"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default Input;
