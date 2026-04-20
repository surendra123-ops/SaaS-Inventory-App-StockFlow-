import { cn } from "../../utils/cn.js";

function Card({ children, className }) {
  return <div className={cn("rounded-xl border border-gray-200 bg-white shadow-sm", className)}>{children}</div>;
}

export default Card;
