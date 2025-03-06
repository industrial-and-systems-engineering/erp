import React, { useState, useEffect } from 'react';
import { usePendingFormsStore } from './utils/pendingFroms';

const Tpending = () => {
    const { pendingForms, fetchPendingForms, updateFormDetails } = usePendingFormsStore();
    const [selectedForm, setSelectedForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productChanges, setProductChanges] = useState({});

    useEffect(() => {
        const loadForms = async () => {
            try {
                setLoading(true);
                await fetchPendingForms();
            } catch (err) {
                setError("Failed to load pending forms");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadForms();
    }, [fetchPendingForms]);
    const toggleFormDetails = (form) => {
        setSelectedForm(prevForm =>
            prevForm && prevForm._id === form._id ? null : form
        );
        // Reset editing state when changing forms
        setEditingProduct(null);
        setProductChanges({});
    };

    const startEditing = (product) => {
        setEditingProduct(product._id);
        setProductChanges({
            conditionOfProduct: product.conditionOfProduct,
            itemEnclosed: product.itemEnclosed,
            specialRequest: product.specialRequest,
            decisionRules: product.decisionRules || {},
            calibrationPeriodicity: product.calibrationPeriodicity,
            reviewRequest: product.reviewRequest,
            calibrationFacilityAvailable: product.calibrationFacilityAvailable,
            calibrationServiceDoneByExternalAgency: product.calibrationServiceDoneByExternalAgency,
            calibrationMethodUsed: product.calibrationMethodUsed
        });
    };

    const cancelEditing = () => {
        setEditingProduct(null);
        setProductChanges({});
    };

    const handleInputChange = (field, value) => {
        setProductChanges(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCheckboxChange = (rule, checked) => {
        setProductChanges(prev => ({
            ...prev,
            decisionRules: {
                ...prev.decisionRules,
                [rule]: checked
            }
        }));
    };

    const saveProductChanges = async (formId, productId) => {
        try {
            // This would be an API call to update the product
            const response = await updateFormDetails(formId, productChanges);

            if (response.success) {
                alert("Form updated successfully");
            }
            else {
                alert("Failed to update form: " + response.message);
            }
            // Update the local state with the changes
            setSelectedForm(prevForm => {
                if (!prevForm) return null;

                return {
                    ...prevForm,
                    products: prevForm.products.map(prod =>
                        prod._id === productId ? { ...prod, ...productChanges } : prod
                    )
                };
            });

            // Exit edit mode
            setEditingProduct(null);
            setProductChanges({});
        } catch (err) {
            console.error("Failed to update product", err);
            setError("Failed to update product details");
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    if (error) {
        return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto max-w-4xl my-4">
            <p>{error}</p>
        </div>;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold my-6 mb-4 text-center">Pending SRF Forms</h1>

            {pendingForms.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 bg-gray-50 p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-3 pb-2 border-b">SRF Forms</h2>
                        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                            {pendingForms.map((form) => (
                                <div
                                    key={form._id}
                                    className={`p-4 rounded-lg shadow-sm cursor-pointer transition-all
                                        ${selectedForm && selectedForm._id === form._id
                                            ? 'bg-blue-100 border-l-4 border-blue-500'
                                            : 'bg-white hover:bg-gray-50'}`}
                                    onClick={() => toggleFormDetails(form)}
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-medium">SRF #{form.srfNo || 'N/A'}</h3>
                                        <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                                            {new Date(form.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-1">Contact: {form.contactPersonName || 'N/A'}</p>
                                    <p className="text-sm text-gray-600">Products: {form.products?.length || 0}</p>
                                    <button
                                        className={`mt-2 w-full p-2 rounded text-sm font-medium transition-colors text-white
                                            ${selectedForm && selectedForm._id === form._id
                                                ? 'bg-gray-500 hover:bg-gray-600'
                                                : 'bg-blue-500 hover:bg-blue-600'}`}
                                    >
                                        {selectedForm && selectedForm._id === form._id
                                            ? 'Hide Details'
                                            : 'View Details'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        {selectedForm ? (
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="border-b pb-4 mb-4">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold">SRF #{selectedForm.srfNo}</h2>
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm">
                                            {selectedForm.requestStatus === false ? "Pending" : "Completed"}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <h3 className="text-lg font-medium mb-2">Customer Details</h3>
                                            <p><span className="font-medium">Organization:</span> {selectedForm.organization || 'N/A'}</p>
                                            <p><span className="font-medium">Address:</span> {selectedForm.address || 'N/A'}</p>
                                            <p><span className="font-medium">Contact Person:</span> {selectedForm.contactPersonName || 'N/A'}</p>
                                            <p><span className="font-medium">Mobile:</span> {selectedForm.mobileNumber || 'N/A'}</p>
                                            <p><span className="font-medium">Telephone:</span> {selectedForm.telephoneNumber || 'N/A'}</p>
                                            <p><span className="font-medium">Email:</span> {selectedForm.emailId || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium mb-2">Form Details</h3>
                                            <p><span className="font-medium">SRF ID:</span> {selectedForm._id}</p>
                                            <p><span className="font-medium">URL Number:</span> {selectedForm.URL_NO || 'N/A'}</p>
                                            <p><span className="font-medium">Submission Date:</span> {new Date(selectedForm.date).toLocaleString()}</p>
                                            <p><span className="font-medium">Probable Date:</span> {new Date(selectedForm.probableDate).toLocaleString()}</p>
                                            <p><span className="font-medium">Created At:</span> {new Date(selectedForm.createdAt).toLocaleString()}</p>
                                            <p><span className="font-medium">Updated At:</span> {new Date(selectedForm.updatedAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-3">Products</h3>
                                    {selectedForm.products && selectedForm.products.length > 0 ? (
                                        <div className="space-y-4">
                                            {selectedForm.products.map((product, index) => (
                                                <div key={product._id} className="border rounded-lg p-4 bg-gray-50">
                                                    <h4 className="font-medium text-lg border-b pb-2 mb-3">
                                                        Product #{index + 1} <span className="text-gray-500 text-sm ml-2">ID: {product._id}</span>
                                                    </h4>

                                                    {editingProduct === product._id ? (
                                                        // Editing mode
                                                        <div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                                <div className="space-y-3">
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Condition of Product</label>
                                                                        <select
                                                                            className="w-full border-gray-300 rounded-md shadow-sm p-2"
                                                                            value={productChanges.conditionOfProduct}
                                                                            onChange={(e) => handleInputChange('conditionOfProduct', e.target.value)}
                                                                        >
                                                                            <option value="">Select condition</option>
                                                                            <option value="good">Good</option>
                                                                            <option value="average">Average</option>
                                                                            <option value="poor">Poor</option>
                                                                        </select>
                                                                    </div>

                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Items Enclosed</label>
                                                                        <input
                                                                            type="text"
                                                                            className="w-full border-gray-300 rounded-md shadow-sm p-2"
                                                                            value={productChanges.itemEnclosed}
                                                                            onChange={(e) => handleInputChange('itemEnclosed', e.target.value)}
                                                                        />
                                                                    </div>

                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Special Request</label>
                                                                        <textarea
                                                                            className="w-full border-gray-300 rounded-md shadow-sm p-2"
                                                                            value={productChanges.specialRequest}
                                                                            onChange={(e) => handleInputChange('specialRequest', e.target.value)}
                                                                            rows="2"
                                                                        ></textarea>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-3">
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Calibration Periodicity</label>
                                                                        <select
                                                                            className="w-full border-gray-300 rounded-md shadow-sm p-2"
                                                                            value={productChanges.calibrationPeriodicity}
                                                                            onChange={(e) => handleInputChange('calibrationPeriodicity', e.target.value)}
                                                                        >
                                                                            <option value="">Select periodicity</option>
                                                                            <option value="daily">Daily</option>
                                                                            <option value="weekly">Weekly</option>
                                                                            <option value="monthly">Monthly</option>
                                                                            <option value="quarterly">Quarterly</option>
                                                                            <option value="yearly">Yearly</option>
                                                                        </select>
                                                                    </div>

                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Review Request</label>
                                                                        <input
                                                                            type="text"
                                                                            className="w-full border-gray-300 rounded-md shadow-sm p-2"
                                                                            value={productChanges.reviewRequest}
                                                                            onChange={(e) => handleInputChange('reviewRequest', e.target.value)}
                                                                        />
                                                                    </div>

                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Calibration Facility</label>
                                                                        <select
                                                                            className="w-full border-gray-300 rounded-md shadow-sm p-2"
                                                                            value={productChanges.calibrationFacilityAvailable}
                                                                            onChange={(e) => handleInputChange('calibrationFacilityAvailable', e.target.value)}
                                                                        >
                                                                            <option value="">Select facility</option>
                                                                            <option value="lab">Lab</option>
                                                                            <option value="onsite">Onsite</option>
                                                                            <option value="external">External</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-3">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">External Calibration</label>
                                                                    <select
                                                                        className="w-full border-gray-300 rounded-md shadow-sm p-2"
                                                                        value={productChanges.calibrationServiceDoneByExternalAgency}
                                                                        onChange={(e) => handleInputChange('calibrationServiceDoneByExternalAgency', e.target.value)}
                                                                    >
                                                                        <option value="">Select option</option>
                                                                        <option value="yes">Yes</option>
                                                                        <option value="no">No</option>
                                                                    </select>
                                                                </div>

                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Calibration Method</label>
                                                                    <input
                                                                        type="text"
                                                                        className="w-full border-gray-300 rounded-md shadow-sm p-2"
                                                                        value={productChanges.calibrationMethodUsed}
                                                                        onChange={(e) => handleInputChange('calibrationMethodUsed', e.target.value)}
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Decision Rules</label>
                                                                    <div className="space-y-2">
                                                                        <div className="flex items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                id={`noDecision-${product._id}`}
                                                                                className="mr-2"
                                                                                checked={productChanges.decisionRules?.noDecision || false}
                                                                                onChange={(e) => handleCheckboxChange('noDecision', e.target.checked)}
                                                                            />
                                                                            <label htmlFor={`noDecision-${product._id}`}>No Decision</label>
                                                                        </div>

                                                                        <div className="flex items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                id={`simpleConformative-${product._id}`}
                                                                                className="mr-2"
                                                                                checked={productChanges.decisionRules?.simpleConformative || false}
                                                                                onChange={(e) => handleCheckboxChange('simpleConformative', e.target.checked)}
                                                                            />
                                                                            <label htmlFor={`simpleConformative-${product._id}`}>Simple Conformative</label>
                                                                        </div>

                                                                        <div className="flex items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                id={`conditionalConformative-${product._id}`}
                                                                                className="mr-2"
                                                                                checked={productChanges.decisionRules?.conditionalConformative || false}
                                                                                onChange={(e) => handleCheckboxChange('conditionalConformative', e.target.checked)}
                                                                            />
                                                                            <label htmlFor={`conditionalConformative-${product._id}`}>Conditional Conformative</label>
                                                                        </div>

                                                                        <div className="flex items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                id={`customerDrivenConformative-${product._id}`}
                                                                                className="mr-2"
                                                                                checked={productChanges.decisionRules?.customerDrivenConformative || false}
                                                                                onChange={(e) => handleCheckboxChange('customerDrivenConformative', e.target.checked)}
                                                                            />
                                                                            <label htmlFor={`customerDrivenConformative-${product._id}`}>Customer Driven Conformative</label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="mt-4 flex justify-end space-x-3">
                                                                <button
                                                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg text-sm"
                                                                    onClick={cancelEditing}
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                                                                    onClick={() => saveProductChanges(selectedForm._id, product._id)}
                                                                >
                                                                    Save Changes
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        // View mode
                                                        <div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <p><span className="font-medium">Condition:</span> {product.conditionOfProduct || 'N/A'}</p>
                                                                    <p><span className="font-medium">Items Enclosed:</span> {product.itemEnclosed || 'N/A'}</p>
                                                                    <p><span className="font-medium">Special Request:</span> {product.specialRequest || 'None'}</p>

                                                                    {product.decisionRules && (
                                                                        <div className="mt-2">
                                                                            <p className="font-medium">Decision Rules:</p>
                                                                            <ul className="list-disc pl-5 mt-1 text-sm">
                                                                                {product.decisionRules.noDecision && <li>No Decision</li>}
                                                                                {product.decisionRules.simpleConformative && <li>Simple Conformative</li>}
                                                                                {product.decisionRules.conditionalConformative && <li>Conditional Conformative</li>}
                                                                                {product.decisionRules.customerDrivenConformative && <li>Customer Driven Conformative</li>}
                                                                            </ul>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p><span className="font-medium">Calibration Periodicity:</span> {product.calibrationPeriodicity || 'N/A'}</p>
                                                                    <p><span className="font-medium">Review Request:</span> {product.reviewRequest || 'None'}</p>
                                                                    <p><span className="font-medium">Calibration Facility:</span> {product.calibrationFacilityAvailable || 'N/A'}</p>
                                                                    <p><span className="font-medium">External Calibration:</span> {product.calibrationServiceDoneByExternalAgency || 'N/A'}</p>
                                                                    <p><span className="font-medium">Calibration Method:</span> {product.calibrationMethodUsed || 'N/A'}</p>
                                                                </div>
                                                            </div>

                                                            <div className="mt-4 flex justify-end">
                                                                <button
                                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                                                                    onClick={() => startEditing(product)}
                                                                >
                                                                    Edit Product Details
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic">No products found in this form.</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col items-center justify-center text-center">
                                <svg className="w-16 h-16 text-gray-300 mb-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900">No SRF form selected</h3>
                                <p className="mt-1 text-gray-500">Select a form from the list to view all details</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-2xl mx-auto">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <h2 className="text-xl font-medium text-gray-900 mb-2">No pending SRF forms found</h2>
                    <p className="text-gray-500">All forms have been processed or no forms have been submitted yet.</p>
                </div>
            )}
        </div>
    );
};

export default Tpending;