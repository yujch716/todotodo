export interface Challenge {
  id: string;
  user_id: string;
  title: string;
  emoji: string;
  type: "progress" | "habit";
  start_date: Date;
  end_date: Date;
  repeat_type: "daily" | "weekly" | null;
  repeat_days: string[] | null;
  target_value: number | null;
  is_completed: boolean;
  created_at: Date;
}
