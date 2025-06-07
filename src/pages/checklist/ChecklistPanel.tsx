import ChecklistItem from "./ChecklistItem.tsx";
import { useState } from "react";
import EmptyChecklist from "@/pages/checklist/EmptyChecklist.tsx";
import type { ChecklistItemType } from "@/types/checklist.ts";
import {
  createChecklistItem,
  deleteChecklistItem,
  toggleChecklistItem,
  updateChecklistItemContent,
} from "@/api/checklistItem.ts";

interface Props {
  checklistId: string;
  items: ChecklistItemType[];
  setItems: React.Dispatch<React.SetStateAction<ChecklistItemType[]>>;
}

const ChecklistPanel = ({ checklistId, items, setItems }: Props) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const onUpdateItemContent = async (id: string, newContent: string) => {
    if (newContent.trim() === "") {
      await deleteItem(id);
      return;
    }

    setItems((prevItems) => {
      if (newContent.trim() === "") return prevItems;

      return prevItems.map((item) =>
        item.id === id ? { ...item, content: newContent } : item,
      );
    });

    await updateChecklistItemContent(id, newContent);
  };

  const deleteItem = async (id: string) => {
    await deleteChecklistItem(id);

    setItems((prevItems) => {
      const index = prevItems.findIndex((item) => item.id === id);
      if (index === -1) return prevItems;

      const newItems = prevItems.filter((item) => item.id !== id);

      const focusId = index > 0 ? prevItems[index - 1].id : null;
      setEditingItemId(focusId);

      return newItems;
    });
  };

  const onToggleItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const newChecked = !item.is_checked;
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, is_checked: newChecked } : i)),
    );

    await toggleChecklistItem(id, newChecked);
  };

  const createEmptyItem = async () => {
    if (!checklistId) return;

    if (items.some((item) => item.content.trim() === "")) return;

    const newItem = await createChecklistItem(checklistId);

    if (!newItem) {
      return;
    }

    setItems((prev) => [...prev, newItem]);
    setEditingItemId(newItem.id);
  };

  const handlePanelClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("input") ||
      target.closest("textarea") ||
      target.closest("[data-checklist-item]")
    ) {
      return;
    }

    createEmptyItem();
  };

  if (!checklistId)
    return (
      <div className="p-8">
        <EmptyChecklist />
      </div>
    );

  return (
    <>
      <div
        className="space-y-3"
        onClick={handlePanelClick}
        style={{ minHeight: "100%" }}
      >
        {items.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            onToggle={onToggleItem}
            onUpdateContent={onUpdateItemContent}
            isEditing={editingItemId === item.id}
            setEditingItemId={setEditingItemId}
            onAddEmptyItem={createEmptyItem}
          />
        ))}
      </div>
    </>
  );
};

export default ChecklistPanel;
