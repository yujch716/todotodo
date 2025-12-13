import { supabase } from "@/lib/supabaseClient.ts";
import { toast } from "sonner";
import { format } from "date-fns";
import type { CalendarEventType } from "@/types/calendar-event.ts";
import { getAuthenticatedUser } from "@/api/auth.ts";

export const getCalendarEvents = async (
  start: Date,
  end: Date,
): Promise<CalendarEventType[]> => {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("calendar_event")
    .select(
      `
      *,
      category:category (*)
    `,
    )
    .eq("user_id", user.id)
    .gte("start_at", start.toISOString())
    .lte("start_at", end.toISOString());

  if (error) toast.error("조회에 실패했습니다.");

  return data ?? [];
};

export const getCalendarEventById = async (
  calendarEventId: string,
): Promise<CalendarEventType> => {
  const { data, error } = await supabase
    .from("calendar_event")
    .select(
      `
    *,
    category:category (*)
  `,
    )
    .eq("id", calendarEventId)
    .single();

  if (error) toast.error("조회에 실패했습니다.");

  return data;
};

export const getCalendarEventByDate = async (
  date: Date,
): Promise<CalendarEventType[]> => {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("calendar_event")
    .select(
      `
    *,
    category:category (*)
  `,
    )
    .eq("user_id", user.id)
    .eq("start_at", date.toISOString());

  if (error) toast.error("조회에 실패했습니다.");

  return data ?? [];
};

export const createCalendarEvent = async (
  title: string,
  description: string,
  is_all_day: boolean,
  start_at: Date,
  end_at: Date,
  category_id: string | null,
): Promise<CalendarEventType> => {
  const user = await getAuthenticatedUser();

  const { error, data } = await supabase
    .from("calendar_event")
    .insert([
      {
        user_id: user.id,
        title,
        description,
        start_at: format(start_at, "yyyy-MM-dd"),
        end_at: format(end_at, "yyyy-MM-dd"),
        is_all_day,
        category_id: category_id ?? null,
      },
    ])
    .select()
    .single();

  if (error) toast.error("생성에 실패했습니다.");

  return data;
};

export const updateCalendarEvent = async (
  id: string,
  title: string,
  description: string,
  is_all_day: boolean,
  start_at: Date,
  end_at: Date,
  category_id: string | null,
): Promise<void> => {
  const { error } = await supabase
    .from("calendar_event")
    .update({
      title,
      description,
      start_at: format(start_at, "yyyy-MM-dd"),
      end_at: format(end_at, "yyyy-MM-dd"),
      is_all_day,
      category_id: category_id ?? null,
    })
    .eq("id", id);

  if (error) toast.error("수정에 실패했습니다.");
};

export const deleteCalendarEventById = async (
  calendarEventId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("calendar_event")
    .delete()
    .eq("id", calendarEventId);

  if (error) toast.error("삭제에 실패했습니다.");
};
