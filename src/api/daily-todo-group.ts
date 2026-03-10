import { supabase } from "@/lib/supabaseClient.ts";
import { toast } from "sonner";
import type { DailyTodoGroupType } from "@/types/daily-log.ts";

export const getDailyTodoGroups = async (dailyLogId: string) => {
  const { data, error } = await supabase
    .from("daily_todo_group")
    .select("*")
    .eq("daily_log_id", dailyLogId);

  if (error) {
    toast.error("투두 그룹 조회에 실패했습니다.");
    return [];
  }

  return data || [];
};

export const getDailyTodoGroupsWithTodos = async (dailyLogId: string) => {
  const { data, error } = await supabase
    .from("daily_todo_group")
    .select(
      `
      *,
      todos:daily_todo(*)
    `,
    )
    .eq("daily_log_id", dailyLogId)
    .order("sort_order", { ascending: true });

  if (error) {
    toast.error("투두 그룹 조회에 실패했습니다.");
    return [];
  }

  return (data || []).map((group) => ({
    ...group,
    todos: (group.todos || []).sort(
      (
        a: { created_at: string | number | Date },
        b: { created_at: string | number | Date },
      ) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    ),
  }));
};

export const createDailyTodoGroup = async (
  dailyLogId: string,
  categoryId?: string | null,
  sortOrder?: number,
) => {
  const { data, error } = await supabase
    .from("daily_todo_group")
    .insert({
      daily_log_id: dailyLogId,
      title: "새 그룹",
      category_id: categoryId || null,
      sort_order: sortOrder || 0,
    })
    .select()
    .single();

  if (error) {
    toast.error("생성에 실패했습니다.");
    return null;
  }

  return data;
};

export const updateDailyTodoGroup = async (
  id: string,
  updates: Partial<
    Pick<DailyTodoGroupType, "title" | "category_id" | "sort_order">
  >,
): Promise<boolean> => {
  const { error } = await supabase
    .from("daily_todo_group")
    .update(updates)
    .eq("id", id);

  if (error) {
    toast.error("수정에 실패했습니다.");
    return false;
  }

  return true;
};

export const deleteDailyTodoGroup = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("daily_todo_group")
    .delete()
    .eq("id", id);

  if (error) {
    toast.error("삭제에 실패했습니다.");
    return false;
  }

  return true;
};
