import React from 'react'
import { useEffect } from 'react';
import Tcard from '../../components/EquipmentCard/Tcard';
import { useCalibratedEquipmentsStore } from '../../utils/calibratedEquipments';

const Tpending = () => {

    const { calibratedEquipments, fetchCalibratedEquipments } = useCalibratedEquipmentsStore();

    useEffect(() => {
        console.log(calibratedEquipments)
        fetchCalibratedEquipments();
    }, [fetchCalibratedEquipments]);

    return (
        <div className="container">
            <h1 className="text-2xl font-bold mb-4 my-10 text-center">Calibrated Equipments</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {calibratedEquipments.map(equipment => (
                    <div key={equipment._id} className="bg-white shadow-md rounded-lg p-4">
                        <Tcard equipment={equipment} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Tpending;
