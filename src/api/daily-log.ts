import { supabase } from "@/lib/supabaseClient";
import type { DailyLogType } from "@/types/daily-log.ts";
import { format } from "date-fns";

export const getDailyLogs = async (): Promise<DailyLogType[]> => {
  const { data, error } = await supabase
    .from("daily_log")
    .select(
      `
      *,
      daily_todo (*)
    `,
    )
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);

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

  if (error) throw new Error(error.message);

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

export const getDailyLogByDate = async (date: Date): Promise<DailyLogType | null> => {
  const { data, error } = await supabase
    .from("daily_log")
    .select(`*`)
    .eq("date", format(date, "yyyy-MM-dd"))
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(error.message);
  }

  return data ?? null;
}

export const getDailyLogsByDate = async (
  start: Date,
  end: Date,
): Promise<DailyLogType[]> => {
  const { data, error } = await supabase
    .from("daily_log")
    .select(
      `
      *,
      daily_todo (*)
    `,
    )
    .gte("date", start.toISOString())
    .lte("date", end.toISOString());

  if (error) throw new Error(error.message);

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

export const createDailyLog = async (date: Date) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("유저 정보를 가져오지 못했어요:", userError);
    return;
  }

  const formattedDate = date ? format(date, "yyyy-MM-dd") : null;

  const { error } = await supabase.from("daily_log").insert([
    {
      date: formattedDate,
      user_id: user.id,
    },
  ]);

  if (error) throw new Error(error.message);
};

export const updateDailyLogMemo = async (dailyLogId: string, memo: string) => {
  const { error } = await supabase
    .from("daily_log")
    .update({ memo })
    .eq("id", dailyLogId);

  if (error) throw new Error(error.message);
};

export const deleteDailyLogById = async (dailyLogId: string) => {
  const { error } = await supabase
    .from("daily_log")
    .delete()
    .eq("id", dailyLogId);

  if (error) throw new Error(error.message);
};
