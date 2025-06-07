import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
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
import { CalendarIcon, Plus } from "lucide-react";
import { createChecklist } from "@/api/checklist.ts";
import { DialogClose } from "@radix-ui/react-dialog";
import { useChecklistSidebarStore } from "@/store/checklistSidebarStore.ts";
import { useChecklistCalendarStore } from "@/store/checklistCalendarStore.ts";

const CreateChecklistModal = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date>();

  const triggerSidebarRefresh = useChecklistSidebarStore(
    (state) => state.triggerSidebarRefresh,
  );
  const triggerCalendarRefresh = useChecklistCalendarStore(
    (state) => state.triggerCalendarRefresh,
  );

  const handleSubmit = async () => {
    if (!date) return;

    await createChecklist(title, date);

    triggerSidebarRefresh();
    triggerCalendarRefresh();

    setTitle("");
    setDate(undefined);
    setOpen(false);
  };

  const isFormValid = title.trim() !== "" && date !== undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="flex items-center justify-center px-3 py-1.5 rounded-md border bg-sky-600 text-white hover:bg-sky-500">
          <Plus />
        </div>
      </DialogTrigger>

      <DialogContent className="w-full max-w-md sm:mx-auto z-50">
        <DialogHeader>
          <DialogTitle>체크리스트 만들기</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3 mb-1">
            <Label htmlFor="name-1">제목</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 공부하기"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="username-1">날짜</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(!date && "text-muted-foreground")}
                >
                  {date ? format(date, "yyyy-MM-dd") : "날짜 선택"}
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
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChecklistModal;
