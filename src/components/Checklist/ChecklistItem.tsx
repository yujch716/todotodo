import { Checkbox } from "../ui/checkbox.tsx";
import type { ChecklistItem as ChecklistItemType } from "../../types/checklist.ts";
import { useState, useRef, useEffect } from "react";
import { showCelebration } from "@/lib/effects";

interface Props {
  item: ChecklistItemType;
  onToggle: (id: number) => void;
  onUpdateTitle: (id: number, newTitle: string) => void;
  isEditing: boolean;
  setEditingItemId: (id: number | null) => void;
}

export default function ChecklistItem({
  item,
  onToggle,
  onUpdateTitle,
  isEditing,
  setEditingItemId,
}: Props) {
  const [title, setTitle] = useState(item.title);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleToggle = () => {
    if (!item.isChecked) {
      showCelebration();
    }
    onToggle(item.id);
  };

  const handleSaveTitle = () => {
    onUpdateTitle(item.id, title.trim());
    setEditingItemId(null);

    if (title.trim() !== "") {
      const nextId = item.id + 1;
      onUpdateTitle(nextId, "");
      setEditingItemId(nextId);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className="w-full">
      <div className="flex items-center space-x-2 w-full">
        <Checkbox checked={item.isChecked} onCheckedChange={handleToggle} />
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
            className="w-full border-b border-gray-300 focus:outline-none"
          />
        ) : (
          <span
            className={`w-full ${item.isChecked ? "line-through text-gray-400" : ""}`}
            onClick={() => setEditingItemId(item.id)}
          >
            {item.title}
          </span>
        )}
      </div>
    </div>
  );
}
