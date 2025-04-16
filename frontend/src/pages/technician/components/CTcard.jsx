import React from "react";
import CcalDataSheet from "./CcalDataSheet";

const CTcard = ({ equipment, form }) => {
  // Utility to format dates as locale strings.
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div>
      <div className='bg-white shadow-md rounded'>
        {/* Header Section */}
        <div className='mb-6 text-center'>
          <div className='grid-cols-2 border-t border-l border-r py-4'>
            <h1 className='text-3xl font-bold basis-2xl'>ERROR DETECTOR</h1>
          </div>
          <div className='grid grid-cols-2'>
            <h2 className='text-lg font-medium border px-0.5'>Format No : ED/FM/33</h2>
            <h2 className='text-lg font-medium border px-0.5'>Job Card</h2>
          </div>
        </div>
        <form>
          {/* Job Card Information */}
          <div>
            <div className='flex justify-between flex-wrap'>
              <p className='mb-2'>
                <span className='font-semibold'>ULR No :</span>
                <span className='ml-2 border-b border-gray-300'>{form.URL_NO || "N/A"}</span>
              </p>
            </div>
            <div className='flex justify-between flex-wrap'>
              <p className='mb-2'>
                <span className='font-semibold'>Job no:</span>
                <span className='ml-2 border-b border-gray-300'>{equipment.jobNo || "N/A"}</span>
              </p>
              <p className='mt-2'>
                <span className='font-semibold'>Job Card Issue Date:</span>
                <span className='ml-2 border-b border-gray-300'>{formatDate(form.createdAt)}</span>
              </p>
            </div>
          </div>

          {/* SRF Details */}
          <div className='flex justify-between flex-wrap'>
            <p className='mb-2'>
              <span className='font-semibold'>SRF No. :</span>
              <span className='ml-2 border-b border-gray-300'>{form.srfNo || "N/A"}</span>
            </p>
          </div>

          {/* Item Description Section */}
          <div className='mb-6'>
            <p className='font-semibold mb-2'>Item Description :</p>
            <div className='flex justify-between flex-wrap'>
              <p className='mb-2'>
                <span className='font-semibold'>Name:</span>
                <span className='ml-2 border-b border-gray-300'>
                  {equipment.instrumentDescription || "N/A"}
                </span>
              </p>
            </div>
            <div className='flex justify-between flex-wrap'>
              <p className='mb-2'>
                <span className='font-semibold'>Make / Model:</span>
                <span className='ml-2 border-b border-gray-300'>{equipment.make || "N/A"}</span>
              </p>
            </div>
            <div className='flex justify-between flex-wrap'>
              <p className='mb-2'>
                <span className='font-semibold'>Sr.No.:</span>
                <span className='ml-2 border-b border-gray-300'>{equipment.serialNo || "N/A"}</span>
              </p>
            </div>
            <div className='flex justify-between flex-wrap'>
              <p className='mb-2'>
                <span className='font-semibold'>Target Date of completion:</span>
                <span className='ml-2 border-b border-gray-300'>
                  {formatDate(form.probableDate)}
                </span>
              </p>
            </div>
          </div>

          <h1 className='block font-semibold mb-2'>Parameters to be calibrated :</h1>
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse border-2 border-black'>
              <thead>
                <tr>
                  <th className='border-2 border-black p-2 text-left'>Sl.No.</th>
                  <th className='border-2 border-black p-2 text-left'>Parameter</th>
                  <th className='border-2 border-black p-2 text-left'>Ranges</th>
                  <th className='border-2 border-black p-2 text-left'>Accuracy</th>
                  <th className='border-2 border-black p-2 text-left'>Cal. Status</th>
                  <th className='border-2 border-black p-2 text-left'>Calibrated by/Date</th>
                  <th className='border-2 border-black p-2 text-left'>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {equipment.parameters &&
                  equipment.parameters.map((param, index) => (
                    <tr key={index}>
                      <td className='border border-black p-1'>{index + 1}</td>
                      <td className='border border-black p-1'>{param.parameter || "N/A"}</td>
                      <td className='border border-black p-1'>{param.ranges || "N/A"}</td>
                      <td className='border border-black p-1'>{param.accuracy || "N/A"}</td>
                      <td className='border border-black p-1'>
                        {param.calibrationStatus || "N/A"}
                      </td>
                      <td className='border border-black p-1'>
                        {formatDate(param.calibratedDate)}
                      </td>
                      <td className='border border-black p-1'>{param.remarks || "N/A"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className='flex justify-between items-center mt-8'>
            <div className='text-center'>
              <p className='font-semibold'>Issued by</p>
              <div className='mt-8 border-t border-gray-400 w-40 ml-auto'></div>
            </div>
          </div>
          <div className='mt-8'></div>
          <h2 className='font-semibold mb-2'>Calibration DataSheet</h2>
          <CcalDataSheet
            form={form}
            product={equipment}
          />
        </form>
      </div>
    </div>
  );
};

export default CTcard;
