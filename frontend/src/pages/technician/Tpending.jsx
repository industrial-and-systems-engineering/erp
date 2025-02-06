import React from 'react'
import { useEffect } from 'react';
import { usePendingEquipmentsStore } from '../../utils/pendingEquipments';
import Tcard from '../../components/EquipmentCard/Tcard';

const Tpending = () => {

    const { pendingEquipments, fetchPendingEquipments } = usePendingEquipmentsStore();
    useEffect(() => {
        console.log(pendingEquipments)
        fetchPendingEquipments();
    }, [fetchPendingEquipments]);

    return (
        <div className="container mx-auto mt-8 p-10  ">
            <h1 className="text-2xl font-bold mb-4 text-center">Pending Equipments</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingEquipments.map(equipment => (
                    <div key={equipment._id} className="bg-white shadow-md rounded-lg p-4">
                        <Tcard equipment={equipment} />
                    </div>
                ))}
            </div>
        </div>

    );
}

export default Tpending;
