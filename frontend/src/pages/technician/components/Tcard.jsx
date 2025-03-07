import React, { useEffect, useState } from 'react';
import { usePendingFormsStore } from '../utils/pendingForms';
import Observation from './Observation';

const Tcard = ({ equipment, form, formOpen }) => {
    const { updateForm } = usePendingFormsStore();
    const [result, setResult] = useState({
        calibrationStatus: equipment.calibrationStatus || '',
        calibrationDate: equipment.calibrationDate ? new Date(equipment.calibrationDate).toLocaleDateString() : '',
        remarks: equipment.remarks || '',
    });
    const [obsData, setObsData] = useState({
        mean: equipment.mean, stdDev: equipment.standardDeviation, uncertainty: equipment.uncertainty, observations: equipment.observations,
    });

    const [showObservation, setShowObservation] = useState(false);
    const [formData, setFormData] = useState({
        ulrNo: form.URL_NO || '',
        jobNo: equipment.jobNo || '',
        jobCardIssueDate: form.createdAt ? new Date(form.createdAt).toLocaleDateString() : '',
        srfNo: form.srfNo || '',
        srfDate: form.createdAt ? new Date(form.createdAt).toLocaleDateString() : '',
        itemName: equipment.instrumentDescription || '',
        makeModel: equipment.instrumentDescription || '',
        serialNo: equipment.serialNo || '',
        targetDate: form.probableDate ? new Date(form.probableDate).toLocaleDateString() : '',
        parameters: equipment.parameter || '',
        ranges: equipment.ranges || '',
        accuracy: equipment.accuracy || '',
    });

    useEffect(() => {
        setFormData({
            ulrNo: form.URL_NO || '',
            jobNo: equipment.jobNo || '',
            jobCardIssueDate: form.createdAt ? new Date(form.createdAt).toLocaleDateString() : '',
            srfNo: form.srfNo || '',
            srfDate: form.createdAt ? new Date(form.createdAt).toLocaleDateString() : '',
            itemName: equipment.instrumentDescription || '',
            makeModel: equipment.instrumentDescription || '',
            serialNo: equipment.serialNo || '',
            targetDate: form.probableDate ? new Date(form.probableDate).toLocaleDateString() : '',
            parameters: equipment.parameter || '',
            ranges: equipment.ranges || '',
            accuracy: equipment.accuracy || '',
        });
    }, [equipment, form]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleUpdateClick = async () => {
        const response = await updateForm(form._id, equipment._id, { ...result, ...obsData });

        if (response.success) {
            alert("Form updated successfully");
            formOpen(null);
        } else {
            alert("Failed to update form: " + response.message);
        }
    };

    return (
        <div>
            <div className="bg-gray-100 min-h-screen p-8">
                <div className="max-w-4xl mx-auto bg-white shadow-md rounded p-6">
                    {/* Header Section */}
                    <div className="mb-6 text-center">
                        <div className="grid-cols-2 border-t border-l border-r py-4">
                            <h1 className="text-3xl font-bold basis-2xl">ERROR DETECTOR</h1>
                        </div>

                        <div className="grid grid-cols-2">
                            <h2 className="text-lg font-medium border px-0.5">Format No : ED/FM/33</h2>
                            <h2 className="text-lg font-medium border px-0.5">Job Card</h2>
                        </div>
                    </div>

                    <form>
                        {/* Job Card Information */}
                        <div className="">
                            <div className="flex justify-between flex-wrap">
                                <p className="mb-2">
                                    <span className="font-semibold">ULR No :</span>
                                    <input
                                        type="text"
                                        name="ulrNo"
                                        value={formData.ulrNo}
                                        onChange={handleChange}
                                        disabled
                                        className="ml-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 disabled:text-gray-500"
                                    />
                                </p>
                            </div>
                            <div className="flex justify-between flex-wrap">
                                <p className="mb-2">
                                    <span className="font-semibold">Job no:</span>
                                    <input
                                        type="text"
                                        name="jobNo"
                                        disabled
                                        value={formData.jobNo}
                                        onChange={handleChange}
                                        className="ml-2 w-20 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                                    />
                                </p>
                                <p className="mt-2">
                                    <span className="font-semibold">Job Card Issue Date:</span>
                                    <input
                                        type="text"
                                        name="jobCardIssueDate"
                                        value={formData.jobCardIssueDate}
                                        onChange={handleChange}
                                        className="ml-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                                    />
                                </p>
                            </div>
                        </div>

                        {/* SRF Details */}
                        <div className="flex justify-between flex-wrap">
                            <p className="mb-2">
                                <span className="font-semibold">SRF No. :</span>
                                <input
                                    type="text"
                                    name="srfNo"
                                    value={formData.srfNo}
                                    onChange={handleChange}
                                    className="ml-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                                />
                            </p>
                            <p className="mb-2">
                                <span className="font-semibold">Date:</span>
                                <input
                                    type="text"
                                    name="srfDate"
                                    value={formData.srfDate}
                                    onChange={handleChange}
                                    className="ml-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                                />
                            </p>
                        </div>

                        {/* Item Description Section */}
                        <div className="mb-6">
                            <p className="font-semibold mb-2">Item Description :</p>
                            <div className="flex justify-between flex-wrap">
                                <p className="mb-2">
                                    <span className="font-semibold">Name:</span>
                                    <input
                                        type="text"
                                        name="itemName"
                                        value={formData.itemName}
                                        onChange={handleChange}
                                        className="ml-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                                    />
                                </p>
                            </div>
                            <div className="flex justify-between flex-wrap">
                                <p className="mb-2">
                                    <span className="font-semibold">Make / Model:</span>
                                    <input
                                        type="text"
                                        name="makeModel"
                                        value={formData.makeModel}
                                        onChange={handleChange}
                                        className="ml-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                                    />
                                </p>
                            </div>
                            <div className="flex justify-between flex-wrap">
                                <p className="mb-2">
                                    <span className="font-semibold">Sr.No.:</span>
                                    <input
                                        type="text"
                                        name="serialNo"
                                        value={formData.serialNo}
                                        onChange={handleChange}
                                        className="ml-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                                    />
                                </p>
                            </div>
                            <div className="flex justify-between flex-wrap">
                                <p className="mb-2">
                                    <span className="font-semibold">Target Date of completion:</span>
                                    <input
                                        type="text"
                                        name="targetDate"
                                        value={formData.targetDate}
                                        onChange={handleChange}
                                        className="ml-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                                    />
                                </p>
                            </div>
                        </div>

                        <h1 className="block font-semibold mb-2">Parameters to be calibrated :</h1>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border-2 border-black">
                                <thead>
                                    <tr>
                                        <th className="border-2 border-black p-2 text-left">Sl.No.</th>
                                        <th className="border-2 border-black p-2 text-left">Parameter</th>
                                        <th className="border-2 border-black p-2 text-left">Ranges</th>
                                        <th className="border-2 border-black p-2 text-left">Accuracy</th>
                                        <th className="border-2 border-black p-2 text-left">Cal. Status</th>
                                        <th className="border-2 border-black p-2 text-left">Calibrated by/Date</th>
                                        <th className="border-2 border-black p-2 text-left">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-black p-1">{formData.serialNo}</td>
                                        <td className="border border-black p-1">{formData.parameters}</td>
                                        <td className="border border-black p-1">{formData.ranges}</td>
                                        <td className="border border-black p-1">{formData.accuracy}</td>
                                        <td className="border border-black p-1">
                                            <input
                                                type="text"
                                                value={result.calibrationStatus}
                                                onChange={(e) => setResult({ ...result, calibrationStatus: e.target.value })}
                                                className="w-full p-1"
                                            />
                                        </td>
                                        <td className="border border-black p-1">
                                            <input
                                                type="date"
                                                value={result.calibrationDate}
                                                onChange={(e) => setResult({ ...result, calibrationDate: e.target.value })}
                                                className="w-full p-1"
                                            />
                                        </td>
                                        <td className="border border-black p-1">
                                            <input
                                                type="text"
                                                value={result.remarks}
                                                onChange={(e) => setResult({ ...result, remarks: e.target.value })}
                                                className="w-full p-1"
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Add Observation Section */}
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={() => setShowObservation(true)}
                                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
                            >
                                Add Observation
                            </button>
                        </div>

                        {showObservation && (
                            <Observation product={equipment} setObsData={setObsData} />
                        )}

                        {/* Submit and Issued By Section */}
                        <div className="flex justify-between items-center mt-8">
                            <div className="text-center">
                                <p className="font-semibold">Issued by</p>
                                <div className="mt-8 border-t border-gray-400 w-40 ml-auto"></div>
                            </div>
                            {!equipment.isCalibrated ? (
                                <div>
                                    <div className="mt-2 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={handleUpdateClick}
                                            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Tcard;