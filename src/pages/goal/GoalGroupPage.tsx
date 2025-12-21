import { Button } from "@/components/ui/button.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Ellipsis, Folder } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { useNavigate } from "react-router-dom";
import { getGoalGroups } from "@/api/goal-group.ts";
import type { GoalGroup } from "@/types/goal.ts";
import { useCallback, useEffect, useState } from "react";
import CreateGoalGroupModal from "@/pages/goal/CreateGoalGroupModal.tsx";
import { useGoalGroupStore } from "@/store/goalGroupStore.ts";

const GoalGroupPage = () => {
  const navigate = useNavigate();

  const [goalGroups, setGoalGroups] = useState<GoalGroup[]>([]);

  const refreshGoalGroup = useGoalGroupStore((state) => state.refreshGoalGroup);
  const resetGoalGroupRefresh = useGoalGroupStore(
    (state) => state.resetGoalGroupRefresh,
  );

  const loadGoalGroups = useCallback(async () => {
    const goalGroups = await getGoalGroups();
    setGoalGroups(goalGroups);
  }, []);

  useEffect(() => {
    loadGoalGroups();
  }, [loadGoalGroups]);

  useEffect(() => {
    if (refreshGoalGroup) {
      loadGoalGroups();
      resetGoalGroupRefresh();
    }
  }, [refreshGoalGroup, resetGoalGroupRefresh, loadGoalGroups]);

  const handleMoveGoal = (id: string) => {
    navigate(`/goal-groups/${id}`);
  };

  return (
    <>
      <div className="flex flex-col w-full h-full">
        <header className="flex w-full items-center justify-end mb-4">
          <CreateGoalGroupModal />
        </header>

        <div className="flex flex-grow overflow-hidden">
          <ScrollArea className="h-full max-h-full w-full">
            <div className="flex flex-wrap gap-4">
              {goalGroups.map((group) => (
                <Card
                  key={group.id}
                  className="w-[150px] h-[150px] hover:bg-gradient-to-br hover:bg-slate-50 cursor-pointer"
                  onClick={() => {
                    handleMoveGoal(group.id);
                  }}
                >
                  <CardHeader className="flex flex-row justify-end px-1 pt-1 pb-0">
                    <Button variant="ghost" size="icon">
                      <Ellipsis />
                    </Button>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center gap-1 w-full">
                    <Folder
                      className="w-14 h-14"
                      style={{
                        stroke: "#fde68a",
                        fill: "#fde68a",
                      }}
                    />
                    <div className="w-full text-center truncate">
                      {group.name}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};
export default GoalGroupPage;
