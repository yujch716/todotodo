import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "sonner";
import { updateDailyTimetable } from "@/api/daily-timetable.ts";
import type { DailyTimetableType } from "@/types/daily-log";
import TimeSelect from "@/components/TimeSelect";
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timetable: DailyTimetableType | null;
  allTimetables: DailyTimetableType[];
}

const EditDailyTimetableModal = ({
  open,
  onOpenChange,
  timetable,
  allTimetables,
}: Props) => {
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

  const otherTimetables = useMemo(() => {
    return allTimetables.filter((tt) => tt.id !== timetable?.id);
  }, [allTimetables, timetable?.id]);

  const timeToMinutesFromStart = (time: string): number => {
    const [hour, minute] = time.split(":").map(Number);
    const adjustedHour = hour >= 0 && hour < 4 ? hour + 24 : hour;
    return adjustedHour * 60 + minute;
  };

  const occupiedSlots = useMemo(() => {
    const slots = new Set<string>();
    otherTimetables.forEach((tt) => {
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
  }, [otherTimetables]);

  const disabledStartTimes = occupiedSlots; // 이미 useMemo라 그대로 사용

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

  const handleSubmit = async () => {
    if (!timetable) return;

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

    // 시간 겹침 검증 (현재 편집 중인 타임테이블 제외)
    const newStartMinutes = timeToMinutesFromStart(startTime);
    const newEndMinutes = timeToMinutesFromStart(endTime);

    const hasConflict = otherTimetables.some((tt) => {
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

    await updateDailyTimetable(
      timetable.id,
      content,
      startTime,
      endTime,
      category,
    );

    onOpenChange(false);
    triggerTimeTableRefresh();
  };

  // 모달이 열릴 때 기존 데이터로 초기화
  useEffect(() => {
    if (open && timetable) {
      setContent(timetable.content);
      setStartTime(timetable.start_time);
      setEndTime(timetable.end_time);
      setCategory(timetable.category?.id || null);
    }
  }, [open, timetable]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  if (!timetable) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md sm:mx-auto z-50">
        <DialogHeader>
          <DialogTitle>일정 수정</DialogTitle>
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

export default EditDailyTimetableModal;
