import { create } from "zustand";

export const useCompletedFormsStore = create((set) => ({
    completedForms: [],
    setCompletedForms: (completedForms) =>
        set({ completedForms }),

    fetchCompletedForms: async() => {
        const response = await fetch("/api/technician/completed");
        const equipments = await response.json();
        const data = equipments.data;
        set((state) => ({ completedForms: [...data] }));
    },

}));