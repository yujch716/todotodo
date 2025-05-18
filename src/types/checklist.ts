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
}
