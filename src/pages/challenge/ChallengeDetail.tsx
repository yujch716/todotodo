import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import { useSearchParams } from "react-router-dom";
import { getChallengeById } from "@/api/chanllege.ts";
import { useCallback, useEffect, useState } from "react";
import { Smile } from "lucide-react";

const ChallengeDetail = () => {
  const [searchParams] = useSearchParams();
  const challengeId = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("");

  const loadChallenge = useCallback(async () => {
    if (!challengeId) return;

    const challenge = await getChallengeById(challengeId);

    setTitle(challenge.title);
    setEmoji(challenge.emoji);
  }, [challengeId]);

  useEffect(() => {
    loadChallenge();
  }, [loadChallenge]);

  if (!challengeId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <Smile />
      </div>
    );
  }

  return (
    <>
      <Card className="flex flex-col h-full p-4 m-4">
        <CardHeader>
          <CardTitle>
            {emoji} {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="pb-5">
            <Progress value={70} className="w-full border-2" />
          </div>

          <Card className="flex h-80"></Card>
        </CardContent>
      </Card>
    </>
  );
};
export default ChallengeDetail;
