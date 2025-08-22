import type { Challenge, ChallengeLog } from "@/types/challenge.ts";
import { Card } from "@/components/ui/card.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import { Flag } from "lucide-react";
import { Label } from "@/components/ui/label.tsx";
import { useNavigate } from "react-router-dom";

interface DailyNoticeGoalChallengeProps {
  challenge: Challenge;
}

const DailyNoticeGoalChallengeCard = ({
  challenge,
}: DailyNoticeGoalChallengeProps) => {
  const navigate = useNavigate();

  const { id, emoji, title, challenge_log, target_value, is_completed } =
    challenge;
  const logs: ChallengeLog[] = challenge_log || [];
  const targetValue = target_value!;
  const completeValue = logs.reduce((acc, log) => acc + log.value, 0);
  const progressValue = Math.floor((completeValue / targetValue) * 100);

  const handelMoveChallenge = () => {
    navigate(`/challenge?id=${id}`);
  };

  return (
    <div>
      <Card
        key={id}
        className="p-3 w-[270px] cursor-pointer shadow-sm hover:shadow-md hover:bg-gradient-to-br hover:from-white hover:to-slate-100"
        onClick={() => {
          handelMoveChallenge();
        }}
      >
        <div className="flex flex-row items-center gap-2 pb-2">
          {emoji}
          <h1
            className="flex-grow overflow-hidden whitespace-nowrap text-ellipsis leading-tight text-base font-bold"
            style={{ minWidth: 0 }}
          >
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Progress value={progressValue} className="border-2" />
          <Label className="inline-flex items-center gap-1">
            <Flag
              className={`w-4 h-4 ${is_completed ? "text-sky-300" : "text-transparent"}`}
              stroke="black"
              fill={is_completed ? "currentColor" : "none"}
            />
            {targetValue}
          </Label>
        </div>
      </Card>
    </div>
  );
};
export default DailyNoticeGoalChallengeCard;
