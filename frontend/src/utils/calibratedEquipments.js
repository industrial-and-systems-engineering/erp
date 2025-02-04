import { create } from 'zustand';

export const useCalibratedEquipmentsStore = create((set) => ({
    calibratedEquipments: [],
    setCalibratedEquipments: (calibratedEquipments) => set({ calibratedEquipments }),

    fetchCalibratedEquipments: async () => {
        const response = await fetch('/api/technician/calibrated-equipments');
        const equipments = await response.json();
        set((state) => ({ calibratedEquipments: [...equipments.data] }));
    },
}));