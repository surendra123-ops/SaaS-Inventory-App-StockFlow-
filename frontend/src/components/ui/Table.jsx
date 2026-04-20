import { cn } from "../../utils/cn.js";

export function Table({ children, className }) {
  return (
    <div className="overflow-x-auto">
      <table className={cn("min-w-full text-sm", className)}>{children}</table>
    </div>
  );
}

export function THead({ children }) {
  return <thead className="border-b border-gray-200 bg-gray-50/70">{children}</thead>;
}

export function TH({ children, className }) {
  return <th className={cn("px-4 py-3 text-left font-medium text-gray-500", className)}>{children}</th>;
}

export function TBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TR({ children, className }) {
  return <tr className={cn("border-b border-gray-100 odd:bg-white even:bg-gray-50/30 hover:bg-gray-50", className)}>{children}</tr>;
}

export function TD({ children, className }) {
  return <td className={cn("px-4 py-3 text-gray-700", className)}>{children}</td>;
}
