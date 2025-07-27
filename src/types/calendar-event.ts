export interface CalendarEventType {
  id: string;
  title: string;
  description: string;
  is_all_day: boolean;
  start_at: Date;
  end_at: Date;
  calendar_color_id: number | null;
}
