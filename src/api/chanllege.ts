import { supabase } from "@/lib/supabaseClient.ts";
import { toast } from "sonner";
import { format } from "date-fns";
import type { Challenge } from "@/types/challenge.ts";

export const getChallenges = async (): Promise<Challenge[]> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("인증된 유저가 없습니다.");
  }

  const { data, error } = await supabase
    .from("challenge")
    .select("*")
    .eq("user_id", user.id);

  if (error) toast.error("조회에 실패했습니다.");

  return data ?? [];
};

export const getChallengeById = async (
  challengeId: string,
): Promise<Challenge> => {
  const { data, error } = await supabase
    .from("challenge")
    .select(`*, challenge_log(*)`)
    .eq("id", challengeId)
    .single();

  if (error) toast.error("조회에 실패했습니다.");

  return data;
};

export const createChallenge = async (
  emoji: string,
  title: string,
  type: "progress" | "habit",
  start_date: Date,
  end_date: Date,
  repeat_days: string[] | null,
  target_value: number | null,
): Promise<Challenge> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("인증된 유저가 없습니다.");
  }

  const { error, data } = await supabase
    .from("challenge")
    .insert([
      {
        user_id: user.id,
        emoji,
        title,
        type,
        start_date: format(start_date, "yyyy-MM-dd"),
        end_date: format(end_date, "yyyy-MM-dd"),
        repeat_days,
        target_value,
      },
    ])
    .select()
    .single();

  if (error) toast.error("생성에 실패했습니다.");

  return data;
};
