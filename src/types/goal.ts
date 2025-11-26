export const GoalItemStatus = {
  notStarted: "notStarted",
  inProgress: "inProgress",
  done: "done",
} as const;

export type GoalItemStatusType = keyof typeof GoalItemStatus;

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  emoji: string;
  type: "daily" | "goal";
  start_date: Date;
  end_date: Date;
  repeat_days: string[] | null;
  target_value: number | null;
  is_completed: boolean;
  created_at: Date;

  goal_log?: GoalLog[];
}

export interface CreateGoalDto {
  emoji: string;
  title: string;
  type: "daily" | "goal";
  start_date?: string;
  end_date?: string;
  repeat_days?: string[] | null;
  target_value?: number | null;
}

export interface UpdateGoalDto {
  emoji?: string;
  title?: string;
  start_date?: string;
  end_date?: string;
  repeat_days?: string[];
  target_value?: number;
}

export interface UpdateGoalCompleteDto {
  is_completed: boolean;
}

export interface GoalLog {
  id: string;
  goal_id: string;
  user_id: string;
  date: Date;
  memo: string;
  value: number;
  created_at: Date;
}

export interface CreateGoalLogDto {
  goal_id: string;
  date: string;
  memo?: string | null;
  value?: number | null;
}

export interface GoalGroup {
  id: string;
  user_id: string;
  name: string;
  goals: Goal[];
}