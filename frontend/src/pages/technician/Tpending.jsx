import React, { useState } from 'react';
import { useEffect } from 'react';
import Tcard from '../../components/EquipmentCard/Tcard';
import { usePendingFormsStore } from '../../utils/pendingForms';
import { set } from 'mongoose';

const Tpending = () => {
    const { pendingForms, fetchPendingForms } = usePendingFormsStore();
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [selectedForm, setSelectedForm] = useState(null);

    useEffect(() => {
        fetchPendingForms();
    }, [fetchPendingForms]);

    const toggleEquipmentDetails = (equipment, form) => {
        if (selectedEquipment && selectedEquipment._id === equipment._id) {
            setSelectedEquipment(null);
            setSelectedForm(null);
        } else {
            setSelectedEquipment(equipment);
            setSelectedForm(form);
        }
    };

    return (
        <div className="container">
            <h1 className="text-2xl font-bold my-10 mb-4 text-center">Pending Equipments</h1>

            {pendingForms && pendingForms.length > 0 ? (
                <div className="space-y-2 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 col-span-1">
                        {pendingForms.map((form) => (
                            form.products.map((product) => (
                                <div key={product._id} className="bg-white p-4 grid grid-cols-2 boarder-2 rounded-lg shadow-md">
                                    <p className="text-gray-700">Job No.: {product.jobNo}</p>

                                    <button
                                        className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700"
                                        onClick={() => toggleEquipmentDetails(product, form)}
                                    >
                                        {selectedEquipment && selectedEquipment._id === product._id
                                            ? 'Hide Details'
                                            : 'Show Details'}
                                    </button>

                                </div>
                            ))))}
                    </div>
                    <div className="col-span-2">
                        {selectedEquipment && (
                            <div className="mt-4 p-4 rounded-lg shadow-md w-full">
                                <Tcard equipment={selectedEquipment} form={selectedForm} />
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 text-center">No pending equipments found.</p>
            )}
        </div>
    );
};

export default Tpending;