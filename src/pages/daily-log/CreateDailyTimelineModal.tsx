import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { SquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "sonner";
import { createDailyTimetable } from "@/api/daily-timetable.ts";
import type { DailyTimetableType } from "@/types/daily-log";
import TimeSelect from "@/components/TimeSelect";

interface Props {
  dailyLogId: string;
  timetables: DailyTimetableType[];
}

const CreateDailyTimelineModal = ({ dailyLogId, timetables }: Props) => {
  const [open, setOpen] = useState(false);
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("10:00");
  const [content, setContent] = useState<string>("");

  const getDisabledStartTimes = () => {
    const occupiedSlots: string[] = [];

    timetables.forEach(tt => {
      const [startHour, startMinute] = tt.start_time.split(':').map(Number);
      const [endHour, endMinute] = tt.end_time.split(':').map(Number);

      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;

      for (let minutes = startTotalMinutes; minutes < endTotalMinutes; minutes += 30) {
        const hour = Math.floor(minutes / 60);
        const minute = minutes % 60;
        occupiedSlots.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
      }
    });

    return occupiedSlots;
  };


  const getDisabledEndTimes = () => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const startTotalMinutes = startHour * 60 + startMinute;

    // 1. 선택한 시작 시간 이하 비활성화
    const disabledTimes: string[] = [];
    for (let minutes = 0; minutes <= startTotalMinutes; minutes += 30) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      disabledTimes.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
    }

    // 2. 기존 타임테이블의 start < time <= end (시작 시간은 제외, 종료 시간은 포함)
    timetables.forEach(tt => {
      const [ttStartHour, ttStartMinute] = tt.start_time.split(':').map(Number);
      const [ttEndHour, ttEndMinute] = tt.end_time.split(':').map(Number);

      const ttStartTotalMinutes = ttStartHour * 60 + ttStartMinute;
      const ttEndTotalMinutes = ttEndHour * 60 + ttEndMinute;

      // start < time <= end
      for (let minutes = ttStartTotalMinutes + 30; minutes <= ttEndTotalMinutes; minutes += 30) {
        const hour = Math.floor(minutes / 60);
        const minute = minutes % 60;
        disabledTimes.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
      }
    });

    return [...new Set(disabledTimes)];
  };

  const handleSubmit = async () => {
    if (!content.trim()) toast.error("내용을 입력하새요");
    if (!startTime) toast.error("시작시간 입력하새요");
    if (!endTime) toast.error("종료시간 입력하새요");

    await createDailyTimetable(dailyLogId, content, startTime, endTime);

    setOpen(false);
    setContent("");
    setStartTime("");
    setEndTime("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex w-6 h-6 p-4 [&>svg]:!w-5 [&>svg]:!h-5"
        >
          <SquarePlus />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-md sm:mx-auto z-50">
        <DialogHeader>
          <DialogTitle>Timeline 만들기</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="start-time" className="w-24">
              시작 시간
            </Label>
            <TimeSelect
              value={startTime}
              onValueChange={setStartTime}
              disabledTimes={getDisabledStartTimes()}
              placeholder="시작 시간 선택"
              />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="end-time" className="w-24">
              종료 시간
            </Label>
            <TimeSelect
              value={endTime}
              onValueChange={setEndTime}
              disabledTimes={getDisabledEndTimes()}
              placeholder="종료 시간 선택"
            />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="timeline-content" className="w-24">
              내용
            </Label>
            <Input
              id="content"
              value={content}
              placeholder="일정 내용을 입력하세요"
              onChange={(e) => setContent(e.target.value)}
            />
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
export default CreateDailyTimelineModal;
