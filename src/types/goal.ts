export const GoalStatus = {
  notStarted: "not_started",
  inProgress: "in_progress",
  completed: "completed",
} as const;
export type GoalStatusType = (typeof GoalStatus)[keyof typeof GoalStatus];

export const GoalType = {
  routine: "routine",
  progress: "progress",
  checklist: "checklist",
};
export type GoalType = (typeof GoalType)[keyof typeof GoalType];

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  emoji: string;
  type: GoalType;
  start_date: Date;
  end_date: Date;
  repeat_days: string[] | null;
  target_value: number | null;
  status: GoalStatusType;
  created_at: Date;
  updated_at: Date;

  goal_log?: GoalLog[];
  goal_checklist_item?: GoalChecklistItem[];
}

export interface CreateGoalDto {
  emoji: string;
  title: string;
  type: GoalType;
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

export interface GoalChecklistItem {
  id: string;
  goal_id: string;
  user_id: string;
  content: string;
  is_checked: boolean;
  order_index: number;
  created_at: Date;
}

export interface GoalGroup {
  id: string;
  user_id: string;
  name: string;
  goals: Goal[];
}
