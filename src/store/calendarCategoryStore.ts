import { create } from "zustand";

interface CalendarCategoryState {
  refreshCalendarCategory: boolean;
  triggerCalendarCategoryRefresh: () => void;
  resetCalendarCategoryRefresh: () => void;
}

export const useCalendarCategoryStore = create<CalendarCategoryState>(
  (set) => ({
    refreshCalendarCategory: false,
    triggerCalendarCategoryRefresh: () =>
      set({ refreshCalendarCategory: true }),
    resetCalendarCategoryRefresh: () => set({ refreshCalendarCategory: false }),
  }),
);
