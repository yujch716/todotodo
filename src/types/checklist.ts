export interface ChecklistItem {
  id: number;
  title: string;
  isChecked: boolean;
}

export interface Checklist {
  id: number;
  title: string;
  items: ChecklistItem[];
  memo: string;
}
