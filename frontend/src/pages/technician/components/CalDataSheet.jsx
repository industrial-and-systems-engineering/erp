import React, { useState } from 'react';
import Observation from './Observation';

const CalDataSheet = ({ product, save, close, form }) => {
    const [formData, setFormData] = useState({
        jobNo: product.jobNo,
        recDate: '2025-03-24',
        srfNo: form.srfNo,
        ulrNo: form.URL_NO,
        calibrationProcedure: 'ET/Mech/Thermal',
        name: product.instrumentDescription,
        make: product.make,
        srNo: product.serialNo,
        parameters: product.parameters
    });
    const [newData, setNewData] = useState({
        Location: '',
        sensorType: '',
        resolution: '',
        roomTemp: '',
        humidity: '',
    });


    const [parameters, setParameters] = useState(product.parameters.map(param => ({
        ...param,
        readings: param.readings.map(reading => ({
            ...reading,
            masterCertUncertainty: 0,
            ducResolution: 0,
            masterAccuracy: 0,
            stability: 0
        }))
    })));

    // Calculation functions for each reading
    const calculateReadingMean = (readings) => {
        const numericReadings = ['r1', 'r2', 'r3', 'r4', 'r5']
            .map(key => Number(readings[key] || 0))
            .filter(val => !isNaN(val));

        if (numericReadings.length === 0) return '';

        const mean = numericReadings.reduce((acc, val) => acc + val, 0) / numericReadings.length;
        return mean.toFixed(2);
    };

    const calculateStdDev = (readings) => {
        const numericReadings = ['r1', 'r2', 'r3', 'r4', 'r5']
            .map(key => Number(readings[key] || 0))
            .filter(val => !isNaN(val));

        if (numericReadings.length <= 1) return 0;

        const mean = numericReadings.reduce((acc, val) => acc + val, 0) / numericReadings.length;
        const squaredDiffs = numericReadings.map(val => Math.pow(val - mean, 2));
        const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / (numericReadings.length - 1);

        return Math.sqrt(variance);
    };

    const calculateStdUncertainty = (readings) => {
        const stdDev = calculateStdDev(readings);
        const numericReadings = ['r1', 'r2', 'r3', 'r4', 'r5']
            .map(key => Number(readings[key] || 0))
            .filter(val => !isNaN(val));

        return numericReadings.length > 0
            ? (stdDev / Math.sqrt(numericReadings.length)).toFixed(4)
            : '';
    };

    const calculateUC = (reading) => {
        const u1 = Number(reading.masterCertUncertainty) / 2;
        const u2 = Number(reading.ducResolution) / (2 * Math.sqrt(3));
        const u3 = Number(reading.masterAccuracy) / Math.sqrt(3);
        const u5 = Number(reading.stability) / Math.sqrt(3);
        const stdUncertainty = Number(calculateStdUncertainty(reading)) || 0;

        const uc = Math.sqrt(
            Math.pow(stdUncertainty, 2) +
            Math.pow(u1, 2) +
            Math.pow(u2, 2) +
            Math.pow(u3, 2) +
            Math.pow(u5, 2)
        );

        return uc.toFixed(4);
    };

    const calculateUE = (reading) => {
        const uc = Number(calculateUC(reading));
        const kAt95CL = 2;
        return (uc * kAt95CL).toFixed(2);
    };

    // Update reading calculations
    const handleReadingChange = (paramIndex, readingIndex, field, value) => {
        const newParameters = [...parameters];
        newParameters[paramIndex].readings[readingIndex][field] = value;

        // Automatically calculate mean and UC
        const updatedReading = newParameters[paramIndex].readings[readingIndex];
        updatedReading.mean = calculateReadingMean(updatedReading);
        // updatedReading.uc = calculateUC(updatedReading);
        updatedReading.uc = calculateUE(updatedReading);

        setParameters(newParameters);
    };

    const addStdReading = (paramIndex) => {
        const newReadings = [...parameters];
        newReadings[paramIndex].readings.push({
            rName: '',
            rUnit: '',
            r1: '',
            r2: '',
            r3: '',
            r4: '',
            r5: '',
            observations: [],
            mean: '',
            uc: '',
            masterCertUncertainty: 0,
            ducResolution: 0,
            masterAccuracy: 0,
            stability: 0
        });
        setParameters(newReadings);
    };



    // console.log(parameters);
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg" >
            <h1 className="text-2xl font-bold text-center mb-6">ERROR DETECTOR</h1>
            <form className="space-y-4">
                {/* Header Information */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Job No</label>
                        <input
                            type="text"
                            value={formData.jobNo}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Rec. Date</label>
                        <input
                            type="date"
                            value={formData.recDate}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">SRF No</label>
                        <input
                            type="text"
                            value={formData.srfNo}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">ULR No</label>
                        <input
                            type="text"
                            value={formData.ulrNo}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                </div>
                {/* Details of Item to be Calibrated */}
                <h2 className="text-lg font-bold mt-6">Details of Item to be Calibrated</h2>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>

                        <label className="block text-sm font-medium">Name</label>
                        <input
                            type="text"
                            value={formData.calibrationProcedure}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />

                        <label className="block text-sm font-medium">Make/Model</label>
                        <input
                            type="text"
                            value={formData.make}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                        <label className="block text-sm font-medium">Sr. No.</label>
                        <input
                            type="text"
                            value={formData.srNo}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Location</label>
                        <input
                            type="text"
                            value={newData.Location}
                            onChange={(e) => setNewData(prev => ({ ...prev, Location: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            placeholder='Enter Location'
                        />
                        <label className="block text-sm font-medium">Sensor Type</label>
                        <input
                            type="text"
                            value={newData.sensorType}
                            onChange={(e) => setNewData(prev => ({ ...prev, sensorType: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            placeholder='Enter Sensor Type'
                        />
                        <label className='block text-sm font-medium'>Resolution</label>
                        <input
                            type="text"
                            value={newData.resolution}
                            onChange={(e) => setNewData(prev => ({ ...prev, resolution: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            placeholder='Enter Resolution'
                        />
                    </div>
                </div>

                {/* Environmental Conditions */}
                <h2 className="text-lg font-bold mt-6">Environmental Conditions</h2>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium">Room Temp (°C)</label>
                        <input
                            type="text"
                            value={newData.roomTemp}
                            onChange={(e) => setNewData(prev => ({ ...prev, roomTemp: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            placeholder='Enter Room Temp'
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Humidity (%)</label>
                        <input
                            type="text"
                            value={newData.humidity}
                            onChange={(e) => setNewData(prev => ({ ...prev, humidity: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            placeholder='Enter Humidity'
                        />
                    </div>
                </div>
                {/* details of master used */}
                <h2 className="text-lg font-bold mt-6">Details of Master Used</h2>
                <div className="grid grid-cols-4 gap-4 mt-4">
                    <div>
                        <input
                            type="text"
                            value={"Name"}
                            readOnly
                            className="mt-1 block w-full  rounded-md p-2"
                        />
                        <input
                            type="text"
                            value={"Equipment ID"}
                            readOnly
                            className="mt-1 block w-full rounded-md p-2"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                        <input
                            type="text"
                            value={formData.equipmentId}
                            onChange={(e) => setFormData(prev => ({ ...prev, equipmentId: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                        <input
                            type="text"
                            value={formData.equipmentId}
                            onChange={(e) => setFormData(prev => ({ ...prev, equipmentId: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <div>
                        <input
                            type="text"
                            value={formData.name}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                        <input
                            type="text"
                            value={formData.equipmentId}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                </div>
                {/* Observation */}
                <h2 className="text-lg font-bold mt-6">Observation</h2>
                <div>
                    {/* Parameters Section */}
                    {parameters.map((param, paramIndex) => (
                        <div key={paramIndex} className="mt-6 border p-4 rounded-md">
                            <div className="grid grid-cols-4 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium">Sl. NO.</label>
                                    <input
                                        type="text"
                                        value={paramIndex + 1}
                                        readOnly
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Parameter</label>
                                    <input
                                        type="text"
                                        value={param.parameter}
                                        readOnly
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Range & L.C</label>
                                    <input
                                        type="text"
                                        value={param.ranges}
                                        readOnly
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Accuracy</label>
                                    <input
                                        type="text"
                                        value={param.accuracy}
                                        readOnly
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                            </div>

                            {/* STD/DUC Readings */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border border-gray-300 p-2 text-left">STD./DUC Reading</th>
                                            <th className="border border-gray-300 p-2 text-left">R1</th>
                                            <th className="border border-gray-300 p-2 text-left">R2</th>
                                            <th className="border border-gray-300 p-2 text-left">R3</th>
                                            <th className="border border-gray-300 p-2 text-left">R4</th>
                                            <th className="border border-gray-300 p-2 text-left">R5</th>
                                            <th className="border border-gray-300 p-2 text-left">MCU</th>
                                            <th className="border border-gray-300 p-2 text-left">DUCR</th>
                                            <th className="border border-gray-300 p-2 text-left">MA</th>
                                            <th className="border border-gray-300 p-2 text-left">St</th>
                                            <th className="border border-gray-300 p-2 text-left">Mean</th>
                                            <th className="border border-gray-300 p-2 text-left">Uc</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {param.readings.map((reading, readingIndex) => (
                                            <tr key={readingIndex} className="hover:bg-gray-50">
                                                <td className="border border-gray-300 p-2">
                                                    <div className="flex space-x-2">
                                                        <input
                                                            type="text"
                                                            value={reading.rName}
                                                            onChange={(e) => handleReadingChange(paramIndex, readingIndex, 'rName', e.target.value)}
                                                            className="w-1/2 border border-gray-300 rounded-md p-2"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={reading.rUnit}
                                                            onChange={(e) => handleReadingChange(paramIndex, readingIndex, 'rUnit', e.target.value)}
                                                            className="w-1/2 border border-gray-300 rounded-md p-2"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    <input
                                                        type="text"
                                                        value={reading.r1}
                                                        onChange={(e) => handleReadingChange(paramIndex, readingIndex, 'r1', e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md p-2"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    <input
                                                        type="text"
                                                        value={reading.r2}
                                                        onChange={(e) => handleReadingChange(paramIndex, readingIndex, 'r2', e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md p-2"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    <input
                                                        type="text"
                                                        value={reading.r3}
                                                        onChange={(e) => handleReadingChange(paramIndex, readingIndex, 'r3', e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md p-2"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    <input
                                                        type="text"
                                                        value={reading.r4}
                                                        onChange={(e) => handleReadingChange(paramIndex, readingIndex, 'r4', e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md p-2"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    <input
                                                        type="text"
                                                        value={reading.r5}
                                                        onChange={(e) => handleReadingChange(paramIndex, readingIndex, 'r5', e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md p-2"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    <input
                                                        type="text"
                                                        value={reading.masterCertUncertainty}
                                                        onChange={(e) => handleReadingChange(paramIndex, readingIndex, 'masterCertUncertainty', e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md p-2"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    <input
                                                        type="text"
                                                        value={reading.ducResolution}
                                                        onChange={(e) => handleReadingChange(paramIndex, readingIndex, 'ducResolution', e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md p-2"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    <input
                                                        type="text"
                                                        value={reading.masterAccuracy}
                                                        onChange={(e) => handleReadingChange(paramIndex, readingIndex, 'masterAccuracy', e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md p-2"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    <input
                                                        type="text"
                                                        value={reading.stability}
                                                        onChange={(e) => handleReadingChange(paramIndex, readingIndex, 'stability', e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md p-2"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    <input
                                                        type="text"
                                                        value={reading.mean}
                                                        readOnly
                                                        className="w-full border border-gray-300 rounded-md p-2 bg-gray-100"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    <input
                                                        type="text"
                                                        value={reading.uc}
                                                        readOnly
                                                        className="w-full border border-gray-300 rounded-md p-2 bg-gray-100"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button
                                    type="button"
                                    onClick={() => addStdReading(paramIndex)}
                                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Add STD./DUC Reading
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={() => close(false)}
                            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => { save({ parameters: parameters, ...newData }) }}
                            className="bg-blue-500 object-bottom text-white px-6 py-2 rounded hover:bg-blue-600 cursor-pointer"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </div >
    );
};

export default CalDataSheet;