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
import { CalendarIcon, FilePlus, Flag } from "lucide-react";
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
import { createChallenge } from "@/api/chanllege.ts";
import EmojiPicker from "emoji-picker-react";
import { useChallengeStore } from "@/store/challengeStore.ts";

const days = [
  { label: "월", value: "mon" },
  { label: "화", value: "tue" },
  { label: "수", value: "wed" },
  { label: "목", value: "thu" },
  { label: "금", value: "fri" },
  { label: "토", value: "sat" },
  { label: "일", value: "sun" },
];

const CreateChallengeModal = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"habit" | "progress">("habit");

  const [emoji, setEmoji] = useState("✨");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [title, setTitle] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [isEveryDay, setIsEveryDay] = useState(true);
  const [repeatDays, setRepeatDays] = useState<string[]>([]);
  const [targetValue, setTargetValue] = useState<number | undefined>();

  const triggerChallengeRefresh = useChallengeStore(
    (state) => state.triggerChallengeRefresh,
  );

  const onSubmit = async () => {
    if (!title.trim()) {
      toast.error("제목을 입력하세요.");
      return;
    }
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("기간을 선택하세요.");
      return;
    }
    if (
      activeTab === "progress" &&
      (targetValue === undefined || targetValue <= 0)
    ) {
      toast.error("목표 수치를 1 이상 입력하세요.");
      return;
    }
    if (activeTab === "habit" && !isEveryDay && repeatDays.length === 0) {
      toast.error("반복 요일을 선택하세요.");
      return;
    }

    const repeat_type =
      activeTab === "habit" ? (isEveryDay ? "daily" : "weekly") : null;
    const repeat_days =
      activeTab === "habit" && !isEveryDay ? repeatDays : null;
    const target_value =
      activeTab === "progress" ? (targetValue ?? null) : null;

    await createChallenge(
      emoji,
      title,
      activeTab,
      dateRange.from,
      dateRange.to,
      repeat_type,
      repeat_days,
      target_value,
    );

    triggerChallengeRefresh();

    toast.info("챌린지가 생성되었습니다.");

    setOpen(false);
    setTitle("");
    setDateRange({ from: new Date(), to: new Date() });
    setIsEveryDay(true);
    setRepeatDays([]);
    setTargetValue(undefined);
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
          <DialogTitle>챌린지 만들기</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="habit"
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as "habit" | "progress")}
          className="flex flex-col w-full h-full"
        >
          <TabsList className="flex w-fit">
            <TabsTrigger value="habit">일일 챌린지</TabsTrigger>
            <TabsTrigger value="progress">누적 챌린지</TabsTrigger>
          </TabsList>
          <TabsContent value="habit">
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

          <TabsContent value="progress">
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

              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <Input
                  id="targetValue"
                  type="number"
                  value={targetValue ?? 100}
                  onChange={(e) => setTargetValue(Number(e.target.value))}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={onSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default CreateChallengeModal;
