import React from 'react';

const Ucard = ({ equipment, onUpdate }) => {
    return (
        <div className="equipment-card">
            <p>Date: {equipment.createdAt.substr(0, 10)}</p>
            <p><strong>Job No:</strong> {equipment.jobNo}</p>
            <p><strong>Instrument Description:</strong> {equipment.instrumentDescription}</p>
            <p><strong>Serial No:</strong> {equipment.serialNo}</p>
            <p><strong>Parameter:</strong> {equipment.parameter}</p>
            <p><strong>Ranges:</strong> {equipment.ranges}</p>
            <p><strong>Accuracy:</strong> {equipment.accuracy}</p>
            {equipment.isCalibrated && (
                <div>
                    <p><strong>Calibration Details:</strong> {equipment.calibrationDetails}</p>
                </div>
            )}
        </div>
    );
};

export default Ucard;