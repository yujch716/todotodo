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

interface ChallengeLogCardProps {
  type: "progress" | "habit";
  logs: ChallengeLog[];
}

const ChallengeLogCard = ({ type, logs }: ChallengeLogCardProps) => {
  return (
    <Card className="flex flex-col h-full p-4 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-2">
          {type === "habit" ? (
            <Table className="rounded-lg overflow-hidden border">
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-1/4">날짜</TableHead>
                  <TableHead className="w-3/4">기록</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      {format(log.date, "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell>{log.memo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table className="rounded-lg overflow-hidden border">
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>완료</TableHead>
                  <TableHead>완료일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.value}</TableCell>
                    <TableCell>
                      {format(log.created_at, "yyyy-MM-dd")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
export default ChallengeLogCard;
