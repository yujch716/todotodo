import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { LoaderCircle } from "lucide-react";

interface LoadingModalProps {
  open: boolean;
}

const LoadingModal = ({ open }: LoadingModalProps) => {
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogDescription className="flex flex-col items-center">
            <LoaderCircle className="animate-spin w-10 h-10" />
            <br />
            로딩 중입니다...
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingModal;
