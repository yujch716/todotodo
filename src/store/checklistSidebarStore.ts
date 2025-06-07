import { create } from "zustand";

interface SidebarState {
  refreshSidebar: boolean;
  triggerSidebarRefresh: () => void;
  resetSidebarRefresh: () => void;
}

export const useChecklistSidebarStore = create<SidebarState>((set) => ({
  refreshSidebar: false,
  triggerSidebarRefresh: () => set({ refreshSidebar: true }),
  resetSidebarRefresh: () => set({ refreshSidebar: false }),
}));
