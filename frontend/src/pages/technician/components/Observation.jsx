import React, { useEffect } from 'react';
import { useState } from 'react';

const Observation = ({ product, save, close }) => {
    // Form data
    const [formData, setFormData] = useState({
        ducDetails: "",
        dateOfMeasurement: new Date().toLocaleDateString(),
        masterAccuracy: "",
        masterCertUncertainty: "",
        ducResolution: "",
        masterResolution: "",
        rName: "",
        rUnit: "",
        observations: [],
        //type-a
        mean: "",
        standartDeviation: "",
        uncertainty: "",
        stdUncertainty: "",
        stdUncertaintyPercent: "",
        //type-b
        u1: "",
        u2: "",
        u3: "",
        //u5
        stability: "",
        u5: "",
        uc: "",
        eDof: "",
        kAt95CL: "",
        ue: "",
        uePercentage: "",
        uePercentageFilled: "",
        result: "",
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

    const calculateU1 = () => {
        const masterCertUncertainty = formData.masterCertUncertainty;
        const k = 2;
        return (masterCertUncertainty / k).toFixed(4);
    };
    const calculateU2 = () => {
        const ducResolution = formData.ducResolution;
        return ((ducResolution / 1.732050808) / 2).toFixed(4);
    };
    const calculateU3 = () => {
        const masterAccuracy = formData.masterAccuracy;
        return (masterAccuracy / 1.732050808).toFixed(4);
    };
    const calculateU5 = () => {
        const stability = formData.stability;
        return (stability / 1.732050808).toFixed(4);
    };
    const calculateUC = () => {
        const u1 = calculateU1();
        const u2 = calculateU2();
        const u3 = calculateU3();
        const u5 = calculateU5();
        const stdUncertainty = calculateStdUncertainty();
        return (Math.sqrt(Math.pow(stdUncertainty, 2) + Math.pow(u1, 2) + Math.pow(u2, 2) + Math.pow(u3, 2) + Math.pow(u5, 2))).toFixed(10);
    };
    const calculateEDof = () => {
        const stdUncertainty = calculateStdUncertainty();
        const CombinedUncertainty = calculateUC();
        return (4 * (Math.pow(CombinedUncertainty, 4) / Math.pow(stdUncertainty, 4))).toFixed(1);
    };

    const calculateUE = () => {
        const uc = calculateUC();
        const kAt95CL = 2;
        return (uc * kAt95CL).toFixed(1);
    };
    const calculateUEPercentage = () => {
        const mean = calculateMean();
        const ue = calculateUE();
        return ((ue * 100) / mean).toFixed(10);
    };
    const calculateResult = () => {
        const mean = calculateMean();
        const ue = calculateUE();
        return (`${mean} ± ${ue}`);
    };
    // Update form data with calculated values
    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            mean: calculateMean(),
            standartDeviation: calculateStdDev(),
            stdUncertainty: calculateStdUncertainty(),
            stdUncertaintyPercent: calculateStdUncertaintyPercent(),
            u1: calculateU1(),
            u2: calculateU2(),
            u3: calculateU3(),
            u5: calculateU5(),
            uc: calculateUC(),
            eDof: calculateEDof(),
            ue: calculateUE(),
            uePercentage: calculateUEPercentage(),
            result: calculateResult()
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
                            placeholder='Enter DUC details'
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
                                placeholder="Enter unit"
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
                            placeholder='Enter Date of Measurement'
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2">
                    <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200">Master Accuracy</div>
                    <div className="bg-yellow-50 p-4 border-b border-gray-200">
                        <input
                            type="text"
                            name="masterAccuracy"
                            value={formData.masterAccuracy}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lgfocus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                            placeholder='Enter Master Accuracy'
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2">
                    <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200">Master cert. uncertainty</div>
                    <div className="bg-yellow-50 p-4  border-b border-gray-200">
                        <input
                            type="text"
                            name="masterCertUncertainty"
                            value={formData.masterCertUncertainty}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg  focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                            placeholder='Enter Master cert. uncertainty'
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2">
                    <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200">DUC Resolution</div>
                    <div className="bg-yellow-50 p-4  border-b border-gray-200">
                        <input
                            type="text"
                            name="ducResolution"
                            value={formData.ducResolution}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                            placeholder='Enter DUC Resolution'
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
                            placeholder='Enter Master resolution'
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
                                    placeholder='Enter observation'
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
                            {calculateMean()} <span className="text-gray-500 text-sm">{formData.rUnit}</span>
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
                            {calculateStdDev()} <span className="text-gray-500 text-sm">{formData.rUnit}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2">
                        <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200">Std Uncertainty Ur (S/√n) =</div>
                        <div className="p-4 text-right border-b border-gray-200 bg-white font-medium">
                            {calculateStdUncertainty()} <span className="text-gray-500 text-sm">{formData.rUnit}</span>
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

                {/* Type - B uncertainity*/}
                <div className="bg-purple-100 p-4 font-semibold text-purple-700 border-b border-gray-200">Type-B Uncertainty</div>
                <div className="mt-6 bg-gray-50">
                    <div className="border-b border-gray-200 py-2">
                        <h2 className="text-lg font-semibold text-gray-800 text-center">U1</h2>
                        <div className="grid grid-cols-2">
                            <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-t border-b border-r border-gray-200 flex items-center">
                                <div>
                                    Uncertainty in Masters Certificate
                                </div>
                            </div>
                            <div className="p-4 text-right border-t border-b border-gray-200 bg-white font-medium">
                                {formData.masterCertUncertainty} <span className="text-gray-500 text-sm">{formData.rUnit}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-t border-b border-r border-gray-200 flex items-center">
                                <div>
                                    Coverage factor (k) =
                                </div>
                            </div>
                            <div className="p-4 text-right border-t border-b border-gray-200 bg-white font-medium">
                                {2} <span className="text-gray-500 text-sm">{formData.rUnit}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2">
                            <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200 flex items-center">
                                <div>
                                    Standard Uncertainty  U1 (Uc/K)
                                </div>
                            </div>
                            <div className="p-4 text-right border-b border-gray-200 bg-white font-medium">
                                {calculateU1()} <span className="text-gray-500 text-sm">{formData.rUnit}</span>
                            </div>
                        </div>
                    </div>
                    <div className="border-b border-gray-200 py-2">
                        <h2 className="text-lg font-semibold text-gray-800 text-center">U2</h2>
                        <div className="grid grid-cols-2">
                            <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-t border-b border-r border-gray-200 flex items-center">
                                <div>
                                    Resolution of DUC
                                </div>
                            </div>
                            <div className="p-4 text-right border-t border-b border-gray-200 bg-white font-medium">
                                {formData.ducResolution} <span className="text-gray-500 text-sm">{formData.rUnit}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-t border-b border-r border-gray-200 flex items-center">
                                <div>
                                    Uncertainty U2
                                </div>
                            </div>
                            <div className="p-4 text-right border-t border-b border-gray-200 bg-white font-medium">
                                {calculateU2()} <span className="text-gray-500 text-sm">{formData.rUnit}</span>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-200 py-2">
                        <h2 className="text-lg font-semibold text-gray-800 text-center">U3</h2>
                        <div className="grid grid-cols-2">
                            <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-t border-b border-r border-gray-200 flex items-center">
                                <div>
                                    Accuracy of master
                                </div>
                            </div>
                            <div className="p-4 text-right border-t border-b border-gray-200 bg-white font-medium">
                                {formData.masterAccuracy} <span className="text-gray-500 text-sm">{formData.rUnit}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-t border-b border-r border-gray-200 flex items-center">
                                <div>
                                    Uncertainty U3
                                </div>
                            </div>
                            <div className="p-4 text-right border-t border-b border-gray-200 bg-white font-medium">
                                {calculateU3()} <span className="text-gray-500 text-sm">{formData.rUnit}</span>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-200 py-2">
                        <h2 className="text-lg font-semibold text-gray-800 text-center">U5</h2>
                        <div className="grid grid-cols-2">
                            <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-t border-b border-r border-gray-200 flex items-center">
                                <div>
                                    Stability
                                </div>
                            </div >
                            <div className="bg-yellow-50 p-4 text-right border-b border-gray-200">
                                <input
                                    type="text"
                                    name="stability"
                                    value={formData.stability}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                                    placeholder='Enter Stability'
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-t border-b border-r border-gray-200 flex items-center">
                                <div>
                                    Uncertainty U5
                                </div>
                            </div>
                            <div className="p-4 text-right border-t border-b border-gray-200 bg-white font-medium">
                                {calculateU5()} <span className="text-gray-500 text-sm">{formData.rUnit}</span>
                            </div>
                        </div>
                    </div>


                    <div className="grid grid-cols-2">
                        <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-t border-b border-r border-gray-200 flex items-center">
                            <div>
                                Combined Uncertainty UC
                            </div>
                        </div>
                        <div className="p-4 text-right border-t border-b border-gray-200 bg-white font-medium">
                            {calculateUC()} <span className="text-gray-500 text-sm">{formData.rUnit}</span>
                        </div>
                    </div>


                    <div className="grid grid-cols-2">
                        <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200">Effective Degrees of Freedom</div>
                        <div className="p-4 text-right border-b border-gray-200 bg-white font-medium">
                            {calculateEDof()} <span className="text-gray-500 text-sm">{formData.rUnit}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2">
                        <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200">So, K at 95.5% confidence level=</div>
                        {(calculateEDof() > 30) ? <div className="p-4 text-right border-b border-gray-200 bg-white font-medium">2</div> :
                            <div className="bg-yellow-50 p-4 text-right border-b border-gray-200">
                                <input
                                    type="text"
                                    name="kAt95CL"
                                    value={formData.kAt95CL}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                                    placeholder='Enter K at 95.5% confidence level'
                                />
                            </div>}
                    </div>
                    <div className="border-b border-gray-200 py-2">
                        <div className="grid grid-cols-3">
                            <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200">Expanded Uncertainty</div>
                            <div className="p-4 text-right border-b border-gray-200 bg-white font-medium">{calculateUE()}</div>
                            <div className="p-4 text-right border-b border-l border-gray-200 bg-white font-medium">{calculateUEPercentage()}%</div>
                        </div>

                        <div className="grid grid-cols-3">
                            <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200">Ue= Combined Uncertainty*K </div>
                            <div className="p-4 text-right border-b border-gray-200 bg-white font-medium">{calculateUE()}</div>
                            <div className="bg-yellow-50 p-4 text-right border-b border-gray-200">
                                <input
                                    type="text"
                                    name="uePercentageFilled"
                                    value={formData.uePercentageFilled}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="bg-indigo-50 p-4 font-medium text-indigo-700 border-b border-r border-gray-200">Result </div>
                        <div className="p-4 text-right border-b border-gray-200 bg-white font-medium">{formData.result}</div>
                    </div>

                </div>
            </div>
            {/* <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h2 className="font-bold mb-3 text-gray-700">Current Form State:</h2>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <pre className="text-xs overflow-auto max-h-64 text-gray-700">
                        {JSON.stringify(formData, null, 2)}
                    </pre>
                </div>
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