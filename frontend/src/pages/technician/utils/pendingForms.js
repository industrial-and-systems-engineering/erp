import { create } from "zustand";
import { useCompletedFormsStore } from "./completedForms";

export const usePendingFormsStore = create((set) => ({
    pendingForms: [],
    setPendingForms: (pendingForms) => set({ pendingForms }),

    fetchPendingForms: async () => {
        const response = await fetch("/api/technician/pending");
        const Forms = await response.json();
        const { data } = Forms;
        const { products } = data;
        set((state) => ({ pendingForms: [...data] }));
    },

    updateForm: async (fid, pid, details) => {
        console.log("updateForm called with fid:", fid, "pid:", pid, "details:", details);
        try {
            const response = await fetch(`/api/technician/update/${pid}/${fid}`, {
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
            const { fetchCompletedForms } = useCompletedFormsStore.getState();
            fetchCompletedForms();
            return { success: true, message: "PendingForms updated successfully" };
        } catch (error) {
            return {
                success: false,
                message: error.message || "An error occurred",
            };
        }
    },
}));
