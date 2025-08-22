import EventCard from "@/pages/calendar/EventCard.tsx";
import DailyLogCard from "@/pages/calendar/DailyLogCard.tsx";
import type { CalendarEventType } from "@/types/calendar-event.ts";
import type { DailyLogType } from "@/types/daily-log.ts";
import { useState } from "react";
import EventDetailModal from "@/pages/calendar/EventDetailModal.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";

interface CalendarDayCellProps {
  events: CalendarEventType[];
  dailyLog?: DailyLogType;
}

const CalendarDayCell = ({ events, dailyLog }: CalendarDayCellProps) => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [eventDetailModalOpen, setEventDetailModalOpen] = useState(false);

  const eventsCount = events.length;
  const dailyLogCount = dailyLog ? 1 : 0;
  const totalCount = eventsCount + dailyLogCount;

  const allItems = [
    ...events.map((event) => ({ type: "event" as const, data: event })),
    ...(dailyLog ? [{ type: "dailyLog" as const, data: dailyLog }] : []),
  ];

  const previewItems = allItems.slice(0, 2);

  const openEventDetail = (id: string) => {
    setSelectedEventId(id);
    setEventDetailModalOpen(true);
  };

  if (totalCount > 3) {
    return (
      <>
        <ul>
          {previewItems.map((item, idx) => (
            <li key={idx}>
              {item.type === "event" ? (
                <EventCard event={item.data} onClick={openEventDetail} />
              ) : (
                <DailyLogCard dailyLog={item.data} />
              )}
            </li>
          ))}
        </ul>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="secondary"
              className="mt-1 w-full h-6 hover:bg-slate-200"
            >
              <span
                className="overflow-hidden whitespace-nowrap text-ellipsis block text-xs leading-tight"
                style={{ maxWidth: "100%" }}
              >
                +{totalCount - 2} 더 보기
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="right"
            className="max-w-[100px] md:max-w-[200px] max-h-60 overflow-auto p-2"
          >
            <ul>
              {allItems.map((item, idx) => (
                <li key={idx} className="mb-1 last:mb-0">
                  {item.type === "event" ? (
                    <EventCard event={item.data} onClick={openEventDetail} />
                  ) : (
                    <DailyLogCard dailyLog={item.data} />
                  )}
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>

        {selectedEventId && (
          <EventDetailModal
            eventId={selectedEventId}
            open={eventDetailModalOpen}
            onOpenChange={(open) => {
              setEventDetailModalOpen(open);
              if (!open) setSelectedEventId(null);
            }}
          />
        )}
      </>
    );
  } else {
    return (
      <>
        {events.length > 0 && (
          <ul>
            {events.map((item) => (
              <li key={item.id}>
                <EventCard
                  event={item}
                  onClick={(id) => {
                    setSelectedEventId(id);
                    setEventDetailModalOpen(true);
                  }}
                />
              </li>
            ))}
          </ul>
        )}
        {dailyLog && <DailyLogCard dailyLog={dailyLog} />}

        {selectedEventId && (
          <EventDetailModal
            eventId={selectedEventId}
            open={eventDetailModalOpen}
            onOpenChange={(open) => {
              setEventDetailModalOpen(open);
              if (!open) setSelectedEventId(null);
            }}
          />
        )}
      </>
    );
  }
};
export default CalendarDayCell;
