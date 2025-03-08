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
            const data = await response.json();
            const updatedPendingForm = data.data;
            const { fetchCompletedForms } = useCompletedFormsStore.getState();
            fetchCompletedForms();

            set((state) => {
                const updatedForms = state.pendingForms.reduce((acc, form) => {
                    if (form._id === fid) {
                        const remainingProducts = form.products.filter((product) => product._id !== pid);
                        if (remainingProducts.length > 0) {
                            acc.push({
                                ...form,
                                products: remainingProducts,
                            });
                        }
                    } else {
                        acc.push(form);
                    }
                    return acc;
                }, []);
                return { pendingForms: updatedForms };
            });
            return { success: true, message: "PendingForms updated successfully" };
        } catch (error) {
            return {
                success: false,
                message: error.message || "An error occurred",
            };
        }
    },
}));
