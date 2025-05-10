import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog.tsx";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function AlertModal({
  open,
  message,
}: {
  open: boolean;
  message: string;
}) {
  const navigate = useNavigate();
  const handleConfirm = () => {
    navigate("/login");
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{message}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={handleConfirm}
            className="bg-slate-800 hover:bg-slate-700"
          >
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
