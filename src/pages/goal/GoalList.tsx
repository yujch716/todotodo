import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Card } from "@/components/ui/card.tsx";
import { deleteGoalByIds, getGoals } from "@/api/goal.ts";
import { useEffect, useState } from "react";
import type { Goal } from "@/types/goal.ts";
import { format } from "date-fns";
import { DailyLogStatusIcon } from "@/components/DailyLogStatusIcon.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator.tsx";
import { useGoalStore } from "@/store/goalStore.ts";
import AlertConfirmModal from "@/components/AlertConfirmModal.tsx";

interface GoalListProps {
  onCardClick?: (id: string) => void;
}

const GoalList = ({ onCardClick }: GoalListProps) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [allChecked, setAllChecked] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const refreshGoal = useGoalStore((state) => state.refreshGoal);
  const resetGoalRefresh = useGoalStore((state) => state.resetGoalRefresh);

  const triggerGoalRefresh = useGoalStore((state) => state.triggerGoalRefresh);

  const loadGoals = async () => {
    const goals = await getGoals();
    setGoals(goals);
  };

  const handleAllCheck = (checked: boolean) => {
    setAllChecked(checked);
    if (checked) {
      setSelectedGoals(goals.map((c) => c.id));
    } else {
      setSelectedGoals([]);
    }
  };

  const handleIndividualCheck = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedGoals((prev) => [...prev, id]);
    } else {
      setSelectedGoals((prev) => prev.filter((cId) => cId !== id));
    }
  };

  const handleCardClick = (id: string) => {
    setSelectedId(id);
    if (onCardClick) onCardClick(id);
  };

  useEffect(() => {
    loadGoals();
  }, []);

  useEffect(() => {
    if (refreshGoal) {
      loadGoals();
      resetGoalRefresh();
    }
  }, [refreshGoal, resetGoalRefresh]);

  const handleDelete = async () => {
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteAlertOpen(false);

    await deleteGoalByIds(selectedGoals);

    triggerGoalRefresh();
  };

  return (
    <>
      <div className="flex flex-col h-full w-full overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <Checkbox
            checked={allChecked}
            onCheckedChange={(checked) => handleAllCheck(!!checked)}
          />
          <div className="flex flex-row items-center gap-3">
            {selectedGoals.length > 0 && (
              <div
                className="ml-auto cursor-pointer hover:text-red-600"
                onClick={handleDelete}
              >
                <Trash2 />
              </div>
            )}
          </div>
        </div>
        <Separator />
        <ScrollArea className="flex flex-col h-full max-h-full p-4 overflow-hidden">
          {goals.map((goal) => (
            <div key={goal.id} className="flex items-center group">
              <div
                className={`
                mr-2 flex items-center 
                transition-opacity duration-200 
                ${selectedGoals.includes(goal.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
              `}
              >
                <Checkbox
                  value={goal.id.toString()}
                  checked={selectedGoals.includes(goal.id)}
                  onCheckedChange={(checked) =>
                    handleIndividualCheck(goal.id, !!checked)
                  }
                />
              </div>

              <Card
                className={`
                flex flex-row w-full items-center p-3 my-1 shadow cursor-pointer flex-1 overflow-hidden
                hover:bg-gradient-to-br hover:from-white hover:to-slate-200
                ${selectedId === goal.id ? "bg-gradient-to-br from-white to-slate-200" : ""}
              `}
                onClick={() => handleCardClick(goal.id)}
              >
                <div className="mr-3">{goal.emoji}</div>
                <div className="flex flex-col gap-1 flex-1 w-0 overflow-hidden">
                  <span
                    className="overflow-hidden whitespace-nowrap text-ellipsis block leading-tight"
                    style={{ maxWidth: "100%" }}
                  >
                    {goal.title}
                  </span>
                  <span className="text-sm text-gray-400">
                    {format(goal.created_at, "yyyy.MM.dd")}
                  </span>
                </div>
                {goal.status && (
                  <div className="ml-auto">
                    <DailyLogStatusIcon
                      checkedCount={1}
                      totalCount={1}
                      iconClassName="w-5 h-5"
                    />
                  </div>
                )}
              </Card>
            </div>
          ))}
        </ScrollArea>
      </div>

      <AlertConfirmModal
        open={isDeleteAlertOpen}
        message="이 챌린지를 모두 삭제하시겠습니까?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteAlertOpen(false)}
      />
    </>
  );
};
export default GoalList;
