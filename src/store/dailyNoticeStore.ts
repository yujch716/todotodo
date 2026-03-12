import { create } from "zustand";

interface DailyNoticeState {
  refreshDailyNotice: boolean;
  triggerDailyNoticeRefresh: () => void;
  resetDailyNoticeRefresh: () => void;
}

export const useDailyNoticeStore = create<DailyNoticeState>((set) => ({
  refreshDailyNotice: false,
  triggerDailyNoticeRefresh: () => set({ refreshDailyNotice: true }),
  resetDailyNoticeRefresh: () => set({ refreshDailyNotice: false }),
}));
