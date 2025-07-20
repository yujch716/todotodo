import { create } from "zustand";

interface SidebarState {
  refreshSidebar: boolean;
  triggerSidebarRefresh: () => void;
  resetSidebarRefresh: () => void;
}

export const useDailyLogSidebarStore = create<SidebarState>((set) => ({
  refreshSidebar: false,
  triggerSidebarRefresh: () => set({ refreshSidebar: true }),
  resetSidebarRefresh: () => set({ refreshSidebar: false }),
}));
