import { Checkbox } from "@/components/ui/checkbox.tsx";
import { useState, useRef, useEffect } from "react";
import { showCelebration } from "@/lib/effects";
import type { ChecklistItemType } from "@/types/checklist.ts";
import { updateChecklistItemContent } from "@/api/checklistItem.ts";
import { Card } from "@/components/ui/card.tsx";

interface Props {
  item: ChecklistItemType;
  onToggle: (id: string) => void;
  onUpdateContent: (id: string, newContent: string) => void;
  isEditing: boolean;
  setEditingItemId: (id: string | null) => void;
  onAddEmptyItem: () => void;
}

const ChecklistItem = ({
  item,
  onToggle,
  onUpdateContent,
  isEditing,
  setEditingItemId,
  onAddEmptyItem,
}: Props) => {
  const [content, setContent] = useState(item.content);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleToggle = async () => {
    if (!item.is_checked) {
      showCelebration();
    }

    onToggle(item.id);
  };

  const handleSaveContent = async () => {
    const newContent = content.trim();

    if (newContent === "") {
      setEditingItemId(null);
      return;
    }

    await updateChecklistItemContent(item.id, newContent);

    onUpdateContent(item.id, newContent);
    setEditingItemId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (e.key === "Backspace" || e.key === "Delete") &&
      content.trim() === ""
    ) {
      e.preventDefault();
      onUpdateContent(item.id, "");
    }

    if (e.key === "Enter") {
      handleSaveContent();
      onAddEmptyItem();
      setEditingItemId(null);
    }
  };

  return (
    <Card className="w-full p-2" data-checklist-item>
      <div className="flex items-center gap-2">
        <Checkbox
          checked={item.is_checked}
          onCheckedChange={handleToggle}
          className=" shrink-0"
        />
        <div className="flex-grow">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onBlur={handleSaveContent}
              onKeyDown={handleKeyDown}
              className="w-full border-b border-gray-300 focus:outline-none text-sm leading-6"
            />
          ) : (
            <span
              onClick={() => setEditingItemId(item.id)}
              className={`inline-block w-full text-sm leading-6 cursor-text ${
                item.is_checked ? "line-through text-gray-400" : ""
              }`}
            >
              {item.content || "\u00A0"}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ChecklistItem;
