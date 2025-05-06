import type { Checklist } from "@/types/checklist.ts";
import ChecklistItem from "./ChecklistItem.tsx";
import { useEffect, useState } from "react";

interface Props {
  checklist: Checklist;
  onToggleItem: (id: number) => void;
}

export default function ChecklistDetail({ checklist, onToggleItem }: Props) {
  const [title, setTitle] = useState(checklist.title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  useEffect(() => {
    setTitle(checklist.title);
  }, [checklist]);

  const handleTitleSave = () => {
    if (title.trim() !== "") {
      setIsEditingTitle(false);
    }
  };

  const [items, setItems] = useState(checklist.items);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  useEffect(() => {
    setItems(checklist.items);
  }, [checklist]);

  const onUpdateItemTitle = (id: number, newTitle: string) => {
    setItems((prevItems) => {
      if (newTitle.trim() === "") return prevItems;

      const updatedItems = prevItems.map((item) =>
        item.id === id ? { ...item, title: newTitle } : item,
      );

      if (id === prevItems[prevItems.length - 1].id) {
        const newId = Date.now();
        updatedItems.push({ id: newId, title: "", isChecked: false });

        setTimeout(() => {
          setEditingItemId(newId);
        }, 0);
      }

      return updatedItems;
    });
  };

  return (
    <div className="p-10 flex-1 overflow-auto">
      <div className="w-1/3 text-xl font-bold">
        {isEditingTitle ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
            className="w-full border-b border-gray-300 focus:outline-none"
            autoFocus
          />
        ) : (
          <h2
            className="w-full cursor-pointer"
            onClick={() => setIsEditingTitle(true)}
          >
            {title}
          </h2>
        )}
      </div>
      <div className="mt-6 space-y-3 w-1/3">
        {items.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            onToggle={onToggleItem}
            onUpdateTitle={onUpdateItemTitle}
            isEditing={editingItemId === item.id}
            setEditingItemId={setEditingItemId}
          />
        ))}
      </div>
    </div>
  );
}
