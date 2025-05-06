import { Button } from "../ui/button.tsx";
import type { Checklist } from "@/types/checklist.ts";
interface Props {
  checklists: Checklist[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAddChecklist: (title: string) => void;
}
import { Plus } from 'lucide-react';

export default function ChecklistSidebar({
  checklists,
  selectedId,
  onSelect,
  onAddChecklist,
}: Props) {
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}년 ${month}월 ${day}일`;
  };

  const handleAddChecklist = () => {
    const title = getTodayDate();
    onAddChecklist(title);
  };

  return (
    <div className="border-r w-full sm:w-64 bg-slate-800 text-white flex flex-col">
      <div className="p-4">
        <Button
          onClick={handleAddChecklist}
          variant="ghost"
          className="w-full justify-center bg-slate-600 hover:bg-slate-500 text-white hover:text-white font-semibold py-2 rounded-lg border border-transparent"
        >
          <Plus />
        </Button>
      </div>

      {checklists.map((list, index) => (
        <div key={list.id}>
          <Button
            className={`w-full justify-start rounded-none bg-slate-800
            ${list.id === selectedId ? "bg-slate-700 text-white" : ""}
            hover:bg-slate-700
          `}
            onClick={() => onSelect(list.id)}
          >
            {list.title}
          </Button>
          {index !== checklists.length - 1 && (
            <div className="h-px bg-white/20 mx-4" />
          )}
        </div>
      ))}
    </div>
  );
}
