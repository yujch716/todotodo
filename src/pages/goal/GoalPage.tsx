import GoalList from "@/pages/goal/GoalList.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";
import GoalDetail from "@/pages/goal/GoalDetail.tsx";

const GoalPage = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(
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
            <GoalList
              onCardClick={(id) => {
                setSelectedGoalId(id);
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
                <GoalDetail goalId={selectedGoalId} />
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <>
            <div className="w-2/5 h-full flex flex-col">
              <GoalList onCardClick={(id) => setSelectedGoalId(id)} />
            </div>
            <Separator orientation="vertical" />
            <div className="w-3/5 px-4 h-full flex flex-col">
              <GoalDetail goalId={selectedGoalId} />
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default GoalPage;
