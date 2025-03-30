import React, { useEffect, useState } from "react";
import { usePendingFormsStore } from "../utils/pendingForms";
import CalDataSheet from "./CalDataSheet";

const Tcard = ({ equipment, form, formOpen }) => {
  const { updateForm, fetchPendingForms } = usePendingFormsStore();
  const [newData, setNewData] = useState({});
  // State to store the parameters data
  const [parameters, setParameters] = useState([...equipment.parameters]);
  // State to show/hide the pop-up/modal for new observation
  const [showCalDataSheet, setCalDataSheetStatus] = useState(false);

  const [formData, setFormData] = useState({
    ulrNo: form.URL_NO || "",
    jobNo: equipment.jobNo || "",
    jobCardIssueDate: form.createdAt ? new Date(form.createdAt).toLocaleDateString() : "",
    srfNo: form.srfNo || "",
    srfDate: form.createdAt ? new Date(form.createdAt).toLocaleDateString() : "",
    itemName: equipment.instrumentDescription || "",
    makeModel: equipment.instrumentDescription || "",
    serialNo: equipment.serialNo || "",
    targetDate: form.probableDate ? new Date(form.probableDate).toLocaleDateString() : "",
  });

  console.log(parameters);

  useEffect(() => {
    setFormData({
      ulrNo: form.URL_NO || "",
      jobNo: equipment.jobNo || "",
      jobCardIssueDate: form.createdAt ? new Date(form.createdAt).toLocaleDateString() : "",
      srfNo: form.srfNo || "",
      srfDate: form.createdAt ? new Date(form.createdAt).toLocaleDateString() : "",
      itemName: equipment.instrumentDescription || "",
      makeModel: equipment.instrumentDescription || "",
      serialNo: equipment.serialNo || "",
      targetDate: form.probableDate ? new Date(form.probableDate).toLocaleDateString() : "",
    });

    // Reset parameters when equipment changes
    setParameters([...equipment.parameters]);
  }, [equipment, form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleParameterChange = (e, index) => {
    const { name, value } = e.target;

    // Create a new copy of the parameters array
    const updatedParameters = [...parameters];

    // Update the specific parameter at the given index
    updatedParameters[index] = {
      ...updatedParameters[index],
      [name]: value,
    };

    // Set the updated parameters array
    setParameters(updatedParameters);

    // Also update newData with the latest parameters
    setNewData((prevData) => ({
      ...prevData,
      parameters: updatedParameters,
    }));
  };

  // Update the form with the new parameters data
  const handleUpdateClick = async () => {
    // Make sure we're sending the updated parameters
    const dataToUpdate = {
      ...newData,
      parameters: parameters,
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

  // Save the new observation to the list (frontend only)
  const handleSaveNewObservation = (readingData) => {
    setParameters((prevParameters) => {
      // Merge the updated parameters from readingData
      const updatedParameters = readingData.parameters || prevParameters;
      return updatedParameters;
    });

    setNewData((prevData) => ({
      ...prevData,
      ...readingData,
    }));

    console.log("New observation data:", readingData);
    setCalDataSheetStatus(false);
  };

  return (
    <div>
      {!showCalDataSheet ? (
        <div className='flex justify-center items-center h-screen border-2 border-gray-300 rounded-lg p-4'>
          {/* Main Container */}
          <div className='w-full bg-white'>
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
              <div className=''>
                <div className='flex justify-between flex-wrap'>
                  <p className='mb-2'>
                    <span className='font-semibold'>ULR No :</span>
                    <input
                      type='text'
                      name='ulrNo'
                      value={formData.ulrNo}
                      onChange={handleChange}
                      disabled
                      className='ml-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 disabled:text-gray-500'
                    />
                  </p>
                </div>
                <div className='flex justify-between flex-wrap'>
                  <p className='mb-2'>
                    <span className='font-semibold'>Job no:</span>
                    <input
                      type='text'
                      name='jobNo'
                      disabled
                      value={formData.jobNo}
                      onChange={handleChange}
                      className='ml-2 w-20 border-b border-gray-300 focus:outline-none focus:border-blue-500'
                    />
                  </p>
                  <p className='mt-2'>
                    <span className='font-semibold'>Job Card Issue Date:</span>
                    <input
                      type='text'
                      name='jobCardIssueDate'
                      value={formData.jobCardIssueDate}
                      onChange={handleChange}
                      className='ml-2 border-b border-gray-300 focus:outline-none focus:border-blue-500'
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
                    value={formData.srfNo}
                    onChange={handleChange}
                    className='ml-2 border-b border-gray-300 focus:outline-none focus:border-blue-500'
                  />
                </p>
                <p className='mb-2'>
                  <span className='font-semibold'>Date:</span>
                  <input
                    type='text'
                    name='srfDate'
                    value={formData.srfDate}
                    onChange={handleChange}
                    className='ml-2 border-b border-gray-300 focus:outline-none focus:border-blue-500'
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
                      value={formData.itemName}
                      onChange={handleChange}
                      className='ml-2 border-b border-gray-300 focus:outline-none focus:border-blue-500'
                    />
                  </p>
                </div>
                <div className='flex justify-between flex-wrap'>
                  <p className='mb-2'>
                    <span className='font-semibold'>Make / Model:</span>
                    <input
                      type='text'
                      name='makeModel'
                      value={formData.makeModel}
                      onChange={handleChange}
                      className='ml-2 border-b border-gray-300 focus:outline-none focus:border-blue-500'
                    />
                  </p>
                </div>
                <div className='flex justify-between flex-wrap'>
                  <p className='mb-2'>
                    <span className='font-semibold'>Sr.No.:</span>
                    <input
                      type='text'
                      name='serialNo'
                      value={formData.serialNo}
                      onChange={handleChange}
                      className='ml-2 border-b border-gray-300 focus:outline-none focus:border-blue-500'
                    />
                  </p>
                </div>
                <div className='flex justify-between flex-wrap'>
                  <p className='mb-2'>
                    <span className='font-semibold'>Target Date of completion:</span>
                    <input
                      type='text'
                      name='targetDate'
                      value={formData.targetDate}
                      onChange={handleChange}
                      className='ml-2 border-b border-gray-300 focus:outline-none focus:border-blue-500'
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
                    {parameters.map((parameter, index) => (
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
                        </td>
                        <td className='border border-black p-1'>
                          <input
                            type='date'
                            name='calibratedDate'
                            value={parameter.calibratedDate || ""}
                            onChange={(e) => handleParameterChange(e, index)}
                            className='w-full p-1'
                          />
                        </td>
                        <td className='border border-black p-1'>
                          <input
                            type='text'
                            name='remarks'
                            value={parameter.remarks || ""}
                            onChange={(e) => handleParameterChange(e, index)}
                            className='w-full p-1'
                          />
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
                  className={`py-2 px-4 rounded ${
                    showCalDataSheet
                      ? "bg-red-500 hover:bg-red-700"
                      : "bg-green-500 hover:bg-green-700"
                  } text-white cursor-pointer`}
                >
                  Show Calibration Data Sheet
                </button>
              </div>

              {/* Submit and Issued By Section */}
              <div className='flex justify-between items-center mt-8'>
                <div className='text-center'>
                  <p className='font-semibold'>Issued by</p>
                  <div className='mt-8 border-t border-gray-400 w-40 ml-auto'></div>
                </div>
                {!equipment.isCalibrated ? (
                  <div>
                    <div className='mt-2 flex justify-end'>
                      <button
                        type='button'
                        onClick={handleUpdateClick}
                        className='mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 cursor-pointer'
                      >
                        Update
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      ) : (
        <CalDataSheet
          product={equipment}
          save={handleSaveNewObservation}
          close={setCalDataSheetStatus}
          form={form}
        />
      )}
    </div>
  );
};

export default Tcard;
