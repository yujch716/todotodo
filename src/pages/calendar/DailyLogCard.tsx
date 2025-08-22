import { Card } from "@/components/ui/card.tsx";
import { useNavigate } from "react-router-dom";
import { DailyLogStatusIcon } from "@/components/DailyLogStatusIcon.tsx";
import type { DailyLogType } from "@/types/daily-log.ts";

interface DailyLogCardProps {
  dailyLog: DailyLogType;
}

const DailyLogCard = ({ dailyLog }: DailyLogCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className="p-1 h-7 hover:bg-slate-50 flex items-center cursor-pointer shadow-md"
      onClick={() => navigate(`/daily?id=${dailyLog.id}`)}
    >
      <div className="flex items-center space-x-2 min-w-0">
        <DailyLogStatusIcon
          checkedCount={dailyLog.checkedCount}
          totalCount={dailyLog.totalCount}
        />
        <span className="overflow-hidden whitespace-nowrap text-ellipsis block min-w-0">
          Daily
        </span>
      </div>
    </Card>
  );
};

export default DailyLogCard;
