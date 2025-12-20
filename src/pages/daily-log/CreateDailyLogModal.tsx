import { useEffect, useState } from "react";
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
import { useCalendarStore } from "@/store/calendarStore.ts";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DialogTrigger } from "@radix-ui/react-dialog";

interface CreateDailyLogModalProps {
  defaultDate?: Date;
}

const CreateDailyLogModal = ({ defaultDate }: CreateDailyLogModalProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const navigate = useNavigate();

  const triggerSidebarRefresh = useDailyLogSidebarStore(
    (state) => state.triggerSidebarRefresh,
  );
  const triggerCalendarRefresh = useCalendarStore(
    (state) => state.triggerCalendarRefresh,
  );

  const handleSubmit = async () => {
    if (!date) return;

    const dailyLog = await getDailyLogByDate(date);
    if (dailyLog) {
      toast.error("이미 존재하는 일정입니다.");
      return;
    }

    const newDailyLog = await createDailyLog(date);

    triggerSidebarRefresh();
    triggerCalendarRefresh();

    setDate(undefined);

    navigate(`/daily/${newDailyLog.id}`);
  };

  useEffect(() => {
    setDate(defaultDate);
  }, [defaultDate]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-sky-100 border border-sky-300 text-black hover:bg-sky-200">
          기록하기
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md sm:mx-auto z-50">
        <DialogHeader>
          <DialogTitle>Daily 만들기</DialogTitle>
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
          <Button
            onClick={handleSubmit}
            className="bg-slate-600 hover:bg-slate-500"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDailyLogModal;
