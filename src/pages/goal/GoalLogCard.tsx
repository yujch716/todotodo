import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { format } from "date-fns";
import { Card } from "@/components/ui/card.tsx";
import { type GoalLog, GoalStatus } from "@/types/goal.ts";
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
import { deleteGoalLogById } from "@/api/goal-log.ts";
import { useGoalStore } from "@/store/goalStore.ts";
import { updateGoalStatus } from "@/api/goal.ts";

interface GoalLogCardProps {
  type: "daily" | "goal";
  logs: GoalLog[];
}

const GoalLogCard = ({ type, logs }: GoalLogCardProps) => {
  const triggerGoalRefresh = useGoalStore((state) => state.triggerGoalRefresh);

  const handleDelete = async (logId: string, goalId: string) => {
    await deleteGoalLogById(logId);
    await updateGoalStatus(goalId, GoalStatus.inProgress);

    triggerGoalRefresh();
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
                      onClick={() => handleDelete(log.id, log.goal_id)}
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
export default GoalLogCard;
