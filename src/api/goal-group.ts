import { supabase } from "@/lib/supabaseClient.ts";
import { toast } from "sonner";
import type { GoalGroup } from "@/types/goal.ts";
import { getAuthenticatedUser } from "@/api/auth.ts";

export const getGoalGroups = async (): Promise<GoalGroup[]> => {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("goal_group")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) toast.error("조회에 실패했습니다.");

  return data ?? [];
};

export const getGoalGroupById = async (id: string): Promise<GoalGroup> => {
  const { data, error } = await supabase
    .from("goal_group")
    .select("*")
    .eq("id", id)
    .single();

  if (error) toast.error("조회에 실패했습니다.");

  return data;
};

export const createGoalGroup = async (name: string): Promise<GoalGroup> => {
  const user = await getAuthenticatedUser();

  const { error, data } = await supabase
    .from("goal_group")
    .insert([
      {
        user_id: user.id,
        name,
      },
    ])
    .select()
    .single();

  if (error) toast.error("생성에 실패했습니다.");

  return data;
};

export const updateGoalGroup = async (
  id: string,
  name: string,
): Promise<void> => {
  const { error } = await supabase
    .from("goal_group")
    .update({ name })
    .eq("id", id);

  if (error) toast.error("수정에 실패했습니다.");
};

export const deleteGoalGroupById = async (id: string): Promise<void> => {
  const { error } = await supabase.from("goal_group").delete().eq("id", id);

  if (error) toast.error("삭제에 실패했습니다.");
};
