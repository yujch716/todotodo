import { supabase } from "@/lib/supabaseClient.ts";
import { format } from "date-fns";
import { toast } from "sonner";

export const createChallengeLog = async (
  challengeId: string,
  date: Date,
  memo: string | null,
  value: number | null,
) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("인증된 유저가 없습니다.");
  }

  const { data, error } = await supabase
    .from("challenge_log")
    .insert({
      user_id: user.id,
      challenge_id: challengeId,
      date: format(date, "yyyy-MM-dd"),
      memo,
      value,
    })
    .select()
    .single();

  if (error) toast.error("생성에 실패했습니다.");

  return data;
};
