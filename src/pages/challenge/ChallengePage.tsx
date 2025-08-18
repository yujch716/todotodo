import ChallengeList from "@/pages/challenge/ChallengeList.tsx";
import ChallengeDetail from "@/pages/challenge/ChallengeDetail.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet.tsx";

const ChallengePage = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(
    null,
  );
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1000px)");

    const handleChange = (e: MediaQueryListEvent) => {
      setIsSmall(e.matches);
    };

    setIsSmall(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <>
      <div className="flex w-full h-full">
        {isSmall ? (
          <>
            <ChallengeList
              onCardClick={(id) => {
                setSelectedChallengeId(id);
                setIsSheetOpen(true);
              }}
            />
            <Sheet
              open={isSheetOpen}
              onOpenChange={(open) => setIsSheetOpen(open)}
            >
              <SheetTrigger className="hidden" />
              <SheetContent style={{ width: "80vw", maxWidth: "none" }}>
                <ChallengeDetail challengeId={selectedChallengeId} />
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <>
            <div className="w-2/5 h-full flex flex-col">
              <ChallengeList onCardClick={(id) => setSelectedChallengeId(id)} />
            </div>
            <Separator orientation="vertical" />
            <div className="w-3/5 px-4 h-full flex flex-col">
              <ChallengeDetail challengeId={selectedChallengeId} />
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default ChallengePage;
