import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { deleteChallengeById, getChallengeById } from "@/api/chanllege.ts";
import { useCallback, useEffect, useState } from "react";
import { CalendarIcon, Smile, Trash2 } from "lucide-react";
import Habit from "@/pages/challenge/Habit.tsx";
import type { Challenge } from "@/types/challenge.ts";
import { useChallengeStore } from "@/store/challengeStore.ts";
import AlertConfirmModal from "@/components/AlertConfirmModal.tsx";
import { formatDate } from "date-fns";

const ChallengeDetail = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const challengeId = searchParams.get("id");

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const [challenge, setChallenge] = useState<Challenge | null>(null);

  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("");
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const refreshChallenge = useChallengeStore((state) => state.refreshChallenge);
  const resetChallengeRefresh = useChallengeStore(
    (state) => state.resetChallengeRefresh,
  );

  const triggerChallengeRefresh = useChallengeStore(
    (state) => state.triggerChallengeRefresh,
  );

  const loadChallenge = useCallback(async () => {
    if (!challengeId) return;

    const challenge = await getChallengeById(challengeId);

    setChallenge(challenge);
    setTitle(challenge.title);
    setEmoji(challenge.emoji);
    setType(challenge.type);
    setStartDate(challenge.start_date);
    setEndDate(challenge.end_date);
  }, [challengeId]);

  useEffect(() => {
    loadChallenge();
  }, [loadChallenge]);

  useEffect(() => {
    if (refreshChallenge) {
      loadChallenge();
      resetChallengeRefresh();
    }
  }, [refreshChallenge, resetChallengeRefresh]);

  const handleDelete = async () => {
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!challengeId) return;
    setIsAlertOpen(false);

    await deleteChallengeById(challengeId);

    triggerChallengeRefresh();

    navigate("/challenge");
  };

  if (!challengeId || !challenge) {
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
            <div>
              <div
                className="ml-auto cursor-pointer hover:text-red-600"
                onClick={handleDelete}
              >
                <Trash2 />
              </div>
            </div>
          </CardTitle>
          <CardDescription className="pt-2 text-lg text-muted-foreground flex flex-row gap-2">
            <CalendarIcon />
            {formatDate(startDate!, "yyyy.MM.dd")} -{" "}
            {formatDate(endDate!, "yyyy.MM.dd")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col h-full w-full overflow-hidden">
          {type === "habit" ? <Habit challenge={challenge} /> : <></>}
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
export default ChallengeDetail;
