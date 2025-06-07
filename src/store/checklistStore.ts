import { create } from "zustand";

interface ChecklistState {
  selectedChecklistId: string | null;
  refreshSidebar: boolean;
  setSelectedChecklistId: (id: string | null) => void;
  triggerSidebarRefresh: () => void;
  resetSidebarRefresh: () => void;
}

export const useChecklistStore = create<ChecklistState>((set) => ({
  selectedChecklistId: null,
  refreshSidebar: false,
  setSelectedChecklistId: (id) => set({ selectedChecklistId: id }),
  triggerSidebarRefresh: () => set({ refreshSidebar: true }),
  resetSidebarRefresh: () => set({ refreshSidebar: false }),
}));
