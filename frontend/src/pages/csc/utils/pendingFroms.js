import { create } from "zustand";
import { useCompletedFormsStore } from "./completedForms";

export const usePendingFormsStore = create((set) => ({
    pendingForms: [],
    setPendingForms: (pendingForms) => set({ pendingForms }),

    fetchPendingForms: async () => {
        try {
            const response = await fetch("/api/technician/pending");

            if (!response.ok) {
                throw new Error(`Failed to fetch pending forms: ${response.status}`);
            }

            const Forms = await response.json();
            const { data } = Forms;
            set((state) => ({ pendingForms: [...data] }));
        } catch (error) {
            console.error("Error fetching pending forms:", error);
            throw error;
        }
    },

    updateForm: async (fid, pid, details) => {
        console.log("updateForm called with fid:", fid, "pid:", pid, "details:", details);
        try {
            const response = await fetch(`/api/technician/updateform/${fid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(details),
            });

            if (!response.ok) {
                const errorText = await response.text();
                try {
                    // Try to parse as JSON
                    const errorData = JSON.parse(errorText);
                    return {
                        success: false,
                        message: errorData.message || `Failed to update (${response.status})`,
                    };
                } catch (parseError) {
                    // If it's not JSON, return the text or status
                    return {
                        success: false,
                        message: errorText.substring(0, 100) || `Server error (${response.status})`,
                    };
                }
            }

            const data = await response.json();
            const updatedPendingForm = data.data;
            console.log(updatedPendingForm);

            set((state) => {
                console.log("Before update:", state.pendingForms);
                const updatedForms = state.pendingForms.reduce((acc, form) => {
                    if (form._id === fid) {
                        console.log("Updating form:", form._id, "removing product:", pid);
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

                console.log("After update:", updatedForms);
                return { pendingForms: updatedForms };
            });
            return { success: true, message: "PendingForms updated successfully" };
        } catch (error) {
            console.error("Error in updateForm:", error);
            return {
                success: false,
                message: error.message || "An error occurred",
            };
        }
    },



    updateFormDetails: async (formId, details) => {
        try {
            if (!formId) {
                return { success: false, message: "Form ID is required" };
            }

            console.log("Updating form details for formId:", formId, details);

            const response = await fetch(`/api/technician/updateform/${formId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(details),
            });

            if (!response.ok) {
                const errorText = await response.text();
                try {
                    const errorData = JSON.parse(errorText);
                    return {
                        success: false,
                        message: errorData.message || `Failed to update (${response.status})`,
                    };
                } catch {
                    return {
                        success: false,
                        message: `Server error (${response.status})`,
                    };
                }
            }

            const data = await response.json();

            // Remove the form from pendingForms if formUpdated is true.
            if (data.data.formUpdated) {
                set((state) => ({
                    pendingForms: state.pendingForms.filter((form) => form._id !== formId)
                }));
            } else {
                // Otherwise, update the form details in the list.
                set((state) => ({
                    pendingForms: state.pendingForms.map((form) =>
                        form._id === formId ? { ...form, ...details } : form
                    )
                }));
            }

            return { success: true, message: "Form updated successfully" };
        } catch (error) {
            console.error("Error updating form details:", error);
            return { success: false, message: error.message || "An unexpected error occurred" };
        }
    },



    markFormCompleted: async (formId, formData) => {
        try {
            if (!formId) {
                return {
                    success: false,
                    message: "Form ID is required",
                };
            }

            // Include formUpdated: true in the data being sent
            const dataToUpdate = {
                ...formData,
                formUpdated: true
            };

            const response = await fetch(`/api/technician/completeform/${formId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToUpdate),
            });

            if (!response.ok) {
                const errorText = await response.text();
                try {
                    const errorData = JSON.parse(errorText);
                    return {
                        success: false,
                        message: errorData.message || `Failed to mark as completed (${response.status})`,
                    };
                } catch (parseError) {
                    return {
                        success: false,
                        message: `Server error (${response.status})`,
                    };
                }
            }

            const data = await response.json();

            // Remove the form from pending forms
            set((state) => {
                const updatedForms = state.pendingForms.filter(form => form._id !== formId);
                return { pendingForms: updatedForms };
            });

            // Try to update the completed forms store if available
            try {
                const completedFormsStore = useCompletedFormsStore.getState();
                if (completedFormsStore && completedFormsStore.addCompletedForm) {
                    completedFormsStore.addCompletedForm(data.data);
                }
            } catch (e) {
                console.warn("Could not update completed forms store:", e);
            }

            return {
                success: true,
                message: "Form marked as completed successfully"
            };
        } catch (error) {
            console.error("Error marking form as completed:", error);
            return {
                success: false,
                message: error.message || "An unexpected error occurred",
            };
        }
    }
}));