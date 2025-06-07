import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";

interface AlertModalProps {
  open: boolean;
  message: string;
}

const AlertMoveModal = ({ open, message }: AlertModalProps) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate("/login");
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{message}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleConfirm}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlertMoveModal;
