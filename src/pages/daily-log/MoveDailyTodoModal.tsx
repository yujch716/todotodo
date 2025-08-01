import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { format } from "date-fns";
import { cn } from "@/lib/utils.ts";
import { CalendarIcon } from "lucide-react";
import { createDailyLog, getDailyLogByDate } from "@/api/daily-log.ts";
import { useDailyLogSidebarStore } from "@/store/dailyLogSidebarStore.ts";
import { createDailyTodo, deleteDailyTodo } from "@/api/daily-todo.ts";
import { useDailyLogDetailStore } from "@/store/dailyLogDetailStore.ts";

interface CopyDailyTodoModalProps {
  id: string;
  content: string;
  onClose: () => void;
}

const MoveDailyTodoModal = ({
  id,
  content,
  onClose,
}: CopyDailyTodoModalProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const triggerSidebarRefresh = useDailyLogSidebarStore(
    (state) => state.triggerSidebarRefresh,
  );
  const triggerDailyLogDetailRefresh = useDailyLogDetailStore(
    (state) => state.triggerDailyLogRefresh,
  );

  const handleSubmit = async () => {
    if (!date) return;

    let dailyLog = await getDailyLogByDate(date);
    if (!dailyLog) {
      dailyLog = await createDailyLog(date);
    }

    await createDailyTodo(dailyLog.id, content);

    await deleteDailyTodo(id);

    triggerSidebarRefresh();
    triggerDailyLogDetailRefresh();

    setDate(undefined);
    onClose();
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="w-full max-w-md sm:mx-auto z-50">
        <DialogHeader>
          <DialogTitle>투두 항목 이동</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="date">날짜</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(!date && "text-muted-foreground")}
                >
                  {date
                    ? format(date, "yyyy-MM-dd")
                    : format(new Date(), "yyyy-MM-dd")}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoveDailyTodoModal;
