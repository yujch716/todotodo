import { supabase } from "@/lib/supabaseClient";
import type { DailyLogType } from "@/types/daily-log.ts";
import { format } from "date-fns";
import { toast } from "sonner";
import { getAuthenticatedUser } from "@/api/auth.ts";

export const getDailyLogs = async (): Promise<DailyLogType[]> => {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("daily_log")
    .select(
      `
      *,
      daily_todo (*)
    `,
    )
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) toast.error("조회에 실패했습니다.");

  return (data ?? []).map((dailyLog) => {
    const items = dailyLog.daily_todo || [];
    const totalCount = items.length;
    const checkedCount = items.filter(
      (item: { is_checked: boolean }) => item.is_checked,
    ).length;

    return {
      ...dailyLog,
      totalCount,
      checkedCount,
    };
  });
};

export const getDailyLogById = async (
  dailyLogId: string,
): Promise<DailyLogType> => {
  const { data, error } = await supabase
    .from("daily_log")
    .select(
      `
        *,
        daily_todo (
          *,
          created_at
        )
      `,
    )
    .eq("id", dailyLogId)
    .order("created_at", { foreignTable: "daily_todo", ascending: true })
    .single();

  if (error) toast.error("조회에 실패했습니다.");

  const totalCount = data.daily_todo.length;
  const checkedCount = data.daily_todo.filter(
    (item: { is_checked: boolean }) => item.is_checked,
  ).length;

  return {
    ...data,
    totalCount,
    checkedCount,
  };
};

export const getDailyLogByDate = async (
  date: Date,
): Promise<DailyLogType | null> => {
  const user = await getAuthenticatedUser();

  const { data } = await supabase
    .from("daily_log")
    .select(`*`)
    .eq("user_id", user.id)
    .eq("date", format(date, "yyyy-MM-dd"))
    .maybeSingle();

  return data ?? null;
};

export const getDailyLogsByDate = async (
  start: Date,
  end: Date,
): Promise<DailyLogType[]> => {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("daily_log")
    .select(
      `
      *,
      daily_todo (*)
    `,
    )
    .eq("user_id", user.id)
    .gte("date", start.toISOString())
    .lte("date", end.toISOString());

  if (error) toast.error("조회에 실패했습니다.");

  return (data ?? []).map((dailyLog) => {
    const items = dailyLog.daily_todo || [];
    const totalCount = items.length;
    const checkedCount = items.filter(
      (item: { is_checked: boolean }) => item.is_checked,
    ).length;

    return {
      ...dailyLog,
      totalCount,
      checkedCount,
    };
  });
};

export const createDailyLog = async (date: Date): Promise<DailyLogType> => {
  const user = await getAuthenticatedUser();

  const formattedDate = date ? format(date, "yyyy-MM-dd") : null;

  const { error, data } = await supabase
    .from("daily_log")
    .insert([
      {
        date: formattedDate,
        user_id: user.id,
      },
    ])
    .select()
    .single();

  if (error) toast.error("생성에 실패했습니다.");

  return data;
};

export const updateDailyLogMemo = async (dailyLogId: string, memo: string) => {
  const { error } = await supabase
    .from("daily_log")
    .update({ memo })
    .eq("id", dailyLogId);

  if (error) toast.error("수정에 실패했습니다.");
};

export const deleteDailyLogById = async (id: string) => {
  const { error } = await supabase.from("daily_log").delete().eq("id", id);

  if (error) toast.error("삭제에 실패했습니다.");
};
