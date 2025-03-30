import React, { useEffect, useState } from "react";
import Ucard from "./components/Ucard";

const Ucompleted = () => {
  const [calibratedForms, setCalibratedForms] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cardKey, setCardKey] = useState(0);

  useEffect(() => {
    const fetchCalibratedForms = async () => {
      try {
        const response = await fetch("/api/errorform/pending");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        if (data.success) {
          console.log("Fetched calibrated forms data:", data);
        }
        setCalibratedForms(data.data);
      } catch (error) {
        console.error("Error fetching calibrated forms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalibratedForms();
  }, []);

  const toggleProductDetails = (product) => {
    if (selectedProduct && selectedProduct._id === product._id) {
      setSelectedProduct(null);
    } else {
      setSelectedProduct(product);
      setCardKey((prevKey) => prevKey + 1);
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='container py-10'>
      {calibratedForms.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          {/* Product List Sidebar */}
          <div className='bg-gray-50 rounded-lg shadow-md p-4 col-span-1 overflow-y-auto max-h-[600px]'>
            <h2 className='font-semibold text-lg mb-4 text-gray-700 border-b pb-2'>
              Pending Products
            </h2>

            {calibratedForms.map((form, formIndex) =>
              form.products.map((product, productIndex) => (
                <div
                  key={product._id}
                  className={`bg-white p-4 rounded-lg shadow-sm my-3 border-l-4 transition-all duration-200 hover:shadow-md ${
                    selectedProduct && selectedProduct._id === product._id
                      ? "border-l-blue-600"
                      : "border-l-gray-300"
                  }`}
                >
                  <div className='flex flex-col gap-2'>
                    <div>
                      <p className='font-medium text-gray-800'>Form #{formIndex + 1}</p>
                      <p className='text-sm text-gray-500'>Product #{productIndex + 1}</p>
                    </div>
                    <button
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedProduct && selectedProduct._id === product._id
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                      onClick={() => toggleProductDetails(product)}
                    >
                      {selectedProduct && selectedProduct._id === product._id ? (
                        <span className='flex items-center justify-center gap-1'>
                          <span>Hide Details</span>
                          <span className='text-xs'>▲</span>
                        </span>
                      ) : (
                        <span className='flex items-center justify-center gap-1'>
                          <span>Show Details</span>
                          <span className='text-xs'>▼</span>
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Product Details Panel */}
          <div className='col-span-3 bg-white rounded-lg shadow-md overflow-y-auto max-h-[600px]'>
            {selectedProduct ? (
              <div className='p-4'>
                <h1 className='text-xl font-bold mb-4 border-b pb-2'>Product Details</h1>
                <Ucard
                  key={cardKey}
                  equipment={selectedProduct}
                />
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center h-full p-10 text-center'>
                <svg
                  className='w-16 h-16 text-gray-300 mb-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                  ></path>
                </svg>
                <h3 className='text-xl font-medium text-gray-600 mb-2'>No Product Selected</h3>
                <p className='text-gray-500'>Select a product from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow-md p-10 text-center'>
          <svg
            className='w-16 h-16 text-gray-300 mx-auto mb-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
            ></path>
          </svg>
          <h3 className='text-xl font-medium text-gray-600 mb-2'>No Pending Products</h3>
          <p className='text-gray-500'>There are currently no pending products to display.</p>
        </div>
      )}
    </div>
  );
};

export default Ucompleted;
