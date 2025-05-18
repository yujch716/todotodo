import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabaseClient.ts";

export default function CreateChecklistModal() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [tags, setTags] = useState("");

  const handleSubmit = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("유저 정보를 가져오지 못했어요:", userError);
      return;
    }

    const formattedDate = date ? format(date, "yyyy-MM-dd") : null;

    const { data, error } = await supabase.from("checklist").insert([
      {
        title,
        date: formattedDate,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ""),
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error("CheckList 생성 오류:", error);
      return;
    }

    console.log("CheckList 생성 완료:", data);
    setTitle("");
    setDate(undefined);
    setTags("");
    setOpen(false);
  };

  const isFormValid = title.trim() !== "" && date !== undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Plus />
      </DialogTrigger>
      <DialogContent className="w-full max-w-md mx-4 sm:mx-auto z-50">
        <DialogHeader>
          <DialogTitle>체크리스트 만들기</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="grid gap-2">
          <div className="grid grid-cols-5 items-center gap-4">
            <Label htmlFor="title" className="text-left">
              제목
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-4"
              placeholder="예: 공부하기"
            />
          </div>
          <div className="grid grid-cols-5 items-center gap-4">
            <Label htmlFor="date" className="text-left">
              날짜
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full col-span-4 justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  {date ? format(date, "yyyy-MM-dd") : "날짜 선택"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-5 items-center gap-4">
            <Label htmlFor="tags" className="text-left">
              태그
            </Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="col-span-4"
              placeholder="쉼표로 구분 (예: 학교,중요)"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            만들기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
