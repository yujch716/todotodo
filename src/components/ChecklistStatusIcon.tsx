import { CircleCheck, CircleMinus, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  checkedCount: number;
  totalCount: number;
};

export const ChecklistStatusIcon = ({ checkedCount, totalCount }: Props) => {
  let Icon = CircleX;
  let className = "text-red-500 bg-red-100 border-red-500";

  if (checkedCount === totalCount && totalCount > 0) {
    Icon = CircleCheck;
    className = "text-green-500 bg-green-100 border-green-500";
  } else if (checkedCount > 0) {
    Icon = CircleMinus;
    className = "text-yellow-500 bg-yellow-100 border-yellow-500";
  }

  return (
    <span className={cn("rounded-full flex items-center", className)}>
      <Icon className="w-4 h-4" />
    </span>
  );
};
