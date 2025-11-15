import { Button } from "@/components/ui/button.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { useNavigate } from "react-router-dom";

const GoalPage = () => {
  const navigate = useNavigate();

  const goals = [
    {
      id: 1,
      emoji: "🚀",
      title: "목표 1",
    },
    {
      id: 2,
      emoji: "✈️",
      title: "목표 2",
    },
    {
      id: 3,
      emoji: "⛳️",
      title: "목표 3",
    },
    {
      id: 4,
      emoji: "🚀",
      title: "목표 4",
    },
    {
      id: 5,
      emoji: "✈️",
      title: "목표 5",
    },
    {
      id: 6,
      emoji: "⛳️",
      title: "목표 6",
    },
  ];

  const handleMoveGoal = (id: number) => {
    navigate(`/goal/${id}`);
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
              {goals.map((goal) => (
                <Card
                  key={goal.id}
                  className="w-[300px] h-[150px] hover:bg-gradient-to-br hover:from-white hover:to-slate-200"
                  onClick={() => {
                    handleMoveGoal(goal.id);
                  }}
                >
                  <CardHeader>
                    <CardTitle>
                      <div className="flex flex-row items-center gap-2 pb-2">
                        {goal.emoji}
                        <h1
                          className="flex-grow overflow-hidden whitespace-nowrap text-ellipsis leading-tight text-xl font-bold"
                          style={{ minWidth: 0 }}
                        >
                          {goal.title}
                        </h1>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Card Content</p>
                  </CardContent>
                  <CardFooter></CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};
export default GoalPage;
