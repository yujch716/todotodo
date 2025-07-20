import { create } from "zustand";

interface DailyLogState {
  refreshDailyLog: boolean;
  triggerDailyLogRefresh: () => void;
  resetDailyLogRefresh: () => void;
}

export const useDailyLogDetailStore = create<DailyLogState>((set) => ({
  refreshDailyLog: false,
  triggerDailyLogRefresh: () => set({ refreshDailyLog: true }),
  resetDailyLogRefresh: () => set({ refreshDailyLog: false }),
}));
