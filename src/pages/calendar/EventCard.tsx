import { Card } from "@/components/ui/card.tsx";
import type { CalendarEventType } from "@/types/calendar-event.ts";

interface EventCardProps {
  event: CalendarEventType;
  onClick: (id: string) => void;
}

const EventCard = ({ event, onClick }: EventCardProps) => {
  return (
    <Card
      className="p-1 mb-0.5 min-h-[30px] flex items-center cursor-pointer"
      style={{ backgroundColor: event.category?.color || undefined }}
      onClick={() => onClick(event.id)}
    >
      <span
        className="overflow-hidden whitespace-nowrap text-ellipsis block text-xs leading-tight"
        style={{ maxWidth: "100%" }}
      >
        {event.title}
      </span>
    </Card>
  );
};

export default EventCard;
