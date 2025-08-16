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
import { createChallengeLog } from "@/api/challenge-log.ts";
import { useState } from "react";
import { useChallengeStore } from "@/store/challengeStore.ts";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challengeId: string;
  date: Date;
}

const ChallengeCompleteModal = ({
  open,
  onOpenChange,
  challengeId,
  date,
}: ModalProps) => {
  const [memo, setMemo] = useState("");

  const triggerChallengeRefresh = useChallengeStore(
    (state) => state.triggerChallengeRefresh,
  );

  const handleSubmit = async () => {
    await createChallengeLog(challengeId, date, memo, null);

    triggerChallengeRefresh();

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
            <Label htmlFor="date">기록</Label>
            <Input
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            ></Input>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default ChallengeCompleteModal;
