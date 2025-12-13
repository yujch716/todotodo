import { create } from "zustand";

interface CategoryState {
  refreshCategory: boolean;
  triggerCategoryRefresh: () => void;
  resetCategoryRefresh: () => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  refreshCategory: false,
  triggerCategoryRefresh: () => set({ refreshCategory: true }),
  resetCategoryRefresh: () => set({ refreshCategory: false }),
}));
