import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../utils/isloggedin';
import UserNavbar from '../../components/navbar/UserNavbar.jsx';

const Ucompleted = () => {
  const [calibratedForms, setCalibratedForms] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
 const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const fetchCalibratedForms = async () => {
      try {
        const response = await fetch('/api/errorform/calibrated');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setCalibratedForms(data);
      } catch (error) {
        console.error('Error fetching calibrated forms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalibratedForms();
  }, []);

  const toggleProductDetails = (product) => {
    setSelectedProduct((prevProduct) => (prevProduct && prevProduct._id === product._id ? null : product));
  };
  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center my-10">Completed Products</h1>
      {calibratedForms.length > 0 ? (
        <div className="space-y-2">
          {calibratedForms.map((form, formIndex) =>
            form.products.map((product, productIndex) => (
              <button
                key={product._id}
                className="bg-blue-500 text-white p-3 w-full rounded-lg hover:bg-blue-700"
                onClick={() => toggleProductDetails(product)}
              >
                Product {formIndex + 1}-{productIndex + 1}
              </button>
            ))
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No calibrated products found.</p>
      )}

      {/* Show selected product details */}
      {selectedProduct && (
        <div className="mt-4 p-4 border rounded-lg shadow-md bg-gray-100">
          <h2 className="text-lg font-bold">Product Details</h2>
          <p><strong>Job No:</strong> {selectedProduct.jobNo}</p>
          <p><strong>Description:</strong> {selectedProduct.instrumentDescription}</p>
          <p><strong>Serial No:</strong> {selectedProduct.serialNo}</p>
          <p><strong>Parameter:</strong> {selectedProduct.parameter}</p>
          <p><strong>Ranges:</strong> {selectedProduct.ranges}</p>
          <p><strong>Accuracy:</strong> {selectedProduct.accuracy}</p>
          <p><strong>Calibrated:</strong> {selectedProduct.isCalibrated ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
};

export default Ucompleted;