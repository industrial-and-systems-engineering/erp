import React, { useState, useEffect } from 'react';
import CTcard from '../../components/EquipmentCard/CTcard';
import { useCompletedFormsStore } from '../../utils/completedForms';

const Tcompleted = () => {
    const { completedForms, fetchCompletedForms } = useCompletedFormsStore();
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [selectedForm, setSelectedForm] = useState(null);

    useEffect(() => {
        fetchCompletedForms();
    }, []);

    const toggleEquipmentDetails = (product, form) => {
        setSelectedEquipment((prevProduct) =>
            prevProduct && prevProduct._id === product._id ? null : product
        );
        setSelectedForm(form);
    };

    return (
        <div className="container">
            <h1 className="text-2xl font-bold my-10 mb-4 text-center">Calibrated Equipments</h1>

            {completedForms.length > 0 ? (
                <div className="space-y-2 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 col-span-1">
                        {completedForms.map((form) => (
                            form.products.map((product) => (
                                <div key={product._id} className="bg-white p-4 grid grid-cols-2 boarder-2 rounded-lg shadow-md">
                                    <p className="text-gray-700">Job No.: {product.jobNo}</p>
                                    <button
                                        key={product._id}
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
                        {selectedEquipment && selectedForm && (
                            <div className="mt-4 p-4 rounded-lg shadow-md w-full">
                                <CTcard equipment={selectedEquipment} form={selectedForm} />
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 text-center">No calibrated equipments found.</p>
            )}
        </div>
    );
};

export default Tcompleted;
