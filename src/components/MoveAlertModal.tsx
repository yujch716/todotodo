import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";

export default function MoveAlertModal({
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
      <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <p className="text-center text-slate-800 font-medium">{message}</p>
        <div className="flex justify-center">
          <Button
            onClick={handleConfirm}
            className="bg-slate-800 hover:bg-slate-700"
          >
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
