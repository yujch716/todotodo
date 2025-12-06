import { Trash2 } from "lucide-react";
import CreateGoalModal from "@/pages/goal/CreateGoalModal.tsx";
import {
  type Goal,
  type GoalGroup,
  type GoalStatusType,
  GoalStatus,
} from "@/types/goal.ts";
import GoalStatusPanel from "@/pages/goal/GoalStatusPanel.tsx";
import { useEffect, useState } from "react";
import { getGoalsByStatus, updateGoalStatus } from "@/api/goal.ts";
import { useParams } from "react-router-dom";
import { useGoalStore } from "@/store/goalStore.ts";
import { getGoalGroupById } from "@/api/goal-group.ts";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

type DragStartEvent = Parameters<
  NonNullable<React.ComponentProps<typeof DndContext>["onDragStart"]>
>[0];
type DragEndEvent = Parameters<
  NonNullable<React.ComponentProps<typeof DndContext>["onDragEnd"]>
>[0];

const GoalGroupDetailPage = () => {
  const { id } = useParams();

  const [goalGroup, setGoalGroup] = useState<GoalGroup | null>(null);
  const [notStartedGoals, setNotStartedGoals] = useState<Goal[]>([]);
  const [inProgressGoals, setInProgressGoals] = useState<Goal[]>([]);
  const [completedGoals, setCompletedGoals] = useState<Goal[]>([]);

  const refreshGoal = useGoalStore((state) => state.refreshGoal);
  const resetGoalRefresh = useGoalStore((state) => state.resetGoalRefresh);
  const triggerGoalRefresh = useGoalStore((state) => state.triggerGoalRefresh);

  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  if (!id) {
    return <div>잘못된 접근입니다.</div>;
  }

  const loadGoalGroup = async () => {
    const goalGroup = await getGoalGroupById(id);
    setGoalGroup(goalGroup);
  };

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
  }, [id]);

  useEffect(() => {
    if (refreshGoal) {
      loadGoals();
      resetGoalRefresh();
    }
  }, [refreshGoal, resetGoalRefresh]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const goalId = active.id as string;

    const allGoals = [
      ...notStartedGoals,
      ...inProgressGoals,
      ...completedGoals,
    ];
    const goal = allGoals.find((g) => g.id === goalId);
    setActiveGoal(goal || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveGoal(null);

    if (!over || !id) return;

    const goalId = active.id as string;
    const newStatus = over.id as GoalStatusType;

    const allGoals = [
      ...notStartedGoals,
      ...inProgressGoals,
      ...completedGoals,
    ];
    const goal = allGoals.find((g) => g.id === goalId);

    if (!goal) return;

    if (goal.status === newStatus) return;

    try {
      await updateGoalStatus(goalId, newStatus);
      triggerGoalRefresh();
    } catch (error) {
      console.error("Failed to update goal status:", error);
    }
  };

  if (!goalGroup) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col w-full h-full">
          <header className="flex w-full items-center justify-between mb-8">
            <h1
              className="overflow-hidden text-xl font-bold"
              style={{ minWidth: 0 }}
            >
              {goalGroup.name}
            </h1>
            <div className="flex flex-row gap-4">
              <CreateGoalModal groupId={id} />
              <div className="cursor-pointer hover:text-red-600">
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

        <DragOverlay>
          {activeGoal ? (
            <div className="bg-white border rounded-md p-4 shadow-lg opacity-90">
              <div className="flex items-center gap-2">
                <span className="text-xl">{activeGoal.emoji}</span>
                <span className="font-semibold">{activeGoal.title}</span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};
export default GoalGroupDetailPage;
