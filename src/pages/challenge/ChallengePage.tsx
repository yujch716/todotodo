import ChallengeList from "@/pages/challenge/ChallengeList.tsx";
import ChallengeDetail from "@/pages/challenge/ChallengeDetail.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";

const ChallengePage = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(
    null,
  );
  const [isMedium, setIsMedium] = useState(false);
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const mediaQueryMedium = window.matchMedia("(max-width: 1100px)");
    const mediaQuerySmall = window.matchMedia("(max-width: 767px)");

    const handleChange = () => {
      setIsMedium(mediaQueryMedium.matches);
      setIsSmall(mediaQuerySmall.matches);
    };

    handleChange();

    mediaQueryMedium.addEventListener("change", handleChange);
    mediaQuerySmall.addEventListener("change", handleChange);

    return () => {
      mediaQueryMedium.removeEventListener("change", handleChange);
      mediaQuerySmall.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <>
      <div className="flex w-full h-full">
        {isMedium || isSmall ? (
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
              <SheetContent
                style={{
                  width: isSmall ? "100vw" : "80vw",
                  maxWidth: "none",
                }}
              >
                <SheetTitle />
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
