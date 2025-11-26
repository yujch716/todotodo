import { useEffect, useState } from "react";
import { useGoalStore } from "@/store/goalStore.ts";
import { toast } from "sonner";
import { updateGoal } from "@/api/goal.ts";
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
import { CalendarIcon, FilePenLine, Flag } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import EmojiPicker from "emoji-picker-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Label } from "@/components/ui/label.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import type { Goal, UpdateGoalDto } from "@/types/goal.ts";
import type { DateRange } from "react-day-picker";

const days = [
  { label: "일", value: "sun" },
  { label: "월", value: "mon" },
  { label: "화", value: "tue" },
  { label: "수", value: "wed" },
  { label: "목", value: "thu" },
  { label: "금", value: "fri" },
  { label: "토", value: "sat" },
];

interface UpdateGoalModalProps {
  goal: Goal;
}

const UpdateGoalModal = ({ goal }: UpdateGoalModalProps) => {
  const type = goal.type;

  const [open, setOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [emoji, setEmoji] = useState(goal.emoji);
  const [title, setTitle] = useState(goal.title);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: goal.start_date,
    to: goal.end_date,
  });
  const [isEveryDay, setIsEveryDay] = useState(
    goal.repeat_days?.length === 7,
  );
  const [repeatDays, setRepeatDays] = useState<string[] | null>(
    goal.repeat_days,
  );
  const [targetValue, setTargetValue] = useState(goal.target_value);

  const triggerGoalRefresh = useGoalStore(
    (state) => state.triggerGoalRefresh,
  );

  const onSubmit = async () => {
    const repeat_days =
      type === "daily"
        ? isEveryDay
          ? days.map((d) => d.value)
          : repeatDays
        : null;

    const goalPayload: UpdateGoalDto = {
      emoji,
      title,
      ...(type === "daily" && {
        start_date: dateRange?.from
          ? format(dateRange.from, "yyyy-MM-dd")
          : undefined,
        end_date: dateRange?.to
          ? format(dateRange.to, "yyyy-MM-dd")
          : undefined,
        repeat_days: repeat_days ?? undefined,
      }),
      ...(type === "goal" && { target_value: Number(targetValue) }),
    };

    await updateGoal(goal.id, goalPayload);

    triggerGoalRefresh();

    toast.info("챌린지가 수정되었습니다.");

    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      setEmoji(goal.emoji);
      setTitle(goal.title);
      setDateRange({
        from: goal.start_date,
        to: goal.end_date,
      });
      setIsEveryDay(goal.repeat_days?.length === 7);
      setRepeatDays(goal.repeat_days);
      setTargetValue(goal.target_value);
    }
  }, [open, goal]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="ml-auto cursor-pointer hover:text-blue-600">
          <FilePenLine />
        </div>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md sm:mx-auto z-50">
        <DialogHeader>
          <DialogTitle>챌린지 만들기</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 mt-2">
          <div className="flex items-center gap-2 relative">
            <Button
              variant="outline"
              size="sm"
              className="text-xl"
              onClick={() => setShowEmojiPicker((v) => !v)}
            >
              {emoji}
            </Button>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목"
            />
          </div>

          {showEmojiPicker && (
            <div className="absolute z-50">
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  setEmoji(emojiData.emoji);
                  setShowEmojiPicker(false);
                }}
              />
            </div>
          )}

          {type === "daily" ? (
            <>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start">
                      {dateRange?.from && dateRange?.to
                        ? `${format(dateRange.from, "yyyy-MM-dd")} - ${format(dateRange.to, "yyyy-MM-dd")}`
                        : "날짜 범위 선택"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => range && setDateRange(range)}
                      numberOfMonths={2}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>

                <div className="flex items-center space-x-2 ml-6">
                  <Checkbox
                    id="is-all-day"
                    checked={isEveryDay}
                    onCheckedChange={() => setIsEveryDay(!isEveryDay)}
                  />
                  <Label htmlFor="is-all-day">매일</Label>
                </div>
              </div>

              {!isEveryDay && (
                <div className="flex gap-2 flex-wrap ml-6">
                  <ToggleGroup
                    type="multiple"
                    variant="outline"
                    value={repeatDays ?? undefined}
                    onValueChange={(val) =>
                      setRepeatDays(val.length ? val : null)
                    }
                  >
                    {days.map((day) => (
                      <ToggleGroupItem
                        key={day.value}
                        value={day.value}
                        className="data-[state=on]:bg-slate-200"
                      >
                        {day.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <Input
                id="targetValue"
                type="number"
                value={targetValue ?? 100}
                onChange={(e) => setTargetValue(Number(e.target.value))}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={onSubmit}
            className="bg-slate-600 hover:bg-slate-500"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default UpdateGoalModal;
