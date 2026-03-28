import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { SquarePlus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "sonner";
import { createDailyTimetable } from "@/api/daily-timetable.ts";
import type { DailyTimetableType } from "@/types/daily-log.ts";
import TimeSelect from "@/components/TimeSelect.tsx";
import { useDailyTimetableStore } from "@/store/dailyTimetableStore.ts";
import type { Category } from "@/types/category.ts";
import { getCategory } from "@/api/category.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

interface Props {
  dailyLogId: string;
  timetables: DailyTimetableType[];
}

const CreateDailyTimetableModal = ({ dailyLogId, timetables }: Props) => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("10:00");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<string | null>(null);

  const triggerTimeTableRefresh = useDailyTimetableStore(
    (state) => state.triggerDailyTimetableRefresh,
  );

  const loadCategories = useCallback(async () => {
    const data = await getCategory();
    setCategories(data);
  }, []);

  const timeToMinutesFromStart = (time: string): number => {
    const [hour, minute] = time.split(":").map(Number);
    // 00시~04시는 다음날로 처리 (24시간 추가)
    const adjustedHour = hour >= 0 && hour < 4 ? hour + 24 : hour;
    return adjustedHour * 60 + minute;
  };

  const occupiedSlots = useMemo(() => {
    const slots = new Set<string>();
    timetables.forEach((tt) => {
      const startMinutes = timeToMinutesFromStart(tt.start_time);
      const endMinutes = timeToMinutesFromStart(tt.end_time);
      for (let minutes = startMinutes; minutes < endMinutes; minutes += 10) {
        const hour = Math.floor(minutes / 60) % 24;
        const minute = minutes % 60;
        slots.add(
          `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
        );
      }
    });
    return Array.from(slots);
  }, [timetables]);

  const disabledStartTimes = occupiedSlots;

  const disabledEndTimes = useMemo(() => {
    const startTotalMinutes = timeToMinutesFromStart(startTime);
    const nextOccupiedMinutes = occupiedSlots
      .map((slot) => timeToMinutesFromStart(slot))
      .filter((m) => m > startTotalMinutes)
      .sort((a, b) => a - b)[0];

    const disabledTimes: string[] = [];

    for (let minutes = 0; minutes < 24 * 60; minutes += 10) {
      const adjustedMinutes = minutes < 4 * 60 ? minutes + 24 * 60 : minutes;
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

      if (
        adjustedMinutes <= startTotalMinutes ||
        (nextOccupiedMinutes !== undefined &&
          adjustedMinutes >= nextOccupiedMinutes)
      ) {
        disabledTimes.push(timeStr);
      }
    }

    return disabledTimes;
  }, [startTime, occupiedSlots]);

  const normalizeTimeForApi = (time: string): string => {
    const [hour, minute] = time.split(":").map(Number);
    const normalizedHour = hour >= 24 ? hour - 24 : hour;
    return `${String(normalizedHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("내용을 입력하세요");
      return;
    }
    if (!startTime) {
      toast.error("시작시간을 입력하세요");
      return;
    }
    if (!endTime) {
      toast.error("종료시간을 입력하세요");
      return;
    }

    // 시간 겹침 검증
    const newStartMinutes = timeToMinutesFromStart(startTime);
    const newEndMinutes = timeToMinutesFromStart(endTime);

    const hasConflict = timetables.some((tt) => {
      const existingStartMinutes = timeToMinutesFromStart(tt.start_time);
      const existingEndMinutes = timeToMinutesFromStart(tt.end_time);

      return (
        (newStartMinutes >= existingStartMinutes &&
          newStartMinutes < existingEndMinutes) ||
        (newEndMinutes > existingStartMinutes &&
          newEndMinutes <= existingEndMinutes) ||
        (newStartMinutes <= existingStartMinutes &&
          newEndMinutes >= existingEndMinutes)
      );
    });

    if (hasConflict) {
      toast.error("선택한 시간이 기존 일정과 겹칩니다");
      return;
    }

    await createDailyTimetable(
      dailyLogId,
      content,
      normalizeTimeForApi(startTime),
      normalizeTimeForApi(endTime),
      category,
    );

    setOpen(false);
    setContent("");
    setStartTime("09:00");
    setEndTime("10:00");
    setCategory(null);

    triggerTimeTableRefresh();
  };

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

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
          <DialogTitle>일정 생성</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <Input
            id="content"
            value={content}
            placeholder="일정 내용을 입력하세요"
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />

          <div className="flex items-center gap-2">
            <Label htmlFor="start-time" className="w-24">
              시작 시간
            </Label>
            <TimeSelect
              value={startTime}
              onValueChange={setStartTime}
              disabledTimes={disabledStartTimes}
              placeholder="시작 시간 선택"
              isEnd={false}
            />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="end-time" className="w-24">
              종료 시간
            </Label>
            <TimeSelect
              value={endTime}
              onValueChange={setEndTime}
              disabledTimes={disabledEndTimes}
              placeholder="종료 시간 선택"
              isEnd={true}
            />
          </div>

          <div className="flex items-center gap-3">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <Select value={category ?? undefined} onValueChange={setCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-muted"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span>{cat.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
export default CreateDailyTimetableModal;
