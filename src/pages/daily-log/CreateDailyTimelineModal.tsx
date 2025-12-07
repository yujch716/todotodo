import {
  Dialog, DialogClose, DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog.tsx";
import {SquarePlus} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {useState} from "react";
import {Input} from "@/components/ui/input.tsx";

const CreateDailyTimelineModal = () => {
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {

  }

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
            <Label htmlFor="start-time" className="w-24">시작 시간</Label>
            <Input type="time" id="start-time" step="1" defaultValue="09:00:00"/>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="end-time" className="w-24">종료 시간</Label>
            <Input type="time" id="end-time" step="1" defaultValue="10:00:00"/>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="timeline-content" className="w-24">내용</Label>
            <Input id="title" placeholder="일정 내용을 입력하세요"/>
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