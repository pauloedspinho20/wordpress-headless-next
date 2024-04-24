import { create } from "zustand";
import { ICategory } from "../types/posts";
import { IExpense } from "../types/expenses";
import { getAllExpensesWithSlug } from "@/wp-api/queries/expenses";

/* GLOBAL */

type GlobalState = {
  connectedWordpress: boolean;
  categories: ICategory[];
};

type GlobalAction = {
  setConnectedWordpress: (connected: boolean) => void;
  updateCategories: (categories: GlobalState["categories"]) => void;
  deselectCategories: () => void;
};

export const useGlobalStore = create<GlobalState & GlobalAction>()((set) => ({
  setConnectedWordpress: (connected) =>
    set(() => ({ connectedWordpress: connected })),
  connectedWordpress: false,
  categories: [],
  updateCategories: (categories) => set(() => ({ categories: categories })),
  deselectCategories: () =>
    set((state) => ({
      categories: state.categories.map((category) => ({
        ...category,
        selected: false,
      })),
    })),
}));

/* EXPENSES */

type ExpenseState = {
  expenses: IExpense[];
  totalIncome: number;
  totalOutcome: number;
};

type ExpenseAction = {
  getExpenses: () => Promise<void>;
  updateExpenses: (expenses: ExpenseState["expenses"]) => void;
  updateTotalIncome: () => void;
  updateTotalOutcome: () => void;
};

export const useExpenseStore = create<ExpenseState & ExpenseAction>()(
  (set) => ({
    expenses: [],
    totalIncome: 0,
    totalOutcome: 0,
    getExpenses: async () => {
      try {
        const e = await getAllExpensesWithSlug();
        set(() => ({
          expenses: e,
        }));
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    },
    updateExpenses: (expenses) =>
      set(() => ({
        expenses: expenses,
      })),
    updateTotalIncome: () =>
      set((state) => ({
        totalIncome:
          state.expenses
            ?.filter((e) => e.expense.type === "income")
            ?.reduce((total, expense) => total + expense.expense.value, 0) | 0,
      })),
    updateTotalOutcome: () =>
      set((state) => ({
        totalOutcome:
          state.expenses
            ?.filter((e) => e.expense.type === "outcome")
            ?.reduce((total, expense) => total + expense.expense.value, 0) | 0,
      })),
  }),
);
