import { Checkbox } from "../ui/checkbox.tsx";
import type { ChecklistItem as ChecklistItemType } from "../../types/checklist.ts";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient.ts";
import { showCelebration } from "@/lib/effects";

interface Props {
  item: ChecklistItemType;
  onToggle: (id: string) => void;
  onUpdateContent: (id: string, newContent: string) => void;
  isEditing: boolean;
  setEditingItemId: (id: string | null) => void;
  onAddEmptyItem: () => void;
}

export default function ChecklistItem({
  item,
  onToggle,
  onUpdateContent,
  isEditing,
  setEditingItemId,
  onAddEmptyItem,
}: Props) {
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
    const trimmed = content.trim();

    if (trimmed === "") {
      setEditingItemId(null);
      return;
    }

    const { error } = await supabase
      .from("checklist_item")
      .update({ content: trimmed })
      .eq("id", item.id);

    if (error) {
      console.error("항목 내용 업데이트 실패:", error);
      return;
    }

    onUpdateContent(item.id, trimmed);
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
    <div data-checklist-item="" className="w-full flex items-center space-x-2">
      <div className="flex-shrink-0 flex-grow-0 basis-1/11">
        <Checkbox checked={item.is_checked} onCheckedChange={handleToggle} />
      </div>
      <div className="flex-grow basis-10/11">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleSaveContent}
            onKeyDown={handleKeyDown}
            className="w-full border-b border-gray-300 focus:outline-none"
          />
        ) : (
          <span
            className={`w-full inline-block min-h-[1.25rem] ${item.is_checked ? "line-through text-gray-400" : ""}`}
            onClick={() => setEditingItemId(item.id)}
          >
            {item.content || "\u00A0"}
          </span>
        )}
      </div>
    </div>
  );
}
