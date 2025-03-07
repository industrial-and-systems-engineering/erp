import React from 'react';
import { useState } from 'react';

const Observation = ({ product, setObsData }) => {
    const [observations, setObservations] = useState(product.observations);
    const [stats, setStats] = useState({ mean: null, standardDeviation: null, uncertainty: null });
    // Handle input change for each observation
    const handleObservationChange = (index, value) => {
        const newObservations = [...observations];
        newObservations[index] = value;
        setObservations(newObservations);
    };

    // Calculate mean and standard deviation
    const calculateStats = () => {
        // Convert all values to numbers and filter out empty strings
        const numericValues = observations
            .map(obs => parseFloat(obs))
            .filter(num => !isNaN(num));

        // Calculate mean
        const sum = numericValues.reduce((acc, val) => acc + val, 0);
        const mean = sum / numericValues.length;

        // Calculate standard deviation
        const squaredDifferences = numericValues.map(val => Math.pow(val - mean, 2));
        const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / numericValues.length;
        const standardDeviation = Math.sqrt(variance);
        const uncertainty = standardDeviation / Math.sqrt(numericValues.length);
        setStats({ mean, standardDeviation, uncertainty });
        setObsData({ mean, standardDeviation, uncertainty, observations });
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Observation Statistics</h2>

            <div className="space-y-4 mb-6">
                <p className="text-gray-600">Enter 5 observations:</p>
                {observations.map((observation, index) => (
                    <div key={index} className="flex items-center">
                        <label className="w-32 text-sm">Observation {index + 1}:</label>
                        <input
                            type="number"
                            value={observation}
                            onChange={(e) => handleObservationChange(index, e.target.value)}
                            className="border rounded p-2 w-full"
                            placeholder="Enter a number"
                        />
                    </div>
                ))}
            </div>

            <div className="flex space-x-4 mb-6">
                <button
                    onClick={calculateStats}
                    type='button'
                    className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Calculate
                </button>
            </div>

            {stats.mean !== null && (
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2">Results:</h3>
                    <p>Mean: {stats.mean.toFixed(2)}</p>
                    <p>Standard Deviation: {stats.standardDeviation.toFixed(2)}</p>
                    <p>Uncertainty: {stats.uncertainty.toFixed(2)}</p>
                </div>
            )}
        </div>
    );
};

export default Observation;