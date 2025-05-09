import React, { useEffect, useState } from "react";
import { usePendingFormsStore } from "../utils/pendingForms";
import CalDataSheet from "./CalDataSheet";

const Tcard = ({ equipment, form, formOpen }) => {
  const { updateForm, fetchPendingForms, partiallySave } = usePendingFormsStore();
  const [showCalDataSheet, setCalDataSheetStatus] = useState(false);
  const [parameterErrors, setParameterErrors] = useState({});
  const [CDSValid, setCDSValid] = useState(false);
  const [newData, setNewData] = useState(equipment);

  const handleParameterChange = (e, index) => {
    const { name, value } = e.target;

    setNewData((prevData) => {
      const updatedParameters = [...prevData.parameters];
      updatedParameters[index] = {
        ...updatedParameters[index],
        [name]: value,
      };

      return {
        ...prevData,
        parameters: updatedParameters,
      };
    });

    // Clear error for the parameter being changed
    setParameterErrors((prevErrors) => ({
      ...prevErrors,
      [index]: { ...prevErrors[index], [name]: null },
    }));
  };

  const validateParameters = () => {
    let errors = {};
    let isValid = true;

    newData.parameters.forEach((parameter, index) => {
      let paramErrors = {};
      if (!parameter.calibrationStatus) {
        paramErrors.calibrationStatus = "Calibration Status is required";
        isValid = false;
      }
      if (!parameter.calibratedDate) {
        paramErrors.calibratedDate = "Calibrated Date is required";
        isValid = false;
      }
      if (!parameter.remarks) {
        paramErrors.remarks = "Remarks is required";
        isValid = false;
      }
      errors[index] = paramErrors;
    });

    setParameterErrors(errors);
    return isValid;
  };

  const validateCDS = () => {
    return CDSValid;
  };

  const handleUpdateClick = async () => {
    const areParametersValid = validateParameters();
    const cdsValid = validateCDS();
    if (!areParametersValid || !cdsValid) {
      alert("Please correct the errors before updating.");
      return;
    }

    const dataToUpdate = {
      ...newData
    };

    const response = await updateForm(form._id, equipment._id, dataToUpdate);

    if (response.success) {
      alert("Form updated successfully");
      fetchPendingForms();
      formOpen(null);
    } else {
      alert("Failed to update form: " + response.message);
    }
  };

  const handlePartiallyUpdateClick = async () => {
    const dataToUpdate = { ...newData };
    const response = await partiallySave(form._id, equipment._id, dataToUpdate);

    if (response.success) {
      fetchPendingForms();
      alert("Form Partially Updated Successfully");
    } else {
      alert("Failed to Partially Update form: " + response.message);
    }
  }

  const handleSaveNewObservation = (readingData) => {
    setNewData((prevData) => ({
      ...prevData,
      ...readingData,
    }));
    setCDSValid(true);
    console.log("New observation data:", readingData);
    setCalDataSheetStatus(false);
  };

  return (
    <div>
      {!showCalDataSheet ? (
        <div className='flex justify-center items-center border-gray-300 rounded-lg p-4'>
          {/* Main Container */}
          <div className='w-full bg-white'>
            {/* Header Section */}
            <div className='mb-6 text-center'>
              <div className='grid-cols-2 border-t border-l border-r '>
                <h1 className='text-3xl font-bold basis-2xl'>ERROR DETECTOR</h1>
              </div>
              <div className='grid grid-cols-2'>
                <h2 className='text-lg font-medium border px-0.5'>Format No : ED/FM/33</h2>
                <h2 className='text-lg font-medium border px-0.5'>Job Card</h2>
              </div>
            </div>
            <form>
              {/* Job Card Information */}
              <div className=''>
                <div className='flex justify-between flex-wrap'>
                  <p className='mb-2'>
                    <span className='font-semibold'>ULR No :</span>
                    <input
                      type='text'
                      name='ulrNo'
                      readOnly
                      value={form.URL_NO || ""}
                      className='ml-2'
                    />
                  </p>
                </div>
                <div className='flex justify-between flex-wrap'>
                  <p className='mb-2'>
                    <span className='font-semibold'>Job no:</span>
                    <input
                      type='text'
                      name='jobNo'
                      readOnly
                      value={equipment.jobNo || ""}
                      className='ml-2 w-20'
                    />
                  </p>
                  <p className='mt-2'>
                    <span className='font-semibold'>Job Card Issue Date:</span>
                    <input
                      type='text'
                      name='jobCardIssueDate'
                      value={form.createdAt ? new Date(form.createdAt).toLocaleDateString() : ""}
                      readOnly
                      className='ml-2'
                    />
                  </p>
                </div>
              </div>

              {/* SRF Details */}
              <div className='flex justify-between flex-wrap'>
                <p className='mb-2'>
                  <span className='font-semibold'>SRF No. :</span>
                  <input
                    type='text'
                    name='srfNo'
                    value={form.srfNo || ""}
                    readOnly
                    className='ml-2'
                  />
                </p>
              </div>

              {/* Item Description Section */}
              <div className='mb-6'>
                <p className='font-semibold mb-2'>Item Description :</p>
                <div className='flex justify-between flex-wrap'>
                  <p className='mb-2'>
                    <span className='font-semibold'>Name:</span>
                    <input
                      type='text'
                      name='itemName'
                      value={equipment.instrumentDescription || ""}
                      readOnly
                      className='ml-2'
                    />
                  </p>
                </div>
                <div className='flex justify-between flex-wrap'>
                  <p className='mb-2'>
                    <span className='font-semibold'>Make / Model:</span>
                    <input
                      type='text'
                      name='makeModel'
                      value={equipment.make || ""}
                      readOnly
                      className='ml-2'
                    />
                  </p>
                </div>
                <div className='flex justify-between flex-wrap'>
                  <p className='mb-2'>
                    <span className='font-semibold'>Sr.No.:</span>
                    <input
                      type='text'
                      name='serialNo'
                      value={equipment.serialNo || ""}
                      readOnly
                      className='ml-2'
                    />
                  </p>
                </div>
                <div className='flex justify-between flex-wrap'>
                  <p className='mb-2'>
                    <span className='font-semibold'>Target Date of completion:</span>
                    <input
                      type='text'
                      name='targetDate'
                      value={form.probableDate ? new Date(form.probableDate).toLocaleDateString() : ""}
                      readOnly
                      className='ml-2'
                    />
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
                    {newData.parameters.map((parameter, index) => (
                      <tr key={index}>
                        <td className='border border-black p-1'>{index + 1}</td>
                        <td className='border border-black p-1'>{parameter.parameter}</td>
                        <td className='border border-black p-1'>{parameter.ranges}</td>
                        <td className='border border-black p-1'>{parameter.accuracy}</td>
                        <td className='border border-black p-1'>
                          <input
                            type='text'
                            name='calibrationStatus'
                            value={parameter.calibrationStatus || ""}
                            onChange={(e) => handleParameterChange(e, index)}
                            className='w-full p-1'
                          />
                          {parameterErrors[index]?.calibrationStatus && (
                            <span className='text-red-500'>
                              {parameterErrors[index].calibrationStatus}
                            </span>
                          )}
                        </td>
                        <td className='border border-black p-1'>
                          <input
                            type='date'
                            name='calibratedDate'
                            value={parameter.calibratedDate ? new Date(parameter.calibratedDate).toISOString().split('T')[0] : ""}
                            onChange={(e) => handleParameterChange(e, index)}
                            className='w-full p-1'
                          />
                          {parameterErrors[index]?.calibratedDate && (
                            <span className='text-red-500'>
                              {parameterErrors[index].calibratedDate}
                            </span>
                          )}
                        </td>
                        <td className='border border-black p-1'>
                          <input
                            type='text'
                            name='remarks'
                            value={parameter.remarks || ""}
                            onChange={(e) => handleParameterChange(e, index)}
                            className='w-full p-1'
                          />
                          {parameterErrors[index]?.remarks && (
                            <span className='text-red-500'>{parameterErrors[index].remarks}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Open Calibration Data Section */}
              <div className='mt-4'>
                <button
                  type='button'
                  onClick={() => setCalDataSheetStatus(!showCalDataSheet)}
                  className={`py-2 px-4 rounded ${showCalDataSheet
                    ? "bg-red-500 hover:bg-red-700"
                    : "bg-green-500 hover:bg-green-700"
                    } text-white cursor-pointer`}
                >
                  Show Calibration Data Sheet
                </button>
                {!CDSValid && (
                  <span className='text-red-500 ml-2'>Please fill the Calibration Data Sheet</span>
                )}
              </div>

              {/* Submit and Issued By Section */}
              <div className='flex justify-between items-center mt-8'>
                <div className='text-center'>
                  <p className='font-semibold'>Issued by</p>
                  <input
                    type='text'
                    name='issuedBy'
                    onChange={(e) => setNewData({ ...newData, issuedBy: e.target.value })}
                    value={newData.issuedBy || ""}
                    className='mt-8 border-b border-gray-400 w-40 ml-auto'
                  />
                </div>

                <div>
                  <div className='mt-2 flex justify-end'>
                    <div className='flex gap-2'>
                      <button
                        type='button'
                        onClick={handleUpdateClick}
                        className='bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-700 cursor-pointer'
                      >
                        Update
                      </button>
                      <button
                        type='button'
                        onClick={handlePartiallyUpdateClick}
                        className='bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 cursor-pointer'
                      >
                        Save as Draft
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <CalDataSheet
          product={equipment}
          save={handleSaveNewObservation}
          Data={newData}
          close={setCalDataSheetStatus}
          form={form}
          paramChange={handleParameterChange}
          partialUpdate={handlePartiallyUpdateClick}
        />
      )}
    </div>
  );
};

export default Tcard;
