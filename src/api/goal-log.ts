import { supabase } from "@/lib/supabaseClient.ts";
import { toast } from "sonner";
import type { CreateGoalLogDto } from "@/types/goal1.ts";

export const createGoalLog = async (input: CreateGoalLogDto) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("인증된 유저가 없습니다.");
  }

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

export const deleteGoalLogById = async (id: string) => {
  const { error } = await supabase.from("goal_log").delete().eq("id", id);

  if (error) toast.error("삭제에 실패했습니다.");
};
