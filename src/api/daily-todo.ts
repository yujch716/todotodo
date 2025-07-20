import { supabase } from "@/lib/supabaseClient.ts";

export const getDailyTodoByDailyLogId = async (dailyLogId: string) => {
  const { data, error } = await supabase
    .from("daily_todo")
    .select()
    .eq("daily_log_id", dailyLogId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  const totalCount = data?.length;
  const checkedCount = data?.filter(
    (item: { is_checked: boolean }) => item.is_checked,
  ).length;

  return {
    items: data,
    totalCount,
    checkedCount,
  };
};

export const createDailyTodo = async (dailyLogId: string) => {
  const { data, error } = await supabase
    .from("daily_todo")
    .insert({ daily_log_id: dailyLogId, content: "", is_checked: false })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const updateDailyTodoContent = async (id: string, content: string) => {
  const { error } = await supabase
    .from("daily_todo")
    .update({ content })
    .eq("id", id);

  if (error) throw new Error(error.message);
};

export const toggleDailyTodo = async (id: string, isChecked: boolean) => {
  const { error } = await supabase
    .from("daily_todo")
    .update({ is_checked: isChecked })
    .eq("id", id);

  if (error) throw new Error(error.message);
};

export const deleteDailyTodo = async (id: string) => {
  const { error } = await supabase.from("daily_todo").delete().eq("id", id);

  if (error) throw new Error(error.message);
};
