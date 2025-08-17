import { create } from "zustand";

interface ChallengeState {
  refreshChallenge: boolean;
  triggerChallengeRefresh: () => void;
  resetChallengeRefresh: () => void;
}

export const useChallengeStore = create<ChallengeState>((set) => ({
  refreshChallenge: false,
  triggerChallengeRefresh: () => set({ refreshChallenge: true }),
  resetChallengeRefresh: () => set({ refreshChallenge: false }),
}));
