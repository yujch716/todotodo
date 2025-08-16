import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { useSearchParams } from "react-router-dom";
import { getChallengeById } from "@/api/chanllege.ts";
import { useCallback, useEffect, useState } from "react";
import { Smile } from "lucide-react";
import Habit from "@/pages/challenge/Habit.tsx";
import type { Challenge } from "@/types/challenge.ts";

const ChallengeDetail = () => {
  const [searchParams] = useSearchParams();
  const challengeId = searchParams.get("id");

  const [challenge, setChallenge] = useState<Challenge | null>(null);

  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("");
  const [type, setType] = useState("");

  const loadChallenge = useCallback(async () => {
    if (!challengeId) return;

    const challenge = await getChallengeById(challengeId);

    setChallenge(challenge);
    setTitle(challenge.title);
    setEmoji(challenge.emoji);
    setType(challenge.type);
  }, [challengeId]);

  useEffect(() => {
    loadChallenge();
  }, [loadChallenge]);

  if (!challengeId || !challenge) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <Smile />
      </div>
    );
  }

  return (
    <>
      <Card className="flex flex-col h-full w-full p-4 m-4">
        <CardHeader>
          <CardTitle>
            {emoji} {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col overflow-hidden">
          {type === "habit" ? <Habit challenge={challenge} /> : <></>}
        </CardContent>
      </Card>
    </>
  );
};
export default ChallengeDetail;
