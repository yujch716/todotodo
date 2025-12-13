import { supabase } from "@/lib/supabaseClient.ts";
import { toast } from "sonner";
import type { CreateGoalLogDto } from "@/types/goal.ts";
import { getAuthenticatedUser } from "@/api/auth.ts";

export const createGoalLog = async (input: CreateGoalLogDto): Promise<void> => {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("goal_log")
    .insert({
      user_id: user.id,
      ...input,
    })
    .select()
    .single();

  if (error) toast.error("생성에 실패했습니다.");

  return data;
};

export const deleteGoalLogById = async (id: string): Promise<void> => {
  const { error } = await supabase.from("goal_log").delete().eq("id", id);

  if (error) toast.error("삭제에 실패했습니다.");
};
