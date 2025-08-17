import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { format } from "date-fns";
import { Card } from "@/components/ui/card.tsx";
import type { ChallengeLog } from "@/types/challenge.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { deleteChallengeLogById } from "@/api/challenge-log.ts";
import { useChallengeStore } from "@/store/challengeStore.ts";
import { updateChallengeCompleted } from "@/api/chanllege.ts";

interface ChallengeLogCardProps {
  type: "daily" | "goal";
  logs: ChallengeLog[];
}

const ChallengeLogCard = ({ type, logs }: ChallengeLogCardProps) => {
  const triggerChallengeRefresh = useChallengeStore(
    (state) => state.triggerChallengeRefresh,
  );

  const handleDelete = async (logId: string, challengeId: string) => {
    await deleteChallengeLogById(logId);
    await updateChallengeCompleted(challengeId, { is_completed: false });

    triggerChallengeRefresh();
  };

  return (
    <Card className="flex flex-col h-full p-4 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-2">
          <Table className="rounded-lg overflow-hidden border">
            <TableHeader className="bg-slate-50">
              <TableRow>
                {type === "daily" ? (
                  <>
                    <TableHead className="w-20">날짜</TableHead>
                    <TableHead>기록</TableHead>
                  </>
                ) : (
                  <>
                    <TableHead>완료 수치</TableHead>
                  </>
                )}
                <TableHead className="w-20">완료일</TableHead>
                <TableHead className="w-0"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="group hover:bg-transparent">
                  {type === "daily" ? (
                    <>
                      <TableCell className="font-medium">
                        {format(log.date, "yyyy.MM.dd")}
                      </TableCell>
                      <TableCell>{log.memo ? log.memo : "-"}</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{log.value}</TableCell>
                    </>
                  )}
                  <TableCell>{format(log.created_at, "yyyy.MM.dd")}</TableCell>
                  <TableCell className="text-right w-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-6 h-6"
                      onClick={() => handleDelete(log.id, log.challenge_id)}
                    >
                      <X className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </Card>
  );
};
export default ChallengeLogCard;
