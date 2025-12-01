import { Button } from "@/components/ui/button.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Ellipsis, Folder, Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { useNavigate } from "react-router-dom";
import { getGoalGroups } from "@/api/goal-group.ts";
import type { GoalGroup } from "@/types/goal.ts";
import { useEffect, useState } from "react";

const GoalGroupPage = () => {
  const navigate = useNavigate();

  const [goalGroups, setGoalGroups] = useState<GoalGroup[]>([]);

  const loadGoalGroups = async () => {
    const goalGroups = await getGoalGroups();
    setGoalGroups(goalGroups);
  };

  useEffect(() => {
    loadGoalGroups();
  }, []);

  const handleMoveGoal = (id: string) => {
    navigate(`/goal-groups/${id}`);
  };

  return (
    <>
      <div className="flex flex-col w-full h-full">
        <header className="flex w-full items-center justify-end mb-4">
          <Button variant="outline" className="bg-slate-500 text-white">
            <Plus />
            만들기
          </Button>
        </header>

        <div className="flex flex-grow overflow-hidden">
          <ScrollArea className="h-full max-h-full w-full">
            <div className="flex flex-wrap gap-4">
              {goalGroups.map((group) => (
                <Card
                  key={group.id}
                  className="w-[200px] h-[200px] hover:bg-gradient-to-br hover:bg-slate-50 cursor-pointer"
                  onClick={() => {
                    handleMoveGoal(group.id);
                  }}
                >
                  <CardHeader className="flex flex-row justify-end p-4 pb-2">
                    <Button variant="ghost" size="icon">
                      <Ellipsis />
                    </Button>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center gap-2 w-full">
                    <Folder
                      className="w-16 h-16"
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
