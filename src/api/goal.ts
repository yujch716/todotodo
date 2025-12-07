import { supabase } from "@/lib/supabaseClient.ts";
import { toast } from "sonner";
import { format, getDay } from "date-fns";
import {
  type Goal,
  type CreateGoalDto,
  type UpdateGoalDto,
  type GoalStatusType, GoalStatus,
} from "@/types/goal.ts";

export const getGoals = async (): Promise<Goal[]> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("인증된 유저가 없습니다.");
  }

  const { data, error } = await supabase
    .from("goal")
    .select("*")
    .eq("user_id", user.id);

  if (error) toast.error("조회에 실패했습니다.");

  return data ?? [];
};

export const getGoalsByStatus = async (
  goalGroupId: string,
  status: GoalStatusType,
): Promise<Goal[]> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("인증된 유저가 없습니다.");
  }

  const { data, error } = await supabase
    .from("goal")
    .select("*")
    .eq("user_id", user.id)
    .eq("group_id", goalGroupId)
    .eq("status", status)
    .order("updated_at", { ascending: false });

  if (error) toast.error("조회에 실패했습니다.");

  return data ?? [];
};

export const getGoalById = async (goalId: string): Promise<Goal> => {
  const { data, error } = await supabase
    .from("goal")
    .select(
      `
      *,
      goal_log (*)
    `,
    )
    .eq("id", goalId)
    .order("created_at", { ascending: false, referencedTable: "goal_log" })
    .single();

  if (error) toast.error("조회에 실패했습니다.");

  return data;
};

export const getOngoingDailyGoalsByDate = async (
  date: Date,
): Promise<Goal[]> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("인증된 유저가 없습니다.");
  }

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
    .from("goal")
    .select(`*, goal_log(*)`)
    .eq("user_id", user.id)
    .eq("type", "daily")
    .lte("start_date", format(date, "yyyy-MM-dd"))
    .gte("end_date", format(date, "yyyy-MM-dd"))
    .contains("repeat_days", [dayString]);

  if (error) toast.error("조회에 실패했습니다.");

  return data ?? [];
};

export const getOngoingMilestoneGoalsByDate = async (): Promise<Goal[]> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("인증된 유저가 없습니다.");
  }

  const { data, error } = await supabase
    .from("goal")
    .select(`*, goal_log(*)`)
    .eq("user_id", user.id)
    .eq("type", "milestone")
    .eq("status", GoalStatus.inProgress);

  if (error) toast.error("조회에 실패했습니다.");

  return data ?? [];
};

export const getDailyGoalByRangeDate = async (
  start: Date,
  end: Date,
): Promise<Goal[]> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("인증된 유저가 없습니다.");
  }

  const { data, error } = await supabase
    .from("goal")
    .select(`*, goal_log(*)`)
    .eq("user_id", user.id)
    .eq("type", "daily")
    .lte("start_date", format(end, "yyyy-MM-dd"))
    .gte("end_date", format(start, "yyyy-MM-dd"));

  if (error) toast.error("조회에 실패했습니다.");

  return data ?? [];
};

export const createGoal = async (input: CreateGoalDto): Promise<Goal> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("인증된 유저가 없습니다.");
  }

  const { error, data } = await supabase
    .from("goal")
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

export const updateGoal = async (id: string, input: UpdateGoalDto) => {
  const { error } = await supabase.from("goal").update(input).eq("id", id);

  if (error) toast.error("수정에 실패했습니다.");
};

export const updateGoalStatus = async (id: string, status: GoalStatusType) => {
  const { error } = await supabase.from("goal").update({ status }).eq("id", id);

  if (error) toast.error("상태 변경에 실패했습니다.");
};

export const deleteGoalById = async (id: string) => {
  const { error } = await supabase.from("goal").delete().eq("id", id);

  if (error) toast.error("삭제에 실패했습니다.");
};

export const deleteGoalByIds = async (ids: string[]) => {
  const { error } = await supabase.from("goal").delete().in("id", ids);

  if (error) toast.error("삭제에 실패했습니다.");
};
