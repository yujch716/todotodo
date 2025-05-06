import { Checkbox } from "../ui/checkbox.tsx";
import type { ChecklistItem as ChecklistItemType } from "../../types/checklist.ts";
import { useState, useRef, useEffect } from "react";
import {
  fireBubbles,
  fireConfetti,
  fireSparkles,
  getRandomEffect,
  getRandomMessage,
} from "@/lib/effects";

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
  const [showMessage, setShowMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleToggle = () => {
    if (!item.isChecked) {
      const randomEffect = getRandomEffect();
      if (randomEffect === "confetti") {
        fireConfetti();
      } else if (randomEffect === "bubbles") {
        fireBubbles();
      } else if (randomEffect === "sparkles") {
        fireSparkles();
      }

      const randomMessage = getRandomMessage();
      setShowMessage(randomMessage);
      setTimeout(() => {
        setShowMessage(null);
      }, 1600);
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

        {showMessage && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-black animate-pulse z-[9999] pointer-events-none">
            {showMessage}
          </div>
        )}
      </div>
    </div>
  );
}
