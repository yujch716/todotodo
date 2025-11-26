import {supabase} from "@/lib/supabaseClient.ts";
import {toast} from "sonner";
import type {GoalGroup} from "@/types/goal.ts";

export const getGoalGroups = async (): Promise<GoalGroup[]> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("인증된 유저가 없습니다.");
  }

  const { data, error } = await supabase.from("goal_group").select("*").eq("user_id", user.id);

  if (error) toast.error("조회에 실패했습니다.");

  return data ?? [];
}