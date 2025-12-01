import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { createGoalLog } from "@/api/goal-log.ts";
import { useState } from "react";
import { useGoalStore } from "@/store/goalStore.ts";
import { format } from "date-fns";
import { updateGoalCompleted } from "@/api/goal.ts";
import { showCelebration } from "@/lib/effects";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalId: string;
  date: Date;
  totalDays: number;
  completedDays: number;
}

const CompleteGoalModal = ({
  open,
  onOpenChange,
  goalId,
  date,
  totalDays,
  completedDays,
}: ModalProps) => {
  const [memo, setMemo] = useState("");

  const triggerGoalRefresh = useGoalStore((state) => state.triggerGoalRefresh);

  const handleSubmit = async () => {
    await createGoalLog({
      goal_id: goalId,
      date: format(date, "yyyy-MM-dd"),
      memo,
    });

    if (completedDays + 1 === totalDays) {
      await updateGoalCompleted(goalId, { is_completed: true });
      showCelebration();
    }

    triggerGoalRefresh();

    setMemo("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md sm:mx-auto z-50">
        <DialogHeader>
          <DialogTitle>완료 처리</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="date">
              기록 <span className="text-slate-400">(선택사항)</span>
            </Label>
            <Input
              id="memo"
              value={memo}
              placeholder={"-"}
              onChange={(e) => setMemo(e.target.value)}
            ></Input>
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
export default CompleteGoalModal;
