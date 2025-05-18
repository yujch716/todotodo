export interface ChecklistItem {
  id: string;
  content: string;
  is_checked: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
  memo: string;
}
