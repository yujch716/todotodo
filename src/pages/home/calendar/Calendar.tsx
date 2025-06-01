import { Calendar } from "@/components/ui/calendar.tsx";
import * as React from "react";

const ChecklistCalendar = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    </>
  );
};

export default ChecklistCalendar;
