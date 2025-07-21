import { supabase } from "@/lib/supabaseClient";
import type { DailyLogType } from "@/types/daily-log.ts";
import { format } from "date-fns";
import { toast } from "sonner";

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

export const getDailyLogByDate = async (
  date: Date,
): Promise<DailyLogType | null> => {
  const { data, error } = await supabase
    .from("daily_log")
    .select(`*`)
    .eq("date", format(date, "yyyy-MM-dd"))
    .single();

  if (error && error.code !== "PGRST116") {
    toast.error("이미 존재하는 일정입니다.");
  }

  return data ?? null;
};

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

export const createDailyLog = async (date: Date): Promise<DailyLogType> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("인증된 유저가 없습니다.");
  }

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

export const deleteDailyLogById = async (dailyLogId: string) => {
  const { error } = await supabase
    .from("daily_log")
    .delete()
    .eq("id", dailyLogId);

  if (error) toast.error("삭제에 실패했습니다.");
};
