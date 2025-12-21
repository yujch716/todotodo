import { create } from "zustand";

interface GoalGroupState {
  refreshGoalGroup: boolean;
  triggerGoalGroupRefresh: () => void;
  resetGoalGroupRefresh: () => void;
}

export const useGoalGroupStore = create<GoalGroupState>((set) => ({
  refreshGoalGroup: false,
  triggerGoalGroupRefresh: () => set({ refreshGoalGroup: true }),
  resetGoalGroupRefresh: () => set({ refreshGoalGroup: false }),
}));
