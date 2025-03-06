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
            const response = await fetch(`/api/technician/update/${pid}/${fid}`, {
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
            // Ensure formId is defined
            if (!formId) {
                return {
                    success: false,
                    message: "Form ID is required",
                };
            }

            console.log("Updating form details:", formId, details);

            const response = await fetch(`/api/technician/updateform/${formId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(details),
            });

            // Handle non-JSON responses more gracefully
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
                        message: `Server error (${response.status})`,
                    };
                }
            }

            const data = await response.json();
            console.log("Update response:", data);

            // Update local state with the updated form data
            set((state) => {
                const updatedForms = state.pendingForms.map((form) => {
                    if (form._id === formId) {
                        // Find the product to update
                        const updatedProducts = form.products.map(product => {
                            if (product._id === details.productId) {
                                return { ...product, ...details };
                            }
                            return product;
                        });

                        return {
                            ...form,
                            products: updatedProducts
                        };
                    }
                    return form;
                });

                return { pendingForms: updatedForms };
            });

            return {
                success: true,
                message: "Form updated successfully"
            };
        } catch (error) {
            console.error("Error updating form details:", error);
            return {
                success: false,
                message: error.message || "An unexpected error occurred",
            };
        }
    }
}));