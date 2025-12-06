import { create } from "zustand";

interface GoalState {
  refreshGoal: boolean;
  triggerGoalRefresh: () => void;
  resetGoalRefresh: () => void;
}

export const useGoalStore = create<GoalState>((set) => ({
  refreshGoal: false,
  triggerGoalRefresh: () => set({ refreshGoal: true }),
  resetGoalRefresh: () => set({ refreshGoal: false }),
}));
