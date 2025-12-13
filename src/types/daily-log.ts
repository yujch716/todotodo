import type { Category } from "@/types/category.ts";

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

export interface DailyTimetableType {
  id: string;
  content: string;
  start_time: string;
  end_time: string;
  category_id?: number;
  category?: Category;
}
