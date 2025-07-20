import { supabase } from "@/lib/supabaseClient";
import type {DailyLog} from "@/types/daily-log.ts";
import { format } from "date-fns";

export const fetchChecklists = async (): Promise<DailyLog[]> => {
  const { data, error } = await supabase
    .from("daily_log")
    .select(
      `
      *,
      daily_todo (*)
    `,
    )
    .order("created_at", { ascending: false });

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

export const fetchChecklistById = async (
  dailyLogId: string,
): Promise<DailyLog> => {
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

export const fetchChecklistByDate = async (
  start: Date,
  end: Date,
): Promise<DailyLog[]> => {
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

  return (data ?? []).map((checklist) => {
    const items = checklist.daily_todo || [];
    const totalCount = items.length;
    const checkedCount = items.filter(
      (item: { is_checked: boolean }) => item.is_checked,
    ).length;

    return {
      ...checklist,
      totalCount,
      checkedCount,
    };
  });
};

export const createChecklist = async (title: string, date: Date) => {
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
      title,
      date: formattedDate,
      user_id: user.id,
    },
  ]);

  if (error) throw new Error(error.message);
};

export const updateChecklistTitle = async (
  dailyLogId: string,
  title: string,
) => {
  const { error } = await supabase
    .from("daily_log")
    .update({ title })
    .eq("id", dailyLogId);

  if (error) throw new Error(error.message);
};

export const updateChecklistMemo = async (
  dailyLogId: string,
  memo: string,
) => {
  const { error } = await supabase
    .from("daily_log")
    .update({ memo })
    .eq("id", dailyLogId);

  if (error) throw new Error(error.message);
};

export const deleteChecklistById = async (dailyLogId: string) => {
  const { error } = await supabase
    .from("daily_log")
    .delete()
    .eq("id", dailyLogId);

  if (error) throw new Error(error.message);
};
