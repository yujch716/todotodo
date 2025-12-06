import { Trash2 } from "lucide-react";
import CreateGoalModal from "@/pages/goal/CreateGoalModal.tsx";
import {type Goal, type GoalGroup, GoalStatus} from "@/types/goal.ts";
import GoalStatusPanel from "@/pages/goal/GoalStatusPanel.tsx";
import { useEffect, useState } from "react";
import { getGoalsByStatus } from "@/api/goal.ts";
import { useParams } from "react-router-dom";
import {useGoalStore} from "@/store/goalStore.ts";
import {getGoalGroupById} from "@/api/goal-group.ts";

const GoalGroupDetail = () => {
  const { id } = useParams();

  const [goalGroup, setGoalGroup] = useState<GoalGroup | null>(null);
  const [notStartedGoals, setNotStartedGoals] = useState<Goal[]>([]);
  const [inProgressGoals, setInProgressGoals] = useState<Goal[]>([]);
  const [completedGoals, setCompletedGoals] = useState<Goal[]>([]);

  const refreshGoal = useGoalStore((state) => state.refreshGoal);
  const resetGoalRefresh = useGoalStore((state) => state.resetGoalRefresh);

  if (!id) {
    return <div>잘못된 접근입니다.</div>;
  }

  const loadGoalGroup = async () => {
    const goalGroup = await getGoalGroupById(id);
    setGoalGroup(goalGroup);
  }

  const loadGoals = async () => {
    const notStartedGoals = await getGoalsByStatus(id, GoalStatus.notStarted);
    const inProgressGoals = await getGoalsByStatus(id, GoalStatus.inProgress);
    const completedGoals = await getGoalsByStatus(id, GoalStatus.completed);

    setNotStartedGoals(notStartedGoals);
    setInProgressGoals(inProgressGoals);
    setCompletedGoals(completedGoals);
  };

  useEffect(() => {
    loadGoalGroup();
    loadGoals();
  }, []);

  useEffect(() => {
    if (refreshGoal) {
      loadGoals();
      resetGoalRefresh();
    }
  }, [refreshGoal, resetGoalRefresh]);

  if (!goalGroup) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      <div className="flex flex-col w-full h-full">
        <header className="flex w-full items-center justify-between mb-8">
          <h1
            className="overflow-hidden text-xl font-bold"
            style={{ minWidth: 0 }}
          >
            {goalGroup.name}
          </h1>
          <div className="flex flex-row gap-4">
            <CreateGoalModal groupId={id}/>
            <div className="ursor-pointer hover:text-red-600">
              <Trash2 />
            </div>
          </div>
        </header>

        <div className="flex flex-grow overflow-hidden gap-8">
          <div className="w-1/3 h-full flex flex-col">
            <GoalStatusPanel
              status={GoalStatus.notStarted}
              goals={notStartedGoals}
            />
          </div>
          <div className="w-1/3 h-full flex flex-col">
            <GoalStatusPanel
              status={GoalStatus.inProgress}
              goals={inProgressGoals}
            />
          </div>
          <div className="w-1/3 h-full flex flex-col">
            <GoalStatusPanel
              status={GoalStatus.completed}
              goals={completedGoals}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default GoalGroupDetail;
