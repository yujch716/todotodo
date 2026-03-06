import { supabase } from "@/lib/supabaseClient.ts";
import { toast } from "sonner";

export const createDailyTodo = async (
  dailyLogId: string,
  groupId: string,
  content: string,
) => {
  const { data, error } = await supabase
    .from("daily_todo")
    .insert({
      daily_log_id: dailyLogId,
      group_id: groupId,
      content,
      is_checked: false,
    })
    .select()
    .single();

  if (error) toast.error("생성에 실패했습니다.");

  return data;
};

export const updateDailyTodoContent = async (
  id: string,
  content: string,
): Promise<boolean> => {
  const { error } = await supabase
    .from("daily_todo")
    .update({ content })
    .eq("id", id);

  if (error) {
    toast.error("투두 수정에 실패했습니다.");
    return false;
  }

  return true;
};

export const toggleDailyTodo = async (
  id: string,
  isChecked: boolean,
): Promise<boolean> => {
  const { error } = await supabase
    .from("daily_todo")
    .update({ is_checked: isChecked })
    .eq("id", id);

  if (error) {
    toast.error("투두 상태 변경에 실패했습니다.");
    return false;
  }

  return true;
};

export const deleteDailyTodo = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from("daily_todo").delete().eq("id", id);

  if (error) {
    toast.error("투두 삭제에 실패했습니다.");
    return false;
  }

  return true;
};
