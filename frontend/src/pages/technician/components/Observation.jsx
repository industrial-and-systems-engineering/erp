import React, { useEffect } from 'react';
import { useState } from 'react';

const Observation = ({ product, addNew, save, close }) => {
    // Form data
    const [formData, setFormData] = useState({
        ducDetails: "Enter DUC details",
        dateOfMeasurement: new Date().toLocaleDateString(),
        masterAccuracy: "Enter master accuracy",
        masterCertUncertainty: "Enter master cert. uncertainty",
        ducResolution: "Enter DUC resolution",
        masterResolution: "Enter master resolution",
        rName: "Enter reading parameter",
        rUnit: "Enter unit",
        observations: [],
        mean: "0",
        standartDeviation: "0",
        uncertainty: "0",
        stdUncertainty: "0",
        stdUncertaintyPercent: "0"
    });

    // Calculated values
    const calculateMean = () => {
        if (formData.observations.length === 0) return 0;
        const sum = formData.observations.reduce((acc, obs) => acc + Number(obs || 0), 0);
        return (sum / formData.observations.length).toFixed(2);
    };

    const calculateStdDev = () => {
        if (formData.observations.length <= 1) return 0;
        const mean = calculateMean();
        const squaredDiffs = formData.observations.map(obs =>
            Math.pow(Number(obs || 0) - mean, 2)
        );
        const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / (formData.observations.length - 1);
        return Math.sqrt(variance).toFixed(10);
    };

    const calculateStdUncertainty = () => {
        const stdDev = calculateStdDev();
        return (stdDev / Math.sqrt(formData.observations.length)).toFixed(1);
    };

    const calculateStdUncertaintyPercent = () => {
        const mean = calculateMean();
        const uncertainty = calculateStdUncertainty();
        return ((uncertainty * 100) / mean).toFixed(10);
    };

    // Update form data with calculated values
    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            mean: calculateMean(),
            standartDeviation: calculateStdDev(),
            stdUncertainty: calculateStdUncertainty(),
            stdUncertaintyPercent: calculateStdUncertaintyPercent()
        }));
    }, [formData.observations]);

    // Update form data
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Update observation
    const handleObservationChange = (id, value) => {
        const updatedObservations = formData.observations.map((obs, index) =>
            index === id ? value : obs
        );
        setFormData({
            ...formData,
            observations: updatedObservations
        });
    };

    // Add new observation row
    const addObservation = () => {
        const newId = formData.observations.length > 0
            ? Math.max(...formData.observations.map(o => o.id)) + 1
            : 1;
        setFormData({
            ...formData,
            observations: [
                ...formData.observations,
                "0"
            ]
        });
    };

    // Remove observation row
    const removeObservation = (id) => {
        setFormData({
            ...formData,
            observations: formData.observations.filter((obs, index) => index !== id)
        });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-gradient-to-b from-gray-50 to-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Reading Form</h1>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8 border border-gray-200">
                {/* Header Information */}
                <div className="grid grid-cols-2">
                    <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200">Job No.</div>
                    <div className="bg-yellow-50 p-4 border-b border-gray-200">
                        <input
                            type="text"
                            name="jobNo"
                            value={product.jobNo}
                            disabled
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2">
                    <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200">DUC details.SI no.</div>
                    <div className="bg-yellow-50 p-4 border-b border-gray-200">
                        <input
                            type="text"
                            name="ducDetails"
                            value={formData.ducDetails}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2">
                    <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200">Parameter:</div>
                    <div className="bg-yellow-50 p-4 border-b border-gray-200">
                        <input
                            type="text"
                            name="parameter"
                            value={product.parameter}
                            disabled
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                        />
                    </div>
                </div>

                {/* Voltage Input and Unit Selection */}
                <div className="grid grid-cols-2">
                    <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200">Reading Parameter:</div>
                    <div className="bg-yellow-50 p-4 border-b border-gray-200">
                        <div className="flex">
                            <input
                                type="text"
                                name="rName"
                                value={formData.rName}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                                placeholder="Enter voltage value"
                            />
                            <input
                                type="text"
                                name="rUnit"
                                value={formData.rUnit}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2">
                    <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200">Date of Measurement:</div>
                    <div className="bg-yellow-50 p-4 border-b border-gray-200">
                        <input
                            type="date"
                            name="dateOfMeasurement"
                            value={formData.dateOfMeasurement}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2">
                    <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200">Master Accuracy</div>
                    <div className="bg-yellow-50 p-4 text-right border-b border-gray-200">
                        <input
                            type="text"
                            name="masterAccuracy"
                            value={formData.masterAccuracy}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2">
                    <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200">Master cert. uncertainty</div>
                    <div className="bg-yellow-50 p-4 text-right border-b border-gray-200">
                        <input
                            type="text"
                            name="masterCertUncertainty"
                            value={formData.masterCertUncertainty}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2">
                    <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200">DUC Resolution</div>
                    <div className="bg-yellow-50 p-4 text-right border-b border-gray-200">
                        <input
                            type="text"
                            name="ducResolution"
                            value={formData.ducResolution}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2">
                    <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200">Master resolution</div>
                    <div className="bg-yellow-50 p-4 border-b border-gray-200">
                        <input
                            type="text"
                            name="masterResolution"
                            value={formData.masterResolution}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2">
                    <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200">Range</div>
                    <div className="bg-yellow-50 p-4 border-b border-gray-200">
                        <input
                            type="text"
                            name="ranges"
                            value={product.ranges}
                            disabled
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                        />
                    </div>
                </div>

                <div className="bg-purple-100 p-4 font-semibold text-purple-700 border-b border-gray-200">Type-A Uncertainty</div>

                {/* Observation Readings */}
                <div className="grid grid-cols-2">
                    <div className="bg-indigo-100 p-4 font-medium text-indigo-800 border-b border-r border-gray-200">No. of. Obs.</div>
                    <div className="bg-indigo-100 p-4 font-medium text-indigo-800 border-b border-gray-200">
                        <div className="flex justify-between">
                            <span>DUC Reading</span>
                            <span>{formData.rUnit}</span>
                        </div>
                    </div>
                </div>

                {formData.observations.map((obs, index) => (
                    <div key={index} className="grid grid-cols-2">
                        <div className="bg-indigo-50 p-4 border-b border-r border-gray-200">
                            <input
                                type="text"
                                value={"M" + (1 + index)}
                                disabled
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                            />
                        </div>
                        <div className="bg-yellow-50 p-4 border-b border-gray-200">
                            <div className="flex">
                                <input
                                    type="text"
                                    value={obs}
                                    onChange={(e) => handleObservationChange(index, e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-right text-red-500 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                                />
                                <button
                                    onClick={() => removeObservation(index)}
                                    className="ml-2 bg-red-500 hover:bg-red-600 text-white px-3 rounded-lg transition duration-200 flex items-center justify-center"
                                    title="Remove observation"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="p-4 text-center border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={addObservation}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition duration-200 shadow-sm flex items-center mx-auto"
                    >
                        <span className="mr-1">+</span> Add Observation
                    </button>
                </div>

                {/* Calculation Results */}
                <div className="mt-6 bg-gray-50">
                    <div className="grid grid-cols-2">
                        <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-t border-b border-r border-gray-200 flex items-center">
                            <div>
                                Mean =
                                <div className="text-xs italic text-indigo-500 mt-1">x = Σxi/n</div>
                            </div>
                        </div>
                        <div className="p-4 text-right border-t border-b border-gray-200 bg-white font-medium">
                            {calculateMean()} <span className="text-gray-500 text-sm">{formData.unit}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2">
                        <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200 flex items-center">
                            <div>
                                Standard Deviation
                                <div className="text-xs italic text-indigo-500 mt-1">s = √[Σ(xi-x)²/(n-1)]</div>
                            </div>
                        </div>
                        <div className="p-4 text-right border-b border-gray-200 bg-white font-medium">
                            {calculateStdDev()} <span className="text-gray-500 text-sm">{formData.unit}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2">
                        <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200">Std Uncertainty Ur (S/√n) =</div>
                        <div className="p-4 text-right border-b border-gray-200 bg-white font-medium">
                            {calculateStdUncertainty()} <span className="text-gray-500 text-sm">{formData.unit}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2">
                        <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200">Std Uncertainty Ur % (Ur*100/Mean) =</div>
                        <div className="p-4 text-right border-b border-gray-200 bg-white font-medium">{calculateStdUncertaintyPercent()} %</div>
                    </div>

                    <div className="grid grid-cols-2">
                        <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200">Nos of Reading = n</div>
                        <div className="p-4 text-right border-b border-gray-200 bg-white font-medium">{formData.observations.length}</div>
                    </div>

                    <div className="grid grid-cols-2">
                        <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200">Degree of Freedom Vi= (n-1)</div>
                        <div className="p-4 text-right border-b border-gray-200 bg-white font-medium">{formData.observations.length - 1}</div>
                    </div>
                </div>
            </div>
            {/* <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200"> */}
            {/* <h2 className="font-bold mb-3 text-gray-700">Current Form State:</h2>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <pre className="text-xs overflow-auto max-h-64 text-gray-700">
                        {JSON.stringify(formData, null, 2)}
                    </pre>
                </div> */}
            <div className="flex justify-end mt-4">
                <button
                    onClick={() => { save(formData) }}
                    className="m-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition duration-200 shadow-sm"
                >
                    Save
                </button>
                <button className="m-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition duration-200 shadow-sm" onClick={() => close(false)} >Close</button>
            </div>
        </div>
    );
};

export default Observation;