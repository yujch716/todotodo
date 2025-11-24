export interface Challenge {
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

  challenge_log?: ChallengeLog[];
}

export interface CreateChallengeDto {
  emoji: string;
  title: string;
  type: "daily" | "goal";
  start_date?: string;
  end_date?: string;
  repeat_days?: string[] | null;
  target_value?: number | null;
}

export interface UpdateChallengeDto {
  emoji?: string;
  title?: string;
  start_date?: string;
  end_date?: string;
  repeat_days?: string[];
  target_value?: number;
}

export interface UpdateChallengeCompleteDto {
  is_completed: boolean;
}

export interface ChallengeLog {
  id: string;
  challenge_id: string;
  user_id: string;
  date: Date;
  memo: string;
  value: number;
  created_at: Date;
}

export interface CreateChallengeLogDto {
  challenge_id: string;
  date: string;
  memo?: string | null;
  value?: number | null;
}

export interface ChallengeGroup {
  id: string;
  user_id: string;
  name: string;
  challenges: Challenge[];
}