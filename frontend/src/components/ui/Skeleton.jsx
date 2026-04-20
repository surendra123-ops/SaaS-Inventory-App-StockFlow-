import { cn } from "../../utils/cn.js";

function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-md bg-gray-200/80", className)} />;
}

export default Skeleton;
