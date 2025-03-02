import React from 'react'
import { useEffect } from 'react';
import Tcard from '../../components/EquipmentCard/Tcard';
import { usePendingFormsStore } from '../../utils/pendingForms';

const Tpending = () => {

    const { pendingForms, fetchPendingForms } = usePendingFormsStore();
    useEffect(() => {
        console.log(pendingForms)
        fetchPendingForms();
    }, [fetchPendingForms]);

    return (
        <div className="container">
            <h1 className="text-2xl font-bold my-10 mb-4 text-center">Pending Equipments</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingForms.map(equipment => (
                    <div key={equipment._id} className="bg-white shadow-md rounded-lg p-4">
                        <Tcard equipment={equipment} />
                    </div>
                ))}
            </div>
        </div>

    );
}

export default Tpending;
