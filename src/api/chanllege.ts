import { supabase } from "@/lib/supabaseClient.ts";
import { toast } from "sonner";
import { format, getDay } from "date-fns";
import type {
  Challenge,
  CreateChallengeDto,
  UpdateChallengeCompleteDto,
  UpdateChallengeDto,
} from "@/types/challenge.ts";

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
    .order("created_at", { foreignTable: "challenge_log", ascending: false })
    .single();

  if (error) toast.error("조회에 실패했습니다.");

  return data;
};

export const getOngoingChallengesByDate = async (
  date: Date,
): Promise<Challenge[]> => {
  const weekdayMap: Record<number, string> = {
    0: "sun",
    1: "mon",
    2: "tue",
    3: "wed",
    4: "thu",
    5: "fri",
    6: "sat",
  };

  const dayString = weekdayMap[getDay(date)];

  const { data, error } = await supabase
    .from("challenge")
    .select(`*, challenge_log(*)`)
    .eq("type", "daily")
    .lte("start_date", format(date, "yyyy-MM-dd"))
    .gte("end_date", format(date, "yyyy-MM-dd"))
    .contains("repeat_days", [dayString]);

  if (error) toast.error("조회에 실패했습니다.");

  return data ?? [];
};

export const getOngoingCGoalChallengesByDate = async (): Promise<
  Challenge[]
> => {
  const { data, error } = await supabase
    .from("challenge")
    .select(`*, challenge_log(*)`)
    .eq("type", "goal")
    .eq("is_completed", false);

  if (error) toast.error("조회에 실패했습니다.");

  return data ?? [];
};

export const createChallenge = async (
  input: CreateChallengeDto,
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
        ...input,
      },
    ])
    .select()
    .single();

  if (error) toast.error("생성에 실패했습니다.");

  return data;
};

export const updateChallenge = async (
  id: string,
  input: UpdateChallengeDto,
) => {
  const { error } = await supabase.from("challenge").update(input).eq("id", id);

  if (error) toast.error("수정에 실패했습니다.");
};

export const updateChallengeCompleted = async (
  id: string,
  input: UpdateChallengeCompleteDto,
) => {
  const { error } = await supabase.from("challenge").update(input).eq("id", id);

  if (error) toast.error("변경에 실패했습니다.");
};

export const deleteChallengeById = async (id: string) => {
  const { error } = await supabase.from("challenge").delete().eq("id", id);

  if (error) toast.error("삭제에 실패했습니다.");
};

export const deleteChallengeByIds = async (ids: string[]) => {
  const { error } = await supabase.from("challenge").delete().in("id", ids);

  if (error) toast.error("삭제에 실패했습니다.");
};
