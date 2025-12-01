import {
  CircleCheck,
  CircleEllipsis,
  CircleX,
  CircleDashed,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  checkedCount: number;
  totalCount: number;
  iconClassName?: string;
};

export const DailyLogStatusIcon = ({
  checkedCount,
  totalCount,
  iconClassName = "w-4 h-4",
}: Props) => {
  let Icon = CircleX;
  let className = "text-red-500 bg-red-100 border-red-500";

  if (totalCount === 0) {
    Icon = CircleDashed;
    className = "text-gray-500 bg-gray-100 border-gray-500";
  } else if (checkedCount === totalCount && totalCount > 0) {
    Icon = CircleCheck;
    className = "text-green-500 bg-green-100 border-green-500";
  } else if (checkedCount > 0) {
    Icon = CircleEllipsis;
    className = "text-yellow-500 bg-yellow-100 border-yellow-500";
  }

  return (
    <span className={cn("rounded-full flex items-center", className)}>
      <Icon className={iconClassName} />
    </span>
  );
};
