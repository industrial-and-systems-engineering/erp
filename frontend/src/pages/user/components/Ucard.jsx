import React from 'react';

const Ucard = ({ equipment, onUpdate }) => {
    return (
        <div className="">
            <p>Date: {new Date(equipment.updatedAt).toLocaleDateString()}</p>
            <p>Time: {new Date(equipment.updatedAt).toLocaleTimeString()}</p>
            <p><strong>Job No:</strong> {equipment.jobNo}</p>
            <p><strong>Instrument Description:</strong> {equipment.instrumentDescription}</p>
            <p><strong>Serial No:</strong> {equipment.serialNo}</p>
        </div>
    );
};

export default Ucard;