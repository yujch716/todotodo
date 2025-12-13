import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { CalendarIcon, Clock, Pencil, Tag, Trash2 } from "lucide-react";
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
import {
  deleteCalendarEventById,
  getCalendarEventById,
  updateCalendarEvent,
} from "@/api/calendar-event";
import { useCalendarStore } from "@/store/calendarStore.ts";
import { getCategory } from "@/api/category.ts";
import type { Category } from "@/types/category.ts";

interface ScheduleModalProps {
  eventId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EventDetailModal = ({
  eventId,
  open,
  onOpenChange,
}: ScheduleModalProps) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);

  const [isAllDay, setIsAllDay] = useState(true);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category | null>(null);

  const triggerCalendarRefresh = useCalendarStore(
    (state) => state.triggerCalendarRefresh,
  );

  const fetchEventDetail = async (id: string) => {
    const data = await getCalendarEventById(id);

    if (data) {
      setTitle(data.title);
      setDescription(data.description);
      setIsAllDay(data.is_all_day);
      setStartDate(new Date(data.start_at));
      setEndDate(new Date(data.end_at));
      setCategory(data.category ?? null);
    }
  };

  const fetchCategories = async () => {
    const data = await getCategory();
    setCategories(data);
  };

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

    await updateCalendarEvent(
      eventId,
      title,
      description,
      isAllDay,
      start,
      end,
      category?.id ?? null,
    );

    triggerCalendarRefresh();

    setIsEditMode(false);
  };

  const handleDelete = async (eventId: string) => {
    await deleteCalendarEventById(eventId);

    triggerCalendarRefresh();

    setIsEditMode(false);
    onOpenChange(false);
  };

  useEffect(() => {
    if (eventId) {
      fetchEventDetail(eventId);
    }
  }, [eventId]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-md sm:mx-auto z-50">
          {isEditMode ? (
            <>
              <DialogHeader>
                <DialogTitle>일정</DialogTitle>
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
                            {startDate
                              ? format(startDate, "yyyy-MM-dd")
                              : "시작일"}
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
                            {startDate
                              ? format(startDate, "yyyy-MM-dd")
                              : "시작일"}
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
                  <Select
                    value={category?.id}
                    onValueChange={(id) => {
                      const selected = categories.find((cat) => cat.id === id);
                      setCategory(selected ?? null);
                    }}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="구분 선택" />
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
                <Button
                  onClick={handleSubmit}
                  className="bg-slate-600 hover:bg-slate-500"
                >
                  Save
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  일정
                  <div className="ml-auto flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsEditMode(true)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(eventId)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </DialogTitle>
                <DialogDescription />
              </DialogHeader>
              <div className="grid gap-4">
                <h1 className="text-2xl font-bold">{title}</h1>

                <div className="flex items-center gap-2 flex-wrap">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  {isAllDay ? (
                    <>
                      {startDate ? format(startDate, "yyyy-MM-dd") : "시작일"}
                      <span className="mx-0.5 select-none">-</span>{" "}
                      {endDate ? format(endDate, "yyyy-MM-dd") : "종료일"}
                    </>
                  ) : (
                    <>
                      {startDate ? format(startDate, "yyyy-MM-dd") : "시작일"}
                      <span className="mx-0.5" />
                      {startTime} - {endTime}
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  {category ? (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-muted"
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                    </div>
                  ) : (
                    "-"
                  )}
                </div>

                <div className="grid gap-1">
                  <Textarea
                    id="description"
                    value={description}
                    rows={4}
                    readOnly
                  />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
export default EventDetailModal;
