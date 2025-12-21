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
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { createGoalGroup } from "@/api/goal-group.ts";
import { useState } from "react";
import { toast } from "sonner";
import { useGoalGroupStore } from "@/store/goalGroupStore.ts";

const CreateGoalGroupModal = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const triggerGoalGroupRefresh = useGoalGroupStore(
    (state) => state.triggerGoalGroupRefresh,
  );

  const onSubmit = async () => {
    if (!name.trim()) {
      toast.error("그룸명을 입력하세요.");
      return;
    }

    await createGoalGroup(name);

    triggerGoalGroupRefresh();

    toast.info("그룹이 생성되었습니다.");

    setName("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-slate-600 hover:bg-slate-500 text-white hover:text-white"
          >
            <Plus />
            만들기
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>그룹 만들기</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Input
                id="name"
                value={name}
                placeholder="그룹명을 입력하세요"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={onSubmit}
              className="bg-slate-600 hover:bg-slate-500"
            >
              만들기
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
export default CreateGoalGroupModal;
