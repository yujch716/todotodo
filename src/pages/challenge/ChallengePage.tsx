import ChallengeList from "@/pages/challenge/ChallengeList.tsx";
import ChallengeDetail from "@/pages/challenge/ChallengeDetail.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ChallengePage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <div className="flex w-full h-full">
        {/* 왼쪽 패널 */}
        <div
          className={`transition-all duration-300 ${
            isCollapsed ? "w-0" : "w-2/5"
          } overflow-hidden`}
        >
          <ChallengeList />
        </div>

        <div className="relative flex items-center">
          <Separator orientation="vertical" />
          <Button
            variant="outline"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute left-1/2 -translate-x-1/2 rounded-full shadow p-1 bg-white hover:bg-sky-200"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        <div
          className={`h-full flex flex-col overflow-auto px-4 ${
            isCollapsed ? "w-full" : "w-3/5"
          }`}
        >
          <ChallengeDetail />
        </div>
      </div>
    </>
  );
};
export default ChallengePage;
