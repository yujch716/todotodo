import type { GoalItemStatusType } from "@/types/goal.ts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateChallengeModal from "@/pages/challenge/CreateChallengeModal.tsx";
import {DailyLogStatusIcon} from "@/components/DailyLogStatusIcon.tsx";

interface Props {
  status: GoalItemStatusType;
}

const GoalStatusPanel = ({ status }: Props) => {
  const statusMap = {
    notStarted: { title: "예정", checkedCount: 0, totalCount: 0 },
    inProgress: { title: "진행 중", checkedCount: 1, totalCount: 2 },
    done: { title: "완료", checkedCount: 2, totalCount: 2 },
  } as const;

  const cards = [
    {
      id: 1,
      title: "Card Title",
    },
    {
      id: 2,
      title: "Card Title",
    },
    {
      id: 3,
      title: "Card Title",
    },
    {
      id: 4,
      title: "Card Title",
    },
    {
      id: 5,
      title: "Card Title",
    },
    {
      id: 6,
      title: "Card Title",
    },
  ]

  return (
    <>
      <div className="flex flex-col w-full h-full text-card-foreground rounded-xl border shadow-sm bg-slate-100 border-slate-50">
        <div className="flex flex-row border-b-2 p-4 justify-between border-slate-50">
          <div className="flex flex-row items-center gap-2">
            <DailyLogStatusIcon
              checkedCount={statusMap[status].checkedCount}
              totalCount={statusMap[status].totalCount}
              iconClassName="w-6 h-6"
            />
            <h2 className="text-sm font-semibold">{statusMap[status].title}</h2>
          </div>
          <CreateChallengeModal />
        </div>
        <div className="flex flex-col p-4 gap-4 overflow-y-auto">
          {cards.map((card) => (
            <Card key={card.id}>
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
            </Card>
          ))}

        </div>
      </div>
    </>
  );
};
export default GoalStatusPanel;
