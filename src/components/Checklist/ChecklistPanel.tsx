import type { Checklist } from "@/types/checklist.ts";
import ChecklistItem from "./ChecklistItem.tsx";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient.ts";
import { useSearchParams } from "react-router-dom";

export default function ChecklistPanel() {
  const [searchParams] = useSearchParams();
  const checklistId = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [items, setItems] = useState<Checklist["items"]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  useEffect(() => {
    if (!checklistId) return;

    const fetchChecklistAndItems = async () => {
      const { data: checklistData, error: checklistError } = await supabase
        .from("checklist")
        .select("id, title, memo")
        .eq("id", checklistId)
        .single();

      if (checklistError || !checklistData) {
        console.error("Checklist 불러오기 오류:", checklistError?.message);
        return;
      }

      setTitle(checklistData.title);

      const { data: itemsData, error: itemsError } = await supabase
        .from("checklist_item")
        .select("id, content, is_checked, created_at")
        .eq("checklist_id", checklistId)
        .order("created_at", { ascending: true });

      if (itemsError || !itemsData) {
        console.error("Checklist 아이템 불러오기 오류:", itemsError?.message);
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

    const { error } = await supabase
      .from("checklist")
      .update({ title: trimmedTitle })
      .eq("id", checklistId);

    if (error) {
      console.error("제목 업데이트 실패:", error.message);
      return;
    }

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

    const { error } = await supabase
      .from("checklist_item")
      .update({ content: newContent })
      .eq("id", id);

    if (error) {
      console.error("아이템 업데이트 실패:", error.message);
    }
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase
      .from("checklist_item")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("아이템 삭제 실패:", error.message);
      return;
    }

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

    const { error } = await supabase
      .from("checklist_item")
      .update({ is_checked: newChecked })
      .eq("id", id);

    if (error) {
      console.error("체크 상태 업데이트 실패:", error.message);
    }
  };

  const createEmptyItem = async () => {
    if (!checklistId) return;

    if (items.some((item) => item.content.trim() === "")) return;

    const { data, error } = await supabase
      .from("checklist_item")
      .insert({ checklist_id: checklistId, content: "", is_checked: false })
      .select()
      .single();

    if (error || !data) {
      console.error("새 항목 생성 실패:", error?.message);
      return;
    }

    setItems((prev) => [...prev, data]);
    setEditingItemId(data.id);
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

  if (!checklistId) return <div className="p-8">체크리스트 ID가 없습니다.</div>;

  return (
    <>
      <div className="text-xl font-bold">
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
}
