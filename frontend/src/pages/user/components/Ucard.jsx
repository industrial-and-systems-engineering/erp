import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Ucard = ({ equipment, parentForm }) => {
    const [showOrderStatus, setShowOrderStatus] = useState(false);
    const [trackingInfo, setTrackingInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [orderCreated, setOrderCreated] = useState(false);
    const [orderError, setOrderError] = useState(null);

    // Jab bhi equipment ya parentForm change ho, showOrderStatus reset ho
    useEffect(() => {
        setShowOrderStatus(false);
        setTrackingInfo(null);
        setOrderCreated(false);
        setOrderError(null);
    }, [equipment, parentForm]);

    const handleCreateOrder = async () => {
        setOrderError(null);
        try {
            // डमी ऑर्डर के लिए trackingNumber = serialNo या jobNo
            const trackingNumber = equipment.trackingNumber || equipment.serialNo || equipment.jobNo;
            if (!trackingNumber) {
                setOrderError('Tracking Number Not Available');
                return;
            }
            const res = await axios.post('http://localhost:8080/api/orders', {
                name: parentForm?.organization || 'Test User',
                address: parentForm?.address || 'Test Address',
                productId: equipment._id || 'dummy',
                trackingNumber,
                courier: 'DummyCourier',
                status: 'Order Placed',
            });
            setOrderCreated(true);
        } catch (err) {
            setOrderError('Order create failed (शायद order पहले से है)');
        }
    };

    const handleTrackOrder = async () => {
        setShowOrderStatus((prev) => !prev);
        if (!showOrderStatus) {
            setLoading(true);
            try {
                // डमी के लिए serialNo या jobNo को trackingNumber मान रहे हैं
                const trackingNumber = equipment.trackingNumber || equipment.serialNo || equipment.jobNo;
                if (!trackingNumber) {
                    setTrackingInfo({ error: 'Tracking Number Not Available' });
                    setLoading(false);
                    return;
                }
                const res = await axios.get(`http://localhost:8080/api/track/${trackingNumber}`);
                setTrackingInfo(res.data);
            } catch (err) {
                setTrackingInfo({ error: 'Tracking not found' });
            }
            setLoading(false);
        } else {
            setTrackingInfo(null);
        }
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
            <button
                onClick={handleCreateOrder}
                style={{
                    marginTop: '10px',
                    marginLeft: '10px',
                    padding: '8px 16px',
                    background: '#22c55e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Create Dummy Order
            </button>
            {orderCreated && <p style={{ color: 'green', marginTop: '8px' }}>Order Created! Now you can track the order.</p>}
            {orderError && <p style={{ color: 'red', marginTop: '8px' }}>{orderError}</p>}
            {showOrderStatus && (
                <div style={{ marginTop: '12px' }}>
                    <p><strong>Order Received:</strong> {parentForm && parentForm.formUpdated ? 'Yes' : 'No'}</p>
                    {loading ? (
                        <p>Loading...</p>
                    ) : trackingInfo ? (
                        trackingInfo.error ? (
                            <p style={{ color: 'red' }}>{trackingInfo.error}</p>
                        ) : (
                            <div>
                                <h4>Courier: {trackingInfo.courier || 'N/A'}</h4>
                                <h5>Status: {trackingInfo.status}</h5>
                                <ul>
                                    {trackingInfo.history && trackingInfo.history.map((item, idx) => (
                                        <li key={idx}>{item.status} - {item.timestamp}</li>
                                    ))}
                                </ul>
                            </div>
                        )
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default Ucard;