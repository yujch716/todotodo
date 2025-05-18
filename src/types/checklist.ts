export interface ChecklistItem {
  id: number;
  content: string;
  is_checked: boolean;
}

export interface Checklist {
  id: number;
  title: string;
  items: ChecklistItem[];
  memo: string;
}
