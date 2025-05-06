import { Button } from "../ui/button.tsx";
import type { Checklist } from "../../types/checklist.ts";
interface Props {
  checklists: Checklist[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAddChecklist: (title: string) => void;
}

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
    <div className="border-r w-full sm:w-64 bg-slate-600 text-white flex flex-col">
      <div className="p-1">
        <Button
          onClick={handleAddChecklist}
          variant="ghost"
          className="w-full justify-center bg-slate-800 hover:bg-slate-700 text-white hover:text-white font-semibold py-2 rounded-lg border border-transparent"
        >
          + 체크리스트 추가
        </Button>
      </div>

      {checklists.map((list) => (
        <Button
          key={list.id}
          variant={list.id === selectedId ? "default" : "ghost"}
          className={`w-full justify-start rounded-none ${
            list.id === selectedId ? "bg-slate-400" : ""
          }`}
          onClick={() => onSelect(list.id)}
        >
          {list.title}
        </Button>
      ))}
    </div>
  );
}
