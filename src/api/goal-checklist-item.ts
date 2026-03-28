import {getAuthenticatedUser} from "@/api/auth.ts";
import {supabase} from "@/lib/supabaseClient.ts";
import {toast} from "sonner";
import type {GoalChecklistItem} from "@/types/goal.ts";

export const createGoalChecklistItem = async  (goalId: string, order_index: number, content: string): Promise<GoalChecklistItem> => {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("goal_checklist_item")
    .insert([
      {
        goal_id: goalId,
        user_id: user.id,
        order_index,
        content,
      },
    ])
    .select()
    .single();

  if (error) {
    toast.error("체크 항목 생성에 실패했습니다.");
  }

  return data;
}

export const updateGoalChecklistItem = async (id: string, content: string): Promise<void>  => {
  const { error } = await supabase
    .from("goal_checklist_item")
    .update({ content })
    .eq("id", id);

  if (error) {
    toast.error("체크 항목 수정에 실패했습니다.");
  }
}

export const deleteGoalChecklistItem = async (id: string): Promise<void> => {
  const { error } = await supabase.from("goal_checklist_item").delete().eq("id", id);

  if (error) {
    toast.error("체크 항목 삭제에 실패했습니다.");
    return;
  }
}