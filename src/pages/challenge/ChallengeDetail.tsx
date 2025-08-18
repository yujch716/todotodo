import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { deleteChallengeById, getChallengeById } from "@/api/chanllege.ts";
import { useCallback, useEffect, useState } from "react";
import { Smile, Trash2 } from "lucide-react";
import DailyChallengeCard from "@/pages/challenge/DailyChallengeCard.tsx";
import type { Challenge, ChallengeLog } from "@/types/challenge.ts";
import { useChallengeStore } from "@/store/challengeStore.ts";
import AlertConfirmModal from "@/components/AlertConfirmModal.tsx";
import ChallengeLogCard from "@/pages/challenge/ChallengeLogCard.tsx";
import GoalChallengeCard from "@/pages/challenge/GoalChallengeCard.tsx";
import UpdateChallengeModal from "@/pages/challenge/UpdateChallengeModal.tsx";

interface ChallengeDetailProps {
  challengeId: string | null;
}

const ChallengeDetail = ({
  challengeId: propChallengeId,
}: ChallengeDetailProps) => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const challengeId = propChallengeId ?? searchParams.get("id");

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [challengeLogs, setChallengeLogs] = useState<ChallengeLog[]>([]);

  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("");
  const [type, setType] = useState("");

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

    setChallengeLogs(challenge.challenge_log ?? []);
  }, [challengeId]);

  useEffect(() => {
    loadChallenge();
  }, [loadChallenge]);

  useEffect(() => {
    if (refreshChallenge) {
      loadChallenge();
      resetChallengeRefresh();
    }
  }, [refreshChallenge, resetChallengeRefresh, loadChallenge]);

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
            <div className="flex flex-row items-center gap-2">
              <UpdateChallengeModal challenge={challenge} />
              <div
                className="ml-auto cursor-pointer hover:text-red-600"
                onClick={handleDelete}
              >
                <Trash2 />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col h-full w-full overflow-hidden gap-6">
          {type === "daily" ? (
            <DailyChallengeCard challenge={challenge} />
          ) : (
            <>
              <GoalChallengeCard challenge={challenge} />
            </>
          )}

          <ChallengeLogCard type={challenge.type} logs={challengeLogs} />
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
