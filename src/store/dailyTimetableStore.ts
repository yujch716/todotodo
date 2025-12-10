import { create } from "zustand";

interface DailyTimetableStore {
  refreshDailyTimetable: boolean;
  triggerDailyTimetableRefresh: () => void;
  resetDailyTimetableRefresh: () => void;
}

export const useDailyTimetableStore = create<DailyTimetableStore>((set) => ({
  refreshDailyTimetable: false,
  triggerDailyTimetableRefresh: () => set({ refreshDailyTimetable: true }),
  resetDailyTimetableRefresh: () => set({ refreshDailyTimetable: false }),
}));
