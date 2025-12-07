import { supabase } from "@/lib/supabaseClient.ts";
import { toast } from "sonner";
import type { CalendarCategory } from "@/types/calendar-category.ts";
import {getAuthenticatedUser} from "@/api/auth.ts";

export const getCalendarCategory = async (): Promise<CalendarCategory[]> => {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("calendar_category")
    .select("*")
    .eq("user_id", user.id);

  if (error) toast.error("조회에 실패했습니다.");

  return data ?? [];
};

export const createCalendarCategory = async (
  name: string,
  color: string,
): Promise<void> => {
  const user = await getAuthenticatedUser();

  const { error } = await supabase.from("calendar_category").insert([
    {
      user_id: user.id,
      name,
      color,
    },
  ]);

  if (error) toast.error("생성에 실패했습니다.");
};

export const updateCalendarCategory = async (
  id: string,
  name: string,
  color: string,
) => {
  const { error } = await supabase
    .from("calendar_category")
    .update({ name, color })
    .eq("id", id);

  if (error) toast.error("수정에 실패했습니다.");
};

export const deleteCalendarCategory = async (id: string) => {
  const { error } = await supabase
    .from("calendar_category")
    .delete()
    .eq("id", id);

  if (error) toast.error("삭제에 실패했습니다.");
};
