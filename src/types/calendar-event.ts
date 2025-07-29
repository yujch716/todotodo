import type { CalendarCategory } from "@/types/calendar-category.ts";

export interface CalendarEventType {
  id: string;
  title: string;
  description: string;
  is_all_day: boolean;
  start_at: Date;
  end_at: Date;
  category_id?: number;
  category?: CalendarCategory;
}
