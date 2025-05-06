import { useState } from "react";
import type { Checklist } from "../types/checklist";
import ChecklistSidebar from "../components/Checklist/ChecklistSidebar.tsx";
import ChecklistDetail from "../components/Checklist/ChecklistDetail.tsx";

const sampleChecklists: Checklist[] = [
  {
    id: 1,
    title: "2025년 05월 02일",
    items: [
      { id: 1, title: "청소하기", isChecked: false },
      { id: 2, title: "장보기", isChecked: false },
    ],
    memo: "메모 1",
  },
  {
    id: 2,
    title: "2025년 05월 03일",
    items: [
      { id: 3, title: "회의 준비", isChecked: true },
      { id: 4, title: "보고서 작성", isChecked: false },
    ],
    memo: "메모 2",
  },
];

export default function HomePage() {
  const [checklists, setChecklists] = useState<Checklist[]>(sampleChecklists);
  const [selectedChecklistId, setSelectedChecklistId] = useState<number | null>(
    sampleChecklists[0].id,
  );

  const selectedChecklist = checklists.find(
    (checklist) => checklist.id === selectedChecklistId,
  );

  const toggleItemChecked = (itemId: number) => {
    if (!selectedChecklist) return;

    const updatedItems = selectedChecklist.items.map((item) =>
      item.id === itemId ? { ...item, isChecked: !item.isChecked } : item,
    );

    const updatedChecklist = { ...selectedChecklist, items: updatedItems };
    const updatedChecklists = checklists.map((checklist) =>
      checklist.id === selectedChecklist.id ? updatedChecklist : checklist,
    );

    setChecklists(updatedChecklists);
  };

  const nextId = Math.max(0, ...checklists.map((c) => c.id)) + 1;
  const handleAddChecklist = (title: string) => {
    const newChecklist: Checklist = {
      id: nextId,
      title,
      items: [],
      memo: "",
    };

    setChecklists([...checklists, newChecklist]);
    setSelectedChecklistId(newChecklist.id);
  };

  const handleMemoChange = (newMemo: string) => {
    if (!selectedChecklist) return;

    const updatedChecklist = { ...selectedChecklist, memo: newMemo };
    const updatedChecklists = checklists.map((checklist) =>
      checklist.id === selectedChecklist.id ? updatedChecklist : checklist,
    );

    setChecklists(updatedChecklists);
  };

  return (
    <div className="flex h-screen">
      <ChecklistSidebar
        checklists={checklists}
        selectedId={selectedChecklistId}
        onSelect={setSelectedChecklistId}
        onAddChecklist={handleAddChecklist}
      />
      <div className="flex-1">
        {selectedChecklist && (
          <ChecklistDetail
            checklist={selectedChecklist}
            onToggleItem={toggleItemChecked}
            onUpdateMemo={handleMemoChange}
          />
        )}
      </div>
    </div>
  );
}
