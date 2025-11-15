import GoalStatusPanel from "@/pages/goal/GoalStatusPanel.tsx";
import { GoalItemStatus } from "@/types/goal.ts";
import { Trash2 } from "lucide-react";

const GoalDetail = () => {
  const goal = {
    title: "제목",
  };

  return (
    <>
      <div className="flex flex-col w-full h-full">
        <header className="flex w-full items-center justify-between mb-8">
          <h1
            className="overflow-hidden text-xl font-bold"
            style={{ minWidth: 0 }}
          >
            {goal.title}
          </h1>
          <div className="ursor-pointer hover:text-red-600">
            <Trash2 />
          </div>
        </header>

        <div className="flex flex-grow overflow-hidden gap-6">
          <div className="w-1/3 h-full flex flex-col">
            <GoalStatusPanel status={GoalItemStatus.notStarted} />
          </div>
          <div className="w-1/3 h-full flex flex-col">
            <GoalStatusPanel status={GoalItemStatus.inProgress} />
          </div>
          <div className="w-1/3 h-full flex flex-col">
            <GoalStatusPanel status={GoalItemStatus.done} />
          </div>
        </div>
      </div>
    </>
  );
};
export default GoalDetail;
