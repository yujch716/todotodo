import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Card } from "@/components/ui/card.tsx";
import { getChallenges } from "@/api/chanllege.ts";
import { useEffect, useState } from "react";
import type { Challenge } from "@/types/challenge.ts";
import { format } from "date-fns";
import { DailyLogStatusIcon } from "@/components/DailyLogStatusIcon.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Trash2 } from "lucide-react";
import CreateChallengeModal from "@/pages/challenge/CreateChallengeModal.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { useChallengeStore } from "@/store/challengeStore.ts";
import { useNavigate, useSearchParams } from "react-router-dom";

const ChallengeList = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [allChecked, setAllChecked] = useState(false);

  const refreshChallenge = useChallengeStore((state) => state.refreshChallenge);
  const resetChallengeRefresh = useChallengeStore(
    (state) => state.resetChallengeRefresh,
  );

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedIdFromUrl = searchParams.get("id");

  const loadChallenges = async () => {
    const challenges = await getChallenges();
    setChallenges(challenges);
  };

  const handleAllCheck = (checked: boolean) => {
    setAllChecked(checked);
    if (checked) {
      setSelectedChallenges(challenges.map((c) => c.id));
    } else {
      setSelectedChallenges([]);
    }
  };

  const handleIndividualCheck = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedChallenges((prev) => [...prev, id]);
    } else {
      setSelectedChallenges((prev) => prev.filter((cId) => cId !== id));
    }
  };

  const handleCardClick = (id: string) => {
    navigate(`/challenge?id=${id}`); // URL 변경
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  useEffect(() => {
    if (refreshChallenge) {
      loadChallenges();
      resetChallengeRefresh();
    }
  }, [refreshChallenge, resetChallengeRefresh]);

  return (
    <>
      <div className="m-3 flex items-center justify-between">
        <Checkbox
          checked={allChecked}
          onCheckedChange={(checked) => handleAllCheck(!!checked)}
        />
        <div className="flex flex-row items-center gap-3">
          <div className="ml-auto cursor-pointer hover:text-red-600">
            <Trash2 />
          </div>
          <CreateChallengeModal />
        </div>
      </div>
      <Separator />
      <ScrollArea className="flex flex-col h-full max-h-full p-3">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="flex items-center group">
            <div
              className={`
                mr-2 flex items-center 
                transition-opacity duration-200 
                ${selectedChallenges.includes(challenge.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
              `}
            >
              <Checkbox
                value={challenge.id.toString()}
                checked={selectedChallenges.includes(challenge.id)}
                onCheckedChange={(checked) =>
                  handleIndividualCheck(challenge.id, !!checked)
                }
              />
            </div>

            <Card
              className={`
                flex flex-row items-center p-3 my-1 shadow cursor-pointer flex-1
                hover:bg-slate-100
                ${selectedIdFromUrl === challenge.id ? "bg-slate-100" : ""}
              `}
              onClick={() => handleCardClick(challenge.id)}
            >
              <div className="mr-3">{challenge.emoji}</div>
              <div className="flex flex-col gap-1">
                <span
                  className="overflow-hidden whitespace-nowrap text-ellipsis block leading-tight"
                  style={{ maxWidth: "100%" }}
                >
                  {challenge.title}
                </span>
                <span className="text-sm text-gray-400">
                  {format(challenge.created_at, "yyyy.MM.dd")}
                </span>
              </div>
              <div className="ml-auto">
                <DailyLogStatusIcon
                  checkedCount={challenge.is_completed ? 1 : 0}
                  totalCount={1}
                  iconClassName="w-5 h-5"
                />
              </div>
            </Card>
          </div>
        ))}
      </ScrollArea>
    </>
  );
};
export default ChallengeList;
