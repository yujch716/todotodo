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
import { CalendarIcon, FilePlus, Flag, CircleHelp } from "lucide-react";
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import type { DateRange } from "react-day-picker";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Label } from "@/components/ui/label.tsx";
import { toast } from "sonner";
import { createGoal } from "@/api/goal.ts";
import EmojiPicker from "emoji-picker-react";
import { useGoalStore } from "@/store/goalStore.ts";
import { GoalType } from "@/types/goal.ts";

const days = [
  { label: "일", value: "sun" },
  { label: "월", value: "mon" },
  { label: "화", value: "tue" },
  { label: "수", value: "wed" },
  { label: "목", value: "thu" },
  { label: "금", value: "fri" },
  { label: "토", value: "sat" },
];

interface Props {
  groupId: string;
}

const CreateGoalModal = ({ groupId }: Props) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<GoalType>(GoalType.routine);

  const [emoji, setEmoji] = useState("✨");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [title, setTitle] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [isEveryDay, setIsEveryDay] = useState(true);
  const [repeatDays, setRepeatDays] = useState<string[]>([]);
  const [targetValue, setTargetValue] = useState<string>("100");

  const triggerGoalRefresh = useGoalStore((state) => state.triggerGoalRefresh);

  const onSubmit = async () => {
    if (!title.trim()) {
      toast.error("제목을 입력하세요.");
      return;
    }
    if (
      activeTab === GoalType.routine &&
      (!dateRange?.from || !dateRange?.to)
    ) {
      toast.error("기간을 선택하세요.");
      return;
    }
    if (activeTab === GoalType.progress && targetValue === undefined) {
      toast.error("목표 수치를 1 이상 입력하세요.");
      return;
    }
    if (
      activeTab === GoalType.routine &&
      !isEveryDay &&
      repeatDays.length === 0
    ) {
      toast.error("반복 요일을 선택하세요.");
      return;
    }

    const repeat_days =
      activeTab === GoalType.routine
        ? isEveryDay
          ? days.map((d) => d.value)
          : repeatDays
        : null;

    const goalPayload = {
      group_id: groupId,
      emoji,
      title,
      type: activeTab,
      ...(activeTab === GoalType.routine && {
        start_date: dateRange?.from
          ? format(dateRange.from, "yyyy-MM-dd")
          : undefined,
        end_date: dateRange?.to
          ? format(dateRange.to, "yyyy-MM-dd")
          : undefined,
        repeat_days,
      }),
      ...(activeTab === GoalType.progress && {
        target_value: Number(targetValue),
      }),
    };

    await createGoal(goalPayload);

    triggerGoalRefresh();

    toast.info("챌린지가 생성되었습니다.");

    setOpen(false);
    setTitle("");
    setDateRange({ from: new Date(), to: new Date() });
    setIsEveryDay(true);
    setRepeatDays([]);
    setTargetValue("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer hover:text-blue-500">
          <FilePlus />
        </div>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md sm:mx-auto z-50">
        <DialogHeader>
          <DialogTitle>목표 만들기</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="routine"
          value={activeTab}
          onValueChange={(val) =>
            setActiveTab(val as "routine" | "progress" | "checklist")
          }
          className="flex flex-col w-full h-full"
        >
          <div className="flex flex-row gap-3 item-center">
            <TabsList className="flex w-fit">
              <TabsTrigger value={GoalType.routine}>습관형</TabsTrigger>
              <TabsTrigger value={GoalType.progress}>달성형</TabsTrigger>
              <TabsTrigger value={GoalType.checklist}>완료형</TabsTrigger>
            </TabsList>

            <Popover>
              <PopoverTrigger>
                <CircleHelp className="w-4 h-4 text-muted-foreground" />
              </PopoverTrigger>
              <PopoverContent side="top" className="p-3 w-auto">
                {activeTab === GoalType.routine ? (
                  <p>예시: 🏃‍♂️매주 월,수, 금 운동하기</p>
                ) : activeTab === GoalType.progress ? (
                  <p>예시: 📖 250p 책 읽기</p>
                ) : (
                  <p>예시: 📚독서 리스트</p>
                )}
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center mt-4 gap-2 relative">
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

          <TabsContent value={GoalType.routine}>
            <div className="grid gap-4 mt-2">
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
                      onSelect={setDateRange}
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
                    value={repeatDays}
                    onValueChange={setRepeatDays}
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
            </div>
          </TabsContent>

          <TabsContent value={GoalType.progress}>
            <div className="grid gap-4 mt-2">
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <Input
                  id="targetValue"
                  type="number"
                  value={targetValue ?? 100}
                  onChange={(e) => setTargetValue(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value={GoalType.checklist}>
            <div className="grid gap-4 mt-2">
              <div className="flex items-center gap-2"></div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <Button
            onClick={onSubmit}
            className="bg-slate-600 hover:bg-slate-500"
          >
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default CreateGoalModal;
