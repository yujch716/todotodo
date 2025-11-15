import type { GoalItemStatusType } from "@/types/goal.ts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  status: GoalItemStatusType;
}

const GoalStatusPanel = ({ status }: Props) => {
  const titleMap = {
    notStarted: "예정",
    inProgress: "진행 중",
    done: "완료",
  } as const;

  return (
    <>
      <div className="flex flex-col w-full h-full bg-transparent text-card-foreground rounded-xl overflow-y-auto border shadow-sm">
        <div className="border-b p-4">
          <h2 className="text-sm font-semibold">{titleMap[status]}</h2>
        </div>
        <div className="flex flex-col p-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};
export default GoalStatusPanel;
