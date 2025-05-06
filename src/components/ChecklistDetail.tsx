import type { Checklist } from "../types/checklist";
import ChecklistItem from "./ChecklistItem";

interface Props {
  checklist: Checklist;
  onToggleItem: (id: number) => void;
}

export default function ChecklistDetail({ checklist, onToggleItem }: Props) {
  return (
    <div className="p-10 flex-1 overflow-auto">
      <h2 className="text-xl font-bold">{checklist.title}</h2>
      <div className="mt-6 space-y-3">
        {checklist.items.map((item) => (
          <ChecklistItem key={item.id} item={item} onToggle={onToggleItem} />
        ))}
      </div>
    </div>
  );
}
