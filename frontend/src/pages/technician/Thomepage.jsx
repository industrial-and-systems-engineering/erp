import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCompletedFormsStore } from "./utils/completedForms";
import { usePendingFormsStore } from "./utils/pendingForms";

const Thomepage = () => {
  const { fetchCompletedForms, completedForms } = useCompletedFormsStore();
  const { fetchPendingForms, pendingForms } = usePendingFormsStore();
  useEffect(() => {
    fetchCompletedForms();
    fetchPendingForms();
  }, [fetchCompletedForms, fetchPendingForms]);

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>Technician Dashboard</h1>
        <p className='text-gray-600 mt-2'>
          Welcome back! Here's an overview of your current workload and performance.
        </p>
      </div>

      {/* Stats Overview Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
        <div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500'>
          <h3 className='text-gray-500 text-sm font-medium'>Completed Products</h3>
          <div className='flex items-center mt-2'>
            <span className='text-3xl font-bold text-gray-800'>{completedForms.length}</span>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500'>
          <h3 className='text-gray-500 text-sm font-medium'>Pending Products</h3>
          <div className='flex items-center mt-2'>
            <span className='text-3xl font-bold text-gray-800'>{pendingForms.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thomepage;
