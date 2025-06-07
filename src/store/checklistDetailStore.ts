import { create } from "zustand";

interface ChecklistState {
  refreshChecklist: boolean;
  triggerChecklistRefresh: () => void;
  resetChecklistRefresh: () => void;
}

export const useChecklistDetailStore = create<ChecklistState>((set) => ({
  refreshChecklist: false,
  triggerChecklistRefresh: () => set({ refreshChecklist: true }),
  resetChecklistRefresh: () => set({ refreshChecklist: false }),
}));
