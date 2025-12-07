import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card.tsx";
import type { CalendarEventType } from "@/types/calendar-event.ts";
import EventDetailModal from "@/pages/calendar/EventDetailModal.tsx";
import { useState } from "react";

interface DailyNoticeScheduleCardProps {
  schedule: CalendarEventType;
}

const DailyNoticeScheduleCard = ({
  schedule,
}: DailyNoticeScheduleCardProps) => {
  const { id, title, is_all_day, start_at, end_at, category } = schedule;

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (eventId: string) => {
    setSelectedEventId(eventId);
    setModalOpen(true);
  };

  return (
    <>
      <Card
        key={id}
        className="p-3 w-[250px] cursor-pointer shadow-sm hover:shadow-md hover:bg-gradient-to-br hover:from-white hover:to-slate-100"
        onClick={() => openModal(id)}
      >
        <div className="flex flex-row items-center justify-between pb-2">
          <h1
            className="flex-grow overflow-hidden whitespace-nowrap text-ellipsis leading-tight text-base font-bold"
            style={{ minWidth: 0 }}
          >
            {title}
          </h1>
          {category?.color && (
            <div
              className="w-5 h-5 rounded-full flex-shrink-0"
              style={{ backgroundColor: category.color }}
            />
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap text-sm">
          <CalendarIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {is_all_day ? (
            <>
              {start_at ? format(start_at, "yyyy-MM-dd") : "시작일"} -{" "}
              {end_at ? format(end_at, "yyyy-MM-dd") : "종료일"}
            </>
          ) : (
            <>
              {start_at ? format(start_at, "yyyy-MM-dd") : "시작일"}
              <span className="mx-0.5" />
              {format(start_at, "HH:mm")} - {format(end_at, "HH:mm")}
            </>
          )}
        </div>
      </Card>

      {selectedEventId && (
        <EventDetailModal
          eventId={selectedEventId}
          open={modalOpen}
          onOpenChange={(open) => {
            setModalOpen(open);
            if (!open) setSelectedEventId(null);
          }}
        />
      )}
    </>
  );
};
export default DailyNoticeScheduleCard;
