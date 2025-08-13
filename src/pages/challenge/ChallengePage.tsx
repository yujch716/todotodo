import ChallengeList from "@/pages/challenge/ChallengeList.tsx";
import ChallengeDetail from "@/pages/challenge/ChallengeDetail.tsx";
import { Separator } from "@/components/ui/separator.tsx";
const ChallengePage = () => {
  return (
    <>
      <div className="flex h-full overflow-hidden">
        <div className="w-2/5 h-full flex flex-col">
          <ChallengeList />
        </div>

        <Separator orientation="vertical" />

        <div className="w-3/5 h-full flex flex-col">
          <ChallengeDetail />
        </div>
      </div>
    </>
  );
};
export default ChallengePage;
