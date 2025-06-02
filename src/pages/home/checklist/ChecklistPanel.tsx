import ChecklistItem from "./ChecklistItem.tsx";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EmptyChecklist from "@/pages/home/checklist/EmptyChecklist.tsx";
import type { ChecklistItemType } from "@/types/checklist.ts";
import { fetchChecklistById, updateChecklistTitle } from "@/api/checklist.ts";
import {
  createChecklistItem,
  deleteChecklistItem,
  fetchChecklistItems,
  toggleChecklistItem,
  updateChecklistItemContent,
} from "@/api/checklistItem.ts";

const ChecklistPanel = () => {
  const [searchParams] = useSearchParams();
  const checklistId = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [items, setItems] = useState<ChecklistItemType[]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  useEffect(() => {
    if (!checklistId) return;

    const fetchChecklistAndItems = async () => {
      const checklistData = await fetchChecklistById(checklistId);

      if (!checklistData) {
        return;
      }

      setTitle(checklistData.title);
      setDate(checklistData.date);

      const itemsData = await fetchChecklistItems(checklistId);

      if (!itemsData) {
        return;
      }

      setItems(itemsData);
    };

    fetchChecklistAndItems();
  }, [checklistId]);

  const handleTitleSave = async () => {
    const trimmedTitle = title.trim();

    if (trimmedTitle === "" || !checklistId) {
      setIsEditingTitle(false);
      return;
    }

    await updateChecklistTitle(checklistId, trimmedTitle);

    setIsEditingTitle(false);
  };

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
      <div className="text-sm text-gray-500 mb-1">
        {date ? String(date) : null}
      </div>

      <div className="pt-2 text-xl font-bold">
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

      <div
        className="mt-6 space-y-3 p-2 flex-1 overflow-auto min-h-full"
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
