export interface DailyLogType {
  id: string;
  memo: string;
  date: Date;
  daily_todo: DailyTodoType[];
  totalCount: number;
  checkedCount: number;
}

export interface DailyTodoType {
  id: string;
  content: string;
  is_checked: boolean;
  totalCount: number;
  checkedCount: number;
}
