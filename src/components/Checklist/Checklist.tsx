import { useSearchParams } from "react-router-dom";
import ChecklistPanel from "@/components/Checklist/ChecklistPanel.tsx";
import MemoPanel from "@/components/Checklist/MemoPanel.tsx";
import EmptyChecklist from "@/components/EmptyChecklist.tsx";

const Checklist = () => {
  const [searchParams] = useSearchParams();
  const checklistId = searchParams.get("id");

  if (!checklistId) {
    return (
      <div className="p-8">
        <EmptyChecklist />
      </div>
    );
  }

  return (
    <div className="p-8 flex gap-8 flex-1 overflow-auto">
      <div className="w-1/2">
        <ChecklistPanel />
      </div>
      <div className="w-1/2">
        <MemoPanel />
      </div>
    </div>
  );
};

export default Checklist;
