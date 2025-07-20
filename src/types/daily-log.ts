export interface ChecklistItemType {
  id: string;
  content: string;
  is_checked: boolean;
}

export interface ChecklistType {
  id: string;
  title: string;
  memo: string;
  date: Date;
  todo: ChecklistItemType[];
  totalCount: number;
  checkedCount: number;
}

export interface DailyLog {
  id: string;
  title: string;
  memo: string;
  date: Date;
  todo: ChecklistItemType[];
  totalCount: number;
  checkedCount: number;
}

export interface DailyTodo {
  id: string;
  content: string;
  is_checked: boolean;
}