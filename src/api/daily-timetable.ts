import { supabase } from "@/lib/supabaseClient.ts";
import { toast } from "sonner";
import type { DailyTimetableType } from "@/types/daily-log.ts";

export const getDailyTimeTables = async (
  dailyLogId: string,
): Promise<DailyTimetableType[]> => {
  const { data, error } = await supabase
    .from("daily_timetable")
    .select(
      `
      *,
      category:category (*)
    `,
    )
    .eq("daily_log_id", dailyLogId);

  if (error) toast.error("조회에 실패했습니다");

  return data ?? [];
};

export const createDailyTimetable = async (
  dailyLogId: string,
  content: string,
  startTime: string,
  endTime: string,
  category_id: string | null,
) => {
  const { error } = await supabase.from("daily_timetable").insert({
    daily_log_id: dailyLogId,
    content,
    start_time: startTime,
    end_time: endTime,
    category_id: category_id ?? null,
  });

  if (error) toast.error("생성에 실패했습니다.");
};
