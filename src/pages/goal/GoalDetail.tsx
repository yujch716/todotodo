import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { deleteGoalById, getGoalById } from "@/api/goal.ts";
import { useCallback, useEffect, useState } from "react";
import { Smile, Trash2 } from "lucide-react";
import DailyGoalCard from "@/pages/goal/DailyGoalCard.tsx";
import type { Goal, GoalLog } from "@/types/goal.ts";
import { useGoalStore } from "@/store/goalStore.ts";
import AlertConfirmModal from "@/components/AlertConfirmModal.tsx";
import GoalLogCard from "@/pages/goal/GoalLogCard.tsx";
import UpdateGoalModal from "@/pages/goal/UpdateGoalModal.tsx";
import MilestoneGoalCard from "@/pages/goal/MilestoneGoalCard.tsx";

interface GoalDetailProps {
  goalId: string | null;
}

const GoalDetail = ({
  goalId: propGoalId,
}: GoalDetailProps) => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const goalId = propGoalId ?? searchParams.get("id");

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const [goal, setGoal] = useState<Goal | null>(null);
  const [goalLogs, setGoalLogs] = useState<GoalLog[]>([]);

  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("");
  const [type, setType] = useState("");

  const refreshGoal = useGoalStore((state) => state.refreshGoal);
  const resetGoalRefresh = useGoalStore(
    (state) => state.resetGoalRefresh,
  );

  const triggerGoalRefresh = useGoalStore(
    (state) => state.triggerGoalRefresh,
  );

  const loadGoal = useCallback(async () => {
    if (!goalId) return;

    const goal = await getGoalById(goalId);

    setGoal(goal);
    setTitle(goal.title);
    setEmoji(goal.emoji);
    setType(goal.type);

    setGoalLogs(goal.goal_log ?? []);
  }, [goalId]);

  useEffect(() => {
    loadGoal();
  }, [loadGoal]);

  useEffect(() => {
    if (refreshGoal) {
      loadGoal();
      resetGoalRefresh();
    }
  }, [refreshGoal, resetGoalRefresh, loadGoal]);

  const handleDelete = async () => {
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!goalId) return;
    setIsAlertOpen(false);

    await deleteGoalById(goalId);

    triggerGoalRefresh();

    navigate("/goal");
  };

  if (!goalId || !goal) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <Smile />
      </div>
    );
  }

  return (
    <>
      <Card className="flex flex-col h-full w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            <div>
              {emoji} {title}
            </div>
            <div className="flex flex-row items-center gap-2">
              <UpdateGoalModal goal={goal} />
              <div
                className="ml-auto cursor-pointer hover:text-red-600"
                onClick={handleDelete}
              >
                <Trash2 />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col h-full w-full overflow-hidden gap-6">
          {type === "daily" ? (
            <DailyGoalCard goal={goal} />
          ) : (
            <>
              <MilestoneGoalCard goal={goal} />
            </>
          )}

          <GoalLogCard type={goal.type} logs={goalLogs} />
        </CardContent>
      </Card>

      <AlertConfirmModal
        open={isAlertOpen}
        message="이 챌린지를 삭제하시겠습니까?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsAlertOpen(false)}
      />
    </>
  );
};
export default GoalDetail;
