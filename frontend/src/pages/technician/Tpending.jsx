import React, { useState, useEffect } from "react";
import Tcard from "./components/Tcard";
import { usePendingFormsStore } from "./utils/pendingForms";

const Tpending = () => {
  const { pendingForms, fetchPendingForms } = usePendingFormsStore();
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  // Add a key state to force re-render of Tcard
  const [cardKey, setCardKey] = useState(0);

  useEffect(() => {
    fetchPendingForms();
  }, []);

  const toggleEquipmentDetails = (product, form) => {
    if (selectedEquipment && selectedEquipment._id === product._id) {
      // If clicking the same equipment, hide it
      setSelectedEquipment(null);
      setSelectedForm(null);
    } else {
      // If switching to a different equipment, update state and increment key
      // This will force the Tcard component to re-render
      setSelectedEquipment(product);
      setSelectedForm(form);
      setCardKey((prevKey) => prevKey + 1);
    }
  };

  return (
    <div className='container py-10'>
      {pendingForms.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          {/* Equipment List Sidebar */}
          <div className='bg-gray-50 rounded-lg shadow-md p-4 col-span-1 overflow-y-auto max-h-[600px]'>
            <h2 className='font-semibold text-lg mb-4 text-gray-700 border-b pb-2'>
              Equipment List
            </h2>

            {pendingForms.map((form) =>
              form.products.map((product) => (
                <div
                  key={product._id}
                  className={`bg-white p-4 rounded-lg shadow-sm my-3 border-l-4 transition-all duration-200 hover:shadow-md ${
                    selectedEquipment && selectedEquipment._id === product._id
                      ? "border-l-blue-600"
                      : "border-l-gray-300"
                  }`}
                >
                  <div className='flex justify-between items-center gap-2'>
                    <div>
                      <p className='font-medium text-gray-800'>Job #{product.jobNo}</p>
                      <p className='text-sm text-gray-500'>{product.name || "Equipment"}</p>
                    </div>
                    <button
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
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
              ))
            )}
          </div>

          {/* Equipment Details Panel */}
          <div className='col-span-3 bg-white rounded-lg shadow-md overflow-y-auto max-h-[600px]'>
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
    </div>
  );
};

export default Tpending;
