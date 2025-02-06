import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../utils/isloggedin';
import UserNavbar from '../../components/navbar/UserNavbar.jsx';
import Ucard from '../../components/EquipmentCard/Ucard.jsx';

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
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold text-center my-10">Completed Products</h1>
      {calibratedForms.length > 0 ? (
        <div className="space-y-2 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4">
            {calibratedForms.map((form, formIndex) =>
              form.products.map((product, productIndex) => (
                <div key={product._id} className="bg-white p-4">
                  <p className="text-gray-700">Form Number: {formIndex + 1}</p>
                  <p className="text-gray-700">Product Number: {productIndex + 1}</p>
                  <div className="flex justify-end">
                    <button
                      key={product._id}
                      className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700"
                      onClick={() => toggleProductDetails(product)}
                    >
                      {selectedProduct && selectedProduct._id === product._id ? 'Hide Details' : 'Show Details'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-center">Product Details</h1>
            {selectedProduct && (
              <div className="mt-4 p-4 rounded-lg shadow-md w-full">
                <Ucard equipment={selectedProduct} />
                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700"
                    onClick={() => { }}
                  >
                    Open Form
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No calibrated products found.</p>
      )}
    </div>
  );
};

export default Ucompleted;