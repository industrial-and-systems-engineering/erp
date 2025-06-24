import React, { useState, useEffect } from 'react';

const Ucard = ({ equipment, parentForm }) => {
    const [showOrderStatus, setShowOrderStatus] = useState(false);

    // Jab bhi equipment ya parentForm change ho, showOrderStatus reset ho
    useEffect(() => {
        setShowOrderStatus(false);
    }, [equipment, parentForm]);

    const handleTrackOrder = () => {
        setShowOrderStatus((prev) => !prev);
    };
    return (
        <div className="">
            <p>Date: {new Date(equipment.updatedAt).toLocaleDateString()}</p>
            <p>Time: {new Date(equipment.updatedAt).toLocaleTimeString()}</p>
            <p><strong>Job No:</strong> {equipment.jobNo}</p>
            <p><strong>Instrument Description:</strong> {equipment.instrumentDescription}</p>
            <p><strong>Serial No:</strong> {equipment.serialNo}</p>
            <button
                onClick={handleTrackOrder}
                style={{
                    marginTop: '10px',
                    padding: '8px 16px',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Track Order
            </button>
            {showOrderStatus && (
                <p style={{ marginTop: '12px' }}>
                    <strong>Order Received:</strong> {parentForm && parentForm.formUpdated ? 'Yes' : 'No'}
                </p>
            )}
        </div>
    );
};

export default Ucard;