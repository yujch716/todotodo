import { supabase } from "@/lib/supabaseClient.ts";
import { toast } from "sonner";

export const getDailyTodoByDailyLogId = async (dailyLogId: string) => {
  const { data, error } = await supabase
    .from("daily_todo")
    .select()
    .eq("daily_log_id", dailyLogId)
    .order("created_at", { ascending: true });

  if (error) toast.error("조회에 실패했습니다.");

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

export const createDailyTodo = async (
  dailyLogId: string,
  content: string,
) => {
  const { data, error } = await supabase
    .from("daily_todo")
    .insert({ daily_log_id: dailyLogId, content, is_checked: false })
    .select()
    .single();

  if (error) toast.error("생성에 실패했습니다.");

  return data;
};

export const updateDailyTodoContent = async (
  id: string,
  content: string,
): Promise<void> => {
  const { error } = await supabase
    .from("daily_todo")
    .update({ content })
    .eq("id", id);

  if (error) toast.error("수정에 실패했습니다.");
};

export const toggleDailyTodo = async (
  id: string,
  isChecked: boolean,
): Promise<void> => {
  const { error } = await supabase
    .from("daily_todo")
    .update({ is_checked: isChecked })
    .eq("id", id);

  if (error) toast.error("수정에 실패했습니다.");
};

export const deleteDailyTodo = async (id: string): Promise<void> => {
  const { error } = await supabase.from("daily_todo").delete().eq("id", id);

  if (error) toast.error("삭제에 실패했습니다.");
};
