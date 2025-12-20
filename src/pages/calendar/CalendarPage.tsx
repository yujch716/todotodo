import Calendar from "@/pages/calendar/Calendar.tsx";
import { useIsMobile } from "@/hooks/use-mobile.tsx";

const CalendarPage = () => {
  const isMobile = useIsMobile();

  return (
    <div className={isMobile ? "-m-6" : ""}>
      <Calendar />
    </div>
  );
};

export default CalendarPage;
