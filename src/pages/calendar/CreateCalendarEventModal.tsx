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
import { CalendarIcon, CalendarPlus, Clock, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { format, setHours, setMinutes, setSeconds } from "date-fns";
import { Calendar } from "@/components/ui/calendar.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { toast } from "sonner";
import { createCalendarEvent } from "@/api/calendar-event";
import { useCalendarStore } from "@/store/calendarStore.ts";

interface ScheduleModalProps {
  selectedDate: Date;
}

const CreateCalendarEventModal = ({ selectedDate }: ScheduleModalProps) => {
  const [open, setOpen] = useState(false);

  const [isAllDay, setIsAllDay] = useState(true);

  const [startDate, setStartDate] = useState<Date | undefined>(selectedDate);
  const [endDate, setEndDate] = useState<Date | undefined>(selectedDate);

  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const triggerCalendarRefresh = useCalendarStore(
    (state) => state.triggerCalendarRefresh,
  );

  const categoryOptions = [
    { value: "meeting", label: "회의" },
    { value: "business_trip", label: "외근" },
    { value: "vacation", label: "휴가" },
  ];

  const handleSubmit = async () => {
    if (!title || !startDate || !endDate) {
      toast.error("제목과 날짜는 필수입니다.");
      return;
    }

    const start = isAllDay
      ? startDate
      : setSeconds(
          setMinutes(
            setHours(startDate, Number(startTime.split(":")[0])),
            Number(startTime.split(":")[1]),
          ),
          0,
        );

    const end = isAllDay
      ? endDate
      : setSeconds(
          setMinutes(
            setHours(endDate, Number(endTime.split(":")[0])),
            Number(endTime.split(":")[1]),
          ),
          0,
        );

    await createCalendarEvent(title, description, isAllDay, start, end, null);

    triggerCalendarRefresh();

    setTitle("");
    setDescription("");
    setOpen(false);
  };

  useEffect(() => {
    setStartDate(selectedDate);
    setEndDate(selectedDate);
  }, [selectedDate]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button variant="outline" size="icon" className="size-6">
            <CalendarPlus />
          </Button>
        </DialogTrigger>

        <DialogContent className="w-full max-w-md sm:mx-auto z-50">
          <DialogHeader>
            <DialogTitle>일정 추가</DialogTitle>
            <DialogDescription />
          </DialogHeader>

          <div className="grid gap-4">
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목"
            />

            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="is-all-day"
                checked={isAllDay}
                onCheckedChange={() => setIsAllDay(!isAllDay)}
              />
              <Label htmlFor="is-all-day">하루종일</Label>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <CalendarIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />

              {isAllDay ? (
                <>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start">
                        {startDate ? format(startDate, "yyyy-MM-dd") : "시작일"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          setStartDate(date);
                          setEndDate(date);
                        }}
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <span className="mx-1 select-none">-</span>{" "}
                  {/* 날짜 사이 하이픈 */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start">
                        {endDate ? format(endDate, "yyyy-MM-dd") : "종료일"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                </>
              ) : (
                <>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start">
                        {startDate ? format(startDate, "yyyy-MM-dd") : "시작일"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                </>
              )}
            </div>

            {!isAllDay && (
              <div className="flex items-center gap-2 flex-nowrap">
                <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
                <span className="mx-1 select-none">-</span>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <Select value={category ?? undefined} onValueChange={setCategory}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="구분 선택" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1">
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="설명 (선택)"
                rows={4}
              />
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
    </>
  );
};
export default CreateCalendarEventModal;
