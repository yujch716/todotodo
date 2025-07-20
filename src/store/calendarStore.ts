import { create } from "zustand";

interface CalendarState {
  refreshCalendar: boolean;
  triggerCalendarRefresh: () => void;
  resetCalendarRefresh: () => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  refreshCalendar: false,
  triggerCalendarRefresh: () => set({ refreshCalendar: true }),
  resetCalendarRefresh: () => set({ refreshCalendar: false }),
}));
