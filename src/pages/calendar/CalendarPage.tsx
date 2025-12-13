import Calendar from "@/pages/calendar/Calendar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Tag } from "lucide-react";
import { useState } from "react";
import CategoryPage from "@/pages/setting/category/CategoryPanel.tsx";

const CalendarPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Calendar />

      <Button
        onClick={() => setOpen(true)}
        className="fixed top-1/2 right-0 -translate-y-1/2 bg-primary text-white p-4 rounded-l-full shadow-lg hover:bg-primary/90 z-50"
        aria-label="Open Sheet"
      >
        <Tag className="w-6 h-6" />
      </Button>

      <CategoryPage open={open} onOpenChange={setOpen} />
    </>
  );
};

export default CalendarPage;
