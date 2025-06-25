import React, { useState } from "react";

const AmendmentRequestModal = ({ isOpen, onClose, product, form }) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product || !form) {
      console.error("Missing product ID or form ID");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/errorform/amendmentrequest/${form._id}/${product._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, details }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit amendment request");
      }

      const data = await response.json();

      // Success handling
      alert(data.message || "Amendment request submitted successfully");
      setReason("");
      setDetails("");
      onClose();

      // Reload the page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error submitting amendment request:", error);
      alert(`Error: ${error.message || "Failed to submit request"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden'>
        {/* Modal Header */}
        <div className='bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center'>
          <h3 className='text-lg font-medium text-gray-800'>Amendment Request</h3>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 focus:outline-none'
          >
            <svg
              className='h-5 w-5'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <form
          onSubmit={handleSubmit}
          className='p-6'
        >
          <div className='mb-4'>
            <label
              htmlFor='reason'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Reason for Amendment
            </label>
            <select
              id='reason'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              required
            >
              <option value=''>Select a reason</option>
              <option value='data_error'>Data Error</option>
              <option value='measurement_issue'>Measurement Issue</option>
              <option value='equipment_information'>Equipment Information Update</option>
              <option value='certificate_format'>Certificate Format Change</option>
              <option value='other'>Other</option>
            </select>
          </div>

          <div className='mb-4'>
            <label
              htmlFor='details'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Amendment Details
            </label>
            <textarea
              id='details'
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows='4'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              placeholder='Please provide detailed information about the changes needed...'
              required
            ></textarea>
          </div>

          <div className='flex justify-end gap-3 mt-6'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AmendmentRequestModal;
