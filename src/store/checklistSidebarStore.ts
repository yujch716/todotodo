import { create } from "zustand";

interface SidebarState {
  refreshSidebar: boolean;
  triggerSidebarRefresh: () => void;
  resetSidebarRefresh: () => void;

  refreshChecklist: boolean;
  triggerChecklistRefresh: () => void;
  resetChecklistRefresh: () => void;
}

export const useChecklistSidebarStore = create<SidebarState>((set) => ({
  refreshSidebar: false,
  triggerSidebarRefresh: () => set({ refreshSidebar: true }),
  resetSidebarRefresh: () => set({ refreshSidebar: false }),

  refreshChecklist: false,
  triggerChecklistRefresh: () => set({ refreshChecklist: true }),
  resetChecklistRefresh: () => set({ refreshChecklist: false }),
}));
