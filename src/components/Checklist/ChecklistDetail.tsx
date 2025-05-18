import type { Checklist } from "@/types/checklist.ts";
import ChecklistItem from "./ChecklistItem.tsx";
import { useEffect, useState } from "react";
import MemoEditor from "@/components/MemoEditor.tsx";
import { supabase } from "@/lib/supabaseClient.ts";
import { useSearchParams } from "react-router-dom";

export default function ChecklistDetail() {
  const [searchParams] = useSearchParams();
  const checklistId = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [items, setItems] = useState<Checklist["items"]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  useEffect(() => {
    if (!checklistId) return;

    const fetchChecklist = async () => {
      const { data, error } = await supabase
        .from("checklist")
        .select(
          `
          id,
          title,
          memo,
          items:checklist_item (
            id,
            content,
            is_checked
          )
        `,
        )
        .eq("id", checklistId)
        .single();

      if (error || !data) {
        console.error("Checklist 불러오기 오류:", error?.message);
        return;
      }

      setTitle(data.title);
      setMemo(data.memo);
      setItems(data.items);
    };

    fetchChecklist();
  }, [checklistId]);

  const handleTitleSave = () => {
    if (title.trim() !== "") {
      setIsEditingTitle(false);
      // 필요 시 서버로 업데이트 로직 추가
    }
  };

  const onUpdateItemTitle = (id: number, newTitle: string) => {
    setItems((prevItems) => {
      if (newTitle.trim() === "") return prevItems;

      const updatedItems = prevItems.map((item) =>
        item.id === id ? { ...item, title: newTitle } : item,
      );

      if (id === prevItems[prevItems.length - 1].id) {
        const newId = Date.now();
        updatedItems.push({ id: newId, content: "", is_checked: false });

        setTimeout(() => {
          setEditingItemId(newId);
        }, 0);
      }

      return updatedItems;
    });
  };

  const onToggleItem = (id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, is_checked: !item.is_checked } : item,
      ),
    );
  };

  const onUpdateMemo = (newMemo: string) => {
    setMemo(newMemo);
    // 서버 업데이트 로직 필요 시 여기에 추가
  };

  if (!checklistId) return <div className="p-8">체크리스트 ID가 없습니다.</div>;

  return (
    <div className="p-8 flex gap-8 flex-1 overflow-auto">
      <div className="w-1/2">
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

        <div className="mt-6 space-y-3">
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

      <div className="w-1/2">
        <MemoEditor memo={memo} onChange={onUpdateMemo} />
      </div>
    </div>
  );
}
