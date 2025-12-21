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
import { updateGoalGroup } from "@/api/goal-group.ts";
import { toast } from "sonner";
import { useGoalGroupStore } from "@/store/goalGroupStore.ts";
import { useState } from "react";

interface Props {
  id: string;
  initialName: string;
  onClose: () => void;
}

const UpdateGoalGroupModal = ({ id, initialName, onClose }: Props) => {
  const [groupName, setGroupName] = useState(initialName);

  const triggerGoalGroupRefresh = useGoalGroupStore(
    (state) => state.triggerGoalGroupRefresh,
  );

  const onSubmit = async () => {
    if (!groupName.trim()) {
      toast.error("그룸명을 입력하세요.");
      return;
    }

    await updateGoalGroup(id, groupName);

    triggerGoalGroupRefresh();

    toast.info("그룹이 수정되었습니다.");

    onClose();
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
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
        <DialogContent className="w-full max-w-md sm:mx-auto z-50">
          <DialogHeader>
            <DialogTitle>그룹 만들기</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Input
                id="name"
                value={groupName}
                placeholder="그룹명을 입력하세요"
                onChange={(e) => setGroupName(e.target.value)}
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
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
export default UpdateGoalGroupModal;
