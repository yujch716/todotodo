import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {CalendarClock} from 'lucide-react';
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table.tsx";
import CreateDailyTimelineModal from "@/pages/daily-log/CreateDailyTimelineModal.tsx";

const TimelinePanel = () => {
  const hours = Array.from({ length: 24 }, (_, i) => (i + 7) % 24);

  return (<>
    <Card className="flex flex-col h-full overflow-hidden shadow-lg border-1">
      <CardHeader>
        <CardTitle className="text-base">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <CalendarClock /> Timeline
            </div>

            <CreateDailyTimelineModal />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-x-auto">
        <Table>
          <TableBody>
            {hours.map((hour) => (
              <TableRow>
                <TableCell className="border-r w-[1%] whitespace-nowrap">{String(hour).padStart(2, '0')}:00</TableCell>
                <TableCell>f</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </>);
}
export default TimelinePanel;