import { create } from "zustand";

export const useCompletedFormsStore = create((set) => ({
    completedForms: [],
    setCompletedForms: (forms) => set({ completedForms: forms }),

    fetchCompletedForms: async() => {
        try {
            const response = await fetch("/api/csc/completed");
            if (!response.ok) {
                throw new Error("Failed to fetch completed forms");
            }
            const result = await response.json();
            set({ completedForms: result.data });
        } catch (error) {
            console.error("Error fetching completed forms:", error);
            throw error;
        }
    },
}));