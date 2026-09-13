import { create } from "zustand";
let toastTimer = null;
export const useStore = create((set) => ({
  isAddExpenseOpen: false,
  openAddExpense: () => set({ isAddExpenseOpen: true }),
  closeAddExpense: () => set({ isAddExpenseOpen: false }),

  isAddBudgetOpen: false,
  openAddBudget: () => set({ isAddBudgetOpen: true }),
  closeAddBudget: () => set({ isAddBudgetOpen: false }),

  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  selectedPeriod: "June 2026",
  setSelectedPeriod: (period) => set({ selectedPeriod: period }),

  selectedCategory: "All",
  setSelectedCategory: (category) => set({ selectedCategory: category }),


  showToast: (message, type = "success") => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: { message, type } });
    toastTimer = setTimeout(() => {
      set({ toast: null });
      toastTimer = null;
    }, 3500);
  },
  clearToast: () => {
    if (toastTimer)
      clearTimeout(toastTimer);
    set({ toast: null });
  },

  // --- 4. Authenticated User ---
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("keepbirr_token");
      localStorage.removeItem("keepbirr_user");
    }
    set({ user: null });
  },
}));

export default useStore;
