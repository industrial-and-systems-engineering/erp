import { create } from 'zustand';
import { useCalibratedEquipmentsStore } from './calibratedEquipments';

export const usePendingEquipmentsStore = create((set) => ({
    pendingEquipments: [],
    setEquipment: (pendingEquipments) => set({ pendingEquipments }),

    fetchPendingEquipments: async () => {
        const response = await fetch('/api/technician/pending-equipments');
        const equipments = await response.json();
        set({ pendingEquipments: equipments.data });
    },

    updateEquipment: async (id, details) => {
        const response = await fetch(`/api/technician/update-equipment/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(details),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, message: errorData.message || "Failed to update" };
        }

        const data = await response.json();
        const updatedEquipment = data.data;

        set((state) => {
            const { calibratedEquipments, setCalibratedEquipments } = useCalibratedEquipmentsStore.getState();
            setCalibratedEquipments([...calibratedEquipments, updatedEquipment]);

            return {
                pendingEquipments: state.pendingEquipments.filter((equipment) => equipment._id !== id),
            };
        });

        return { success: true, message: "Equipment updated successfully" };
    },
}));