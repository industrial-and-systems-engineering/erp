import React, { useState, useEffect } from "react";
import Tcard from "./components/Tcard";
import { usePendingFormsStore } from "./utils/pendingForms";
import Calculator from "./components/Calculator";

const Tpending = () => {
  const { pendingForms, fetchPendingForms } = usePendingFormsStore();
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [cardKey, setCardKey] = useState(0);
  // Add state for calculator visibility
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  useEffect(() => {
    fetchPendingForms();
  }, []);

  const toggleEquipmentDetails = (product, form) => {
    if (selectedEquipment && selectedEquipment._id === product._id) {
      setSelectedEquipment(null);
      setSelectedForm(null);
    } else {
      setSelectedEquipment(product);
      setSelectedForm(form);
      setCardKey((prevKey) => prevKey + 1);
    }
  };

  return (
    <div>
      {pendingForms.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          {/* Equipment List Sidebar */}
          <div className='bg-gray-50 rounded-lg shadow-md p-4 col-span-1 overflow-y-auto h-[87vh]'>
            <h2 className='font-semibold text-lg mb-4 text-gray-700 border-b pb-2'>
              Equipment List
            </h2>

            {pendingForms
              .slice() // Create a copy to avoid mutating the original array
              .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)) // Sort by creation date
              .map((form) =>
                form.products.map((product) => (
                  <div
                    key={product._id}
                    className={`bg-white p-4 rounded-lg shadow-sm my-3 border-l-4 transition-all duration-200 hover:shadow-md relative ${
                      selectedEquipment && selectedEquipment._id === product._id
                        ? "border-l-blue-600"
                        : "border-l-gray-300"
                    }`}
                  >
                    {product.partialySaved && (
                      <span className='px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 absolute top-2 right-2'>
                        Draft
                      </span>
                    )}
                    <div className='flex justify-between items-center gap-2'>
                      <div>
                        <p className='font-medium text-gray-800'>Job #{product.jobNo}</p>
                        <p className='text-sm text-gray-500'>{product.name || "Equipment"}</p>
                      </div>
                      <div className='flex-col'>
                        <button
                          className={`px-3 py-2 rounded-md text-sm cursor-pointer font-medium transition-colors w-24 flex items-center justify-center ${
                            selectedEquipment && selectedEquipment._id === product._id
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          }`}
                          onClick={() => toggleEquipmentDetails(product, form)}
                        >
                          {selectedEquipment && selectedEquipment._id === product._id ? (
                            <span className='flex items-center gap-1'>
                              <span>Hide</span>
                              <span className='text-xs'>▲</span>
                            </span>
                          ) : (
                            <span className='flex items-center gap-1'>
                              <span>Details</span>
                              <span className='text-xs'>▼</span>
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
          </div>

          {/* Equipment Details Panel */}
          <div className='col-span-3 bg-white rounded-lg shadow-md overflow-y-auto h-[87vh]'>
            {selectedEquipment && selectedForm ? (
              <Tcard
                key={cardKey} // Add key prop to force re-render
                equipment={selectedEquipment}
                form={selectedForm}
                formOpen={setSelectedEquipment}
              />
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
                <h3 className='text-xl font-medium text-gray-600 mb-2'>No Equipment Selected</h3>
                <p className='text-gray-500'>Select an equipment from the list to view details</p>
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
          <h3 className='text-xl font-medium text-gray-600 mb-2'>No Pending Equipment</h3>
          <p className='text-gray-500'>
            There are currently no pending equipment items to display.
          </p>
        </div>
      )}

      {/* Floating Calculator Button */}
      <button
        onClick={() => setCalculatorOpen(!calculatorOpen)}
        className='fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-colors z-50 focus:outline-none'
        aria-label='Calculator'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z'
          />
        </svg>
      </button>

      {/* Calculator Component */}
      <Calculator
        isOpen={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
      />
    </div>
  );
};

export default Tpending;
