import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { format } from "date-fns";
import { Card } from "@/components/ui/card.tsx";
import type { ChallengeLog } from "@/types/challenge.ts";

interface ChallengeLogCardProps {
  logs: ChallengeLog[];
}

const ChallengeLogCard = ({ logs }: ChallengeLogCardProps) => {
  return (
    <Card className="flex flex-col h-full p-4 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-2">
          {logs.map((log, i) => (
            <div key={i} className="flex items-center gap-2 py-5">
              <div className="w-5 h-5 rounded-sm border bg-sky-100" />
              <div className="flex-grow overflow-hidden whitespace-nowrap text-ellipsis leading-tight text-base font-bold">
                {format(log.date, "yyyy-MM-dd")}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
export default ChallengeLogCard;
