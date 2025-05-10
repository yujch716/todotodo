import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function LoadingModal({ open }: { open: boolean }) {
  return (
    <Dialog open={open}>
      <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-800 border-t-transparent mb-4" />
          <p className="text-center text-slate-800 font-medium">
            로딩 중입니다...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
