import React, { useEffect, useState } from "react";
import { usePendingFormsStore } from "../utils/pendingForms";
import CalDataSheet from "./CalDataSheet";

const Tcard = ({ equipment, form, formOpen }) => {
  const { updateForm, fetchPendingForms } = usePendingFormsStore();
  const [newData, setNewData] = useState({});
  const [parameters, setParameters] = useState([...equipment.parameters]);
  const [showCalDataSheet, setCalDataSheetStatus] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [parameterErrors, setParameterErrors] = useState({});
  const [CDSerrors, setCDSErrors] = useState({ isValid: true });
  const [CDSValid, setCDSValid] = useState(false);

  const [formData, setFormData] = useState({
    ulrNo: form.URL_NO || "",
    jobNo: equipment.jobNo || "",
    jobCardIssueDate: form.createdAt ? new Date(form.createdAt).toLocaleDateString() : "",
    srfNo: form.srfNo || "",
    srfDate: form.createdAt,
    itemName: equipment.instrumentDescription || "",
    makeModel: equipment.instrumentDescription || "",
    serialNo: equipment.serialNo || "",
    targetDate: form.probableDate ? new Date(form.probableDate).toLocaleDateString() : "",
  });

  useEffect(() => {
    setFormData({
      ulrNo: form.URL_NO || "",
      jobNo: equipment.jobNo || "",
      jobCardIssueDate: form.createdAt ? new Date(form.createdAt).toLocaleDateString() : "",
      srfNo: form.srfNo || "",
      srfDate: form.createdAt ? new Date(form.createdAt).toLocaleDateString() : "",
      itemName: equipment.instrumentDescription || "",
      makeModel: equipment.make || "",
      serialNo: equipment.serialNo || "",
      targetDate: form.probableDate ? new Date(form.probableDate).toLocaleDateString() : "",
    });

    setParameters([...equipment.parameters]);
  }, [equipment, form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear error for the field being changed
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
  };

  const handleParameterChange = (e, index) => {
    const { name, value } = e.target;

    const updatedParameters = [...parameters];
    updatedParameters[index] = {
      ...updatedParameters[index],
      [name]: value,
    };
    setParameters(updatedParameters);

    setNewData((prevData) => ({
      ...prevData,
      parameters: updatedParameters,
    }));

    // Clear error for the parameter being changed
    setParameterErrors((prevErrors) => ({
      ...prevErrors,
      [index]: { ...prevErrors[index], [name]: null },
    }));
  };

  const validateParameters = () => {
    let errors = {};
    let isValid = true;

    parameters.forEach((parameter, index) => {
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
    if (!CDSValid) {
      setCDSErrors({ errors: "Please fill the Calibration Data Sheet", isValid: false });
      return false;
    }
    setCDSErrors({ isValid: true });
    return true;
  };
  const handleUpdateClick = async () => {
    const areParametersValid = validateParameters();
    const cdsValid = validateCDS();
    if (!areParametersValid || !cdsValid) {
      alert("Please correct the errors before updating.");
      return;
    }

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

  const handleSaveNewObservation = (readingData) => {
    setParameters((prevParameters) => {
      const updatedParameters = readingData.parameters || prevParameters;
      return updatedParameters;
    });

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
                      value={formData.ulrNo}
                      onChange={handleChange}
                      className='ml-2   '
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
                      value={formData.jobNo}
                      className='ml-2 w-20  '
                    />
                  </p>
                  <p className='mt-2'>
                    <span className='font-semibold'>Job Card Issue Date:</span>
                    <input
                      type='text'
                      name='jobCardIssueDate'
                      value={formData.jobCardIssueDate}
                      readOnly
                      className='ml-2  '
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
                    readOnly
                    className='ml-2  '
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
                      readOnly
                      className='ml-2  '
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
                      readOnly
                      className='ml-2  '
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
                      readOnly
                      className='ml-2  '
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
                      readOnly
                      className='ml-2  '
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
                            value={parameter.calibratedDate || ""}
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
                {!CDSerrors.isValid && (
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
          Data={newData}
          close={setCalDataSheetStatus}
          form={form}
          paramChange={handleParameterChange}
        />
      )}
    </div>
  );
};

export default Tcard;
