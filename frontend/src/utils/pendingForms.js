import { create } from "zustand";
import { useCompletedFormsStore } from "./completedForms";

export const usePendingFormsStore = create((set) => ({
    pendingForms: [],
    setPendingFroms: (pendingForms) => set({ pendingForms }),

    fetchPendingForms: async () => {
        const response = await fetch("/api/technician/pending");
        const Forms = await response.json();
        const { data } = Forms;
        set((state) => ({ pendingForms: [...data] }));

    },

    updateForm: async (id, details) => {
        const response = await fetch(`/api/technician/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(details),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || "Failed to update",
            };
        }

        const data = await response.json();
        const updatedPendingFroms = data.data;

        set((state) => {
            const { completedForms, setCompletedForms } =
                useCompletedFormsStore.getState();
            setCompletedForms([...completedForms, updatedPendingFroms]);

            return {
                pendingForms: state.pendingForms.filter(
                    (PendingFroms) => PendingFroms._id !== id
                ),
            };
        });

        return { success: true, message: "PendingFroms updated successfully" };
    },
}));
