import React, { useState } from "react";
import { calculateReadingMean, calculateUE } from "../utils/calculations";
import masterEquipment from "../utils/masterEquipmentDetails";
import commonUnits from "../utils/commonUnits";
import { TrashIcon, PlusIcon, PencilIcon } from "@heroicons/react/24/solid";

const CalDataSheet = ({ product, save, close, form, Data, partialUpdate }) => {
  // Combined form data state
  const [formData, setFormData] = useState({
    // Read-only fields
    jobNo: product.jobNo,
    srfNo: form.srfNo,
    ulrNo: form.URL_NO,
    name: product.instrumentDescription,
    make: product.make,
    srNo: product.serialNo,
    recDate: new Date().toISOString().split("T")[0],

    // Editable fields
    Location: Data.Location || "",
    sensorType: Data.sensorType || "",
    resolution: Data.resolution || "",
    roomTemp: Data.roomTemp || "",
    roomTempValue: Data.roomTemp ? Data.roomTemp.split('±')[0].trim() : "",
    roomTempUncertainty: Data.roomTemp ? (Data.roomTemp.split('±')[1]?.trim() || "0") : "0",
    humidity: Data.humidity || "",
    detailsOfMasterUsed: Data.detailsOfMasterUsed || [],

    // Utility field for adding masters (not saved)
    selectedMaster: "",
  });
  // Add state to track which readings have editable Uc fields
  const [editableUc, setEditableUc] = useState({});

  // Handler to toggle Uc editability
  const toggleUcEditable = (paramIndex, readingIndex) => {
    const key = `${paramIndex}-${readingIndex}`;
    setEditableUc(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handler for manual Uc updates
  const handleUcChange = (paramIndex, readingIndex, value) => {
    // Validate numeric input
    if (value !== "" && !/^-?\d*\.?\d*$/.test(value)) {
      alert("Please enter a valid number format");
      return;
    }

    const newParameters = [...parameters];
    newParameters[paramIndex].readings[readingIndex].uc = value;
    setParameters(newParameters);
  };
  // Form validation errors
  const [formErrors, setFormErrors] = useState({});

  // Status messages for user feedback
  const [statusMessage, setStatusMessage] = useState({ message: "", type: "" });

  // Parameters state (separate as it's complex and requires special handling)
  const [parameters, setParameters] = useState(
    Data.parameters ||
    product.parameters.map((param) => ({
      ...param,
      readings: param.readings && param.readings.length > 0
        ? param.readings.map((reading) => ({ ...reading }))
        : [{
          rName: "",
          rUnit: "",
          r1: "",
          r2: "",
          r3: "",
          r4: "",
          r5: "",
          mean: "",
          uc: "",
          masterCertUncertainty: 0,
          ducResolution: 0,
          masterAccuracy: 0,
          stability: 0,
          repeatibility: 0,
        }]
    }))
  );

  // Handle general input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field if it exists
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Handle temperature change with uncertainty
  const handleTempChange = (field, value) => {
    let updatedFormData = { ...formData };

    if (field === 'roomTempValue') {
      const uncertainty = formData.roomTempUncertainty || "0";
      updatedFormData = {
        ...updatedFormData,
        roomTempValue: value,
        roomTemp: `${value} ± ${uncertainty}`
      };
    }
    else if (field === 'roomTempUncertainty') {
      const tempValue = formData.roomTempValue || "";
      updatedFormData = {
        ...updatedFormData,
        roomTempUncertainty: value,
        roomTemp: `${tempValue} ± ${value}`
      };
    }

    setFormData(updatedFormData);

    // Clear related errors
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Add a new range configuration for a parameter
  const handleAddRangeConfig = (paramIndex) => {
    // Get the source parameter
    const sourceParam = parameters[paramIndex];

    // Create a new parameter with same values but empty ranges and LC
    const newParam = {
      ...sourceParam,
      ranges: "", // Empty ranges for user to fill
      leastCount: "", // Empty least count for user to fill
      // Create new readings array with same structure but empty values
      readings: [{
        rName: "",
        rUnit: "",
        r1: "",
        r2: "",
        r3: "",
        r4: "",
        r5: "",
        mean: "",
        uc: "",
        masterCertUncertainty: 0,
        ducResolution: 0,
        masterAccuracy: 0,
        stability: 0,
        repeatibility: 0,
      }]
    };

    // Insert the new parameter right after the source one
    const newParameters = [...parameters];
    newParameters.splice(paramIndex + 1, 0, newParam);

    // Update state
    setParameters(newParameters);

    // Show success message
    setStatusMessage({
      message: "New range configuration added",
      type: "success"
    });

    // Auto-hide the message after 3 seconds
    setTimeout(() => {
      setStatusMessage({ message: "", type: "" });
    }, 3000);
  };

  // Function to remove a parameter (for range configurations)
  const handleRemoveParam = (paramIndex) => {
    // Prevent removing if there's only one parameter with this name
    const paramName = parameters[paramIndex].parameter;
    const sameNameCount = parameters.filter(p => p.parameter === paramName).length;

    if (sameNameCount <= 1) {
      setStatusMessage({
        message: "Cannot remove the only configuration for this parameter",
        type: "error"
      });

      setTimeout(() => {
        setStatusMessage({ message: "", type: "" });
      }, 3000);
      return;
    }

    // Remove the parameter
    const newParameters = [...parameters];
    newParameters.splice(paramIndex, 1);
    setParameters(newParameters);

    // Show success message
    setStatusMessage({
      message: "Range configuration removed",
      type: "success"
    });

    setTimeout(() => {
      setStatusMessage({ message: "", type: "" });
    }, 3000);
  };

  // Master equipment handlers
  const handleAddMaster = () => {
    if (formData.selectedMaster) {
      const masterToAdd = masterEquipment.find((item) => item.name === formData.selectedMaster);
      if (
        masterToAdd &&
        !formData.detailsOfMasterUsed.some((item) => item.name === masterToAdd.name)
      ) {
        setFormData({
          ...formData,
          detailsOfMasterUsed: [...formData.detailsOfMasterUsed, masterToAdd],
          selectedMaster: "" // Reset selection
        });
      }
    }
  };

  const handleRemoveMaster = (index) => {
    const updatedMasters = [...formData.detailsOfMasterUsed];
    updatedMasters.splice(index, 1);
    setFormData({
      ...formData,
      detailsOfMasterUsed: updatedMasters
    });
  };

  // Reading handlers
  const handleReadingChange = (paramIndex, readingIndex, field, value) => {
    // Validate numeric inputs for readings
    if (
      [
        "r1", "r2", "r3", "r4", "r5",
        "masterCertUncertainty", "ducResolution",
        "masterAccuracy", "stability", "repeatibility"
      ].includes(field) &&
      value !== "" &&
      !/^-?\d*\.?\d*$/.test(value)
    ) {
      alert("Please enter a valid number format");
      return;
    }

    // Validate unit input (no numbers)
    if (field === "rUnit" && /\d/.test(value)) {
      alert("Unit should be a string with letters, not numbers");
      return;
    }

    // Update parameter value
    const newParameters = [...parameters];
    newParameters[paramIndex].readings[readingIndex][field] = value;

    // Automatically calculate mean and UC when relevant fields change
    if (["r1", "r2", "r3", "r4", "r5",
      "masterCertUncertainty", "ducResolution",
      "masterAccuracy", "stability", "repeatibility"].includes(field)) {
      const updatedReading = newParameters[paramIndex].readings[readingIndex];
      updatedReading.mean = calculateReadingMean(updatedReading);
      updatedReading.uc = calculateUE(updatedReading);
    }

    setParameters(newParameters);
  };

  const addStdReading = (paramIndex) => {
    const newParameters = [...parameters];
    newParameters[paramIndex].readings.push({
      rName: "",
      rUnit: "",
      r1: "",
      r2: "",
      r3: "",
      r4: "",
      r5: "",
      mean: "",
      uc: "",
      masterCertUncertainty: 0,
      ducResolution: 0,
      masterAccuracy: 0,
      stability: 0,
      repeatibility: 0,
    });
    setParameters(newParameters);
  };

  const removeStdReading = (paramIndex, readingIndex) => {
    if (parameters[paramIndex].readings.length > 1) {
      const newParameters = [...parameters];
      newParameters[paramIndex].readings.splice(readingIndex, 1);
      setParameters(newParameters);
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    // Required field validation
    if (!formData.Location) errors.Location = "Location is required";
    if (!formData.sensorType) errors.sensorType = "Sensor Type is required";
    if (!formData.resolution) errors.resolution = "Resolution is required";
    if (!formData.roomTempValue) errors.roomTempValue = "Temperature value is required";
    if (!formData.humidity) errors.humidity = "Humidity is required";

    // Number validation
    if (formData.roomTempValue && !/^-?\d*\.?\d*$/.test(formData.roomTempValue)) {
      errors.roomTempValue = "Please enter a valid number";
    }

    if (formData.roomTempUncertainty && !/^\d*\.?\d*$/.test(formData.roomTempUncertainty)) {
      errors.roomTempUncertainty = "Please enter a valid positive number";
    }

    // At least one master equipment required
    if (formData.detailsOfMasterUsed.length === 0) {
      errors.detailsOfMasterUsed = "At least one master equipment is required";
    }

    // Validate readings
    const hasInvalidReadings = parameters.some(param =>
      param.readings.some(reading =>
        !reading.rName || !reading.rUnit ||
        !(reading.r1 || reading.r2 || reading.r3 || reading.r4 || reading.r5)
      )
    );

    if (hasInvalidReadings) {
      errors.readings = "All readings must have a name, unit, and at least one reading value";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Partial save without validation
  const handlePartialSave = () => {
    // Clear any previous status message
    setStatusMessage({ message: "", type: "" });

    try {
      // Build submission data (omitting UI-specific fields)
      const { selectedMaster, ...submissionData } = formData;

      // Save data as draft without validation
      save({
        ...submissionData,
        parameters,
        partialySaved: true  // Set the flag as defined in the model
      });
      partialUpdate();
      // Show success message
      setStatusMessage({
        message: "Progress saved as draft",
        type: "success"
      });

      // Auto-hide the message after 3 seconds
      setTimeout(() => {
        setStatusMessage({ message: "", type: "" });
      }, 3000);
    } catch (error) {
      setStatusMessage({
        message: "Error saving draft: " + error.message,
        type: "error"
      });
    }
  };

  // Form submission with validation
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) return;

    // Build submission data (omitting UI-specific fields)
    const { selectedMaster, ...submissionData } = formData;

    save({
      ...submissionData,
      parameters,
      partialySaved: false  // Completed calibration, not a draft
    });
  };

  return (
    <div className='border-2 border-gray-300 rounded-lg p-4'>
      <h1 className='text-2xl font-bold text-center mb-6'>ERROR DETECTOR</h1>

      {/* Status Message */}
      {statusMessage.message && (
        <div
          className={`mb-4 p-3 rounded-lg text-center ${statusMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
        >
          {statusMessage.message}
        </div>
      )}

      <form className='space-y-4' onSubmit={handleSubmit}>
        {/* Header Information */}
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium'>Job No</label>
            <input
              type='text'
              value={formData.jobNo}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>Rec. Date</label>
            <input
              type='date'
              value={formData.recDate}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>SRF No</label>
            <input
              type='text'
              value={formData.srfNo}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>ULR No</label>
            <input
              type='text'
              value={formData.ulrNo}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />
          </div>
        </div>

        {/* Details of Item to be Calibrated */}
        <h2 className='text-lg font-bold mt-6'>Details of Item to be Calibrated</h2>
        <div className='grid grid-cols-2 gap-4 mt-4'>
          <div>
            <label className='block text-sm font-medium'>Name</label>
            <input
              type='text'
              value={formData.name}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />

            <label className='block text-sm font-medium'>Make/Model</label>
            <input
              type='text'
              value={formData.make}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />
            <label className='block text-sm font-medium'>Sr. No.</label>
            <input
              type='text'
              value={formData.srNo}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />
          </div>
          <div>
            <div className='flex space-x-2'>
              <label className='block text-sm font-medium'>Location</label>
              {formErrors.Location && (
                <span className='text-red-500 text-sm'>{formErrors.Location}</span>
              )}
            </div>
            <input
              type='text'
              value={formData.Location}
              onChange={(e) => handleInputChange("Location", e.target.value)}
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
              placeholder='Enter Location'
            />

            <div className='flex space-x-2'>
              <label className='block text-sm font-medium'>Sensor Type</label>
              {formErrors.sensorType && (
                <span className='text-red-500 text-sm'>{formErrors.sensorType}</span>
              )}
            </div>
            <input
              type='text'
              value={formData.sensorType}
              onChange={(e) => handleInputChange("sensorType", e.target.value)}
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
              placeholder='Enter Sensor Type'
            />

            <div className='flex space-x-2'>
              <label className='block text-sm font-medium'>Resolution</label>
              {formErrors.resolution && (
                <span className='text-red-500 text-sm'>{formErrors.resolution}</span>
              )}
            </div>
            <input
              type='text'
              value={formData.resolution}
              onChange={(e) => handleInputChange("resolution", e.target.value)}
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
              placeholder='Enter Resolution'
            />
          </div>
        </div>

        {/* Environmental Conditions */}
        <h2 className='text-lg font-bold mt-6'>Environmental Conditions</h2>
        <div className='grid grid-cols-2 gap-4 mt-4'>
          <div>
            <label className='block text-sm font-medium'>Room Temperature (°C)</label>
            <div className='flex items-center space-x-2 mt-1'>
              <input
                type='text'
                className='block w-full border border-gray-300 rounded-md p-2'
                placeholder='Value'
                value={formData.roomTempValue}
                onChange={(e) => handleTempChange("roomTempValue", e.target.value)}
              />
              <span className='text-lg font-medium'>±</span>
              <input
                type='text'
                className='block w-full border border-gray-300 rounded-md p-2'
                placeholder='Uncertainty'
                value={formData.roomTempUncertainty}
                onChange={(e) => handleTempChange("roomTempUncertainty", e.target.value)}
              />
            </div>
            {formErrors.roomTempValue && (
              <span className='text-red-500 text-sm'>{formErrors.roomTempValue}</span>
            )}
            {formErrors.roomTempUncertainty && (
              <span className='text-red-500 text-sm'>{formErrors.roomTempUncertainty}</span>
            )}
          </div>
          <div>
            <label className='block text-sm font-medium'>Humidity (%)</label>
            <input
              type='text'
              value={formData.humidity}
              onChange={(e) => handleInputChange("humidity", e.target.value)}
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
              placeholder='Enter Humidity'
            />
            {formErrors.humidity && (
              <span className='text-red-500 text-sm'>{formErrors.humidity}</span>
            )}
          </div>
        </div>

        {/* Details of Master Used */}
        <h2 className='text-lg font-bold mt-6'>Details of Master Used</h2>
        <div className='mt-4'>
          <div className='flex space-x-2 mb-4'>
            <select
              value={formData.selectedMaster}
              onChange={(e) => handleInputChange("selectedMaster", e.target.value)}
              className='flex-grow border border-gray-300 rounded-md p-2'
            >
              <option value=''>Select Master Equipment</option>
              {masterEquipment.map((item, idx) => (
                <option key={idx} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>

            <button
              type='button'
              onClick={handleAddMaster}
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
            >
              Add
            </button>
          </div>

          {formErrors.detailsOfMasterUsed && (
            <span className='text-red-500 text-sm block mb-2'>{formErrors.detailsOfMasterUsed}</span>
          )}

          {formData.detailsOfMasterUsed.length > 0 && (
            <div className='border rounded-md p-4 mb-4'>
              <h3 className='font-medium mb-2'>Selected Equipment:</h3>
              <table className='w-full'>
                <thead>
                  <tr className='bg-gray-100'>
                    <th className='text-left p-2'>Name</th>
                    <th className='text-left p-2'>Make/Model</th>
                    <th className='text-left p-2'>Serial No.</th>
                    <th className='text-left p-2'>Certificate No.</th>
                    <th className='text-left p-2'>Valid Upto</th>
                    <th className='text-left p-2'>Calibrated By</th>
                    <th className='text-left p-2'>Traceable To</th>
                    <th className='text-center p-2'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.detailsOfMasterUsed.map((item, index) => (
                    <tr key={index} className='border-t'>
                      <td className='p-2'>{item.name}</td>
                      <td className='p-2'>{item.MakeModel}</td>
                      <td className='p-2'>{item.serialNo}</td>
                      <td className='p-2'>{item.CertificateNo}</td>
                      <td className='p-2'>{item.ValidUpto}</td>
                      <td className='p-2'>{item.CalibratedBy}</td>
                      <td className='p-2'>{item.TraceableTo}</td>
                      <td className='p-2 text-center'>
                        <button
                          type='button'
                          onClick={() => handleRemoveMaster(index)}
                          className='bg-red-500 text-white p-1 rounded hover:bg-red-600'
                        >
                          <TrashIcon className='h-4 w-4' />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Observation */}
        <h2 className='text-lg font-bold mt-6'>Observation</h2>
        {formErrors.readings && (
          <span className='text-red-500 text-sm block mb-2'>{formErrors.readings}</span>
        )}
        <div>
          {/* Parameters Section */}
          {parameters.map((param, paramIndex) => (
            <div key={paramIndex} className='mt-6 border p-4 rounded-md'>
              <div className='flex justify-between items-center mb-4'>
                <div className='grid grid-cols-5 gap-4 flex-grow'>
                  <div>
                    <label className='block text-sm font-medium'>Sl. NO.</label>
                    <input
                      type='text'
                      value={paramIndex + 1}
                      readOnly
                      className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium'>Parameter</label>
                    <input
                      type='text'
                      value={param.parameter}
                      readOnly
                      className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium'>Range</label>
                    <input
                      type='text'
                      value={param.ranges}
                      onChange={(e) => {
                        const updatedParameters = [...parameters];
                        updatedParameters[paramIndex].ranges = e.target.value;
                        setParameters(updatedParameters);
                      }}
                      className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium'>Accuracy</label>
                    <input
                      type='text'
                      value={param.accuracy}
                      readOnly
                      className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium'>Least Count</label>
                    <input
                      type='text'
                      name="leastCount"
                      value={param.leastCount}
                      onChange={(e) => {
                        const updatedParameters = [...parameters];
                        updatedParameters[paramIndex].leastCount = e.target.value;
                        setParameters(updatedParameters);
                      }}
                      className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                    />
                  </div>
                </div>

                {/* Range configuration buttons */}
                <div className='flex flex-col gap-2 ml-4'>
                  <button
                    type='button'
                    onClick={() => handleAddRangeConfig(paramIndex)}
                    title="Add new range configuration"
                    className='flex bg-green-500 text-white p-2 rounded-md hover:bg-green-600'
                  >
                    <PlusIcon className='h-5 w-5' />
                    <span className="text-xs">Add Range</span>
                  </button>

                  {/* Only show remove button if there are multiple configurations for this parameter */}
                  {parameters.filter(p => p.parameter === param.parameter).length > 1 && (
                    <button
                      type='button'
                      onClick={() => handleRemoveParam(paramIndex)}
                      title="Remove this range configuration"
                      className='flex justify-between bg-red-500 text-white p-2 rounded-md hover:bg-red-600'
                    >
                      <TrashIcon className='h-5 w-5' />
                      <span className="text-xs">Remove</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Reading table */}
              <div className='overflow-x-auto shadow-md rounded-lg'>
                <table className='w-full text-xs text-left text-gray-500 border-collapse'>
                  <thead>
                    <tr className='text-xs text-gray-700 uppercase bg-gray-50'>
                      <th className='px-2 py-1' colSpan={2}>STD./DUC</th>
                      <th className='px-2 py-1' colSpan='5'>Readings</th>
                      <th className='px-2 py-1' colSpan='4'>Details of Master</th>
                      <th className='px-2 py-1' colSpan='3'>Results</th>
                    </tr>
                    <tr className='bg-gray-100'>
                      <th className='px-2 py-1'></th>
                      <th className='px-1 py-1'>R1</th>
                      <th className='px-1 py-1'>R2</th>
                      <th className='px-1 py-1'>R3</th>
                      <th className='px-1 py-1'>R4</th>
                      <th className='px-1 py-1'>R5</th>
                      <th className='px-1 py-1' title='Master Cert Uncertainty'>MCU</th>
                      <th className='px-1 py-1' title='DUC Resolution'>DUCR</th>
                      <th className='px-1 py-1' title='Master Accuracy'>MA</th>
                      <th className='px-1 py-1' title='Stability'>St</th>
                      <th className='px-1 py-1' title='Repeatability'>Rp</th>
                      <th className='px-1 py-1'>Mean</th>
                      <th className='px-1 py-1'>Uc</th>
                      <th className='px-1 py-1'></th>
                    </tr>
                  </thead>
                  <tbody>
                    {param.readings.map((reading, readingIndex) => (
                      <tr key={readingIndex} className='bg-white hover:bg-gray-50'>
                        <td className='px-1 py-1'>
                          <div className='flex flex-nowrap items-center space-x-1'>
                            <input
                              type='text'
                              value={reading.rName}
                              onChange={(e) =>
                                handleReadingChange(
                                  paramIndex,
                                  readingIndex,
                                  "rName",
                                  e.target.value
                                )
                              }
                              className='w-1/2 border border-gray-300 rounded-md p-1 text-xs'
                              placeholder='Name'
                            />
                            <div className='flex w-1/2 relative'>
                              <input
                                type='text'
                                value={reading.rUnit}
                                onChange={(e) =>
                                  handleReadingChange(
                                    paramIndex,
                                    readingIndex,
                                    "rUnit",
                                    e.target.value
                                  )
                                }
                                className='w-2/3 border border-gray-300 rounded-l-md p-1 text-xs'
                                placeholder='Unit'
                              />
                              <select
                                value={commonUnits.some(u => u.value === reading.rUnit) ? reading.rUnit : ""}
                                onChange={(e) => {
                                  if (e.target.value) {
                                    handleReadingChange(paramIndex, readingIndex, "rUnit", e.target.value);
                                  }
                                }}
                                className='w-1/3 border border-gray-300 border-l-0 rounded-r-md p-1 text-xs'
                              >
                                <option value="">Units</option>
                                {commonUnits.map(unit => (
                                  <option key={unit.value} value={unit.value}>{unit.label}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </td>
                        {/* Reading fields R1-R5 */}
                        {["r1", "r2", "r3", "r4", "r5"].map((field) => (
                          <td key={field} className='px-1 py-1'>
                            <input
                              type='text'
                              value={reading[field]}
                              onChange={(e) =>
                                handleReadingChange(paramIndex, readingIndex, field, e.target.value)
                              }
                              className='w-full border border-gray-300 rounded-md p-1 text-xs'
                            />
                          </td>
                        ))}

                        {/* Master detail fields */}
                        {["masterCertUncertainty", "ducResolution", "masterAccuracy",
                          "stability", "repeatibility"].map((field) => (
                            <td key={field} className='px-1 py-1'>
                              <input
                                type='text'
                                value={reading[field]}
                                onChange={(e) =>
                                  handleReadingChange(paramIndex, readingIndex, field, e.target.value)
                                }
                                className='w-full border border-gray-300 rounded-md p-1 text-xs'
                              />
                            </td>
                          ))}

                        {/* Result fields */}
                        <td className='px-1 py-1'>
                          <input
                            type='text'
                            value={reading.mean}
                            readOnly
                            className='w-full border border-gray-300 rounded-md p-1 bg-gray-100 text-xs'
                          />
                        </td>
                        <td className='px-1 py-1'>
                          <input
                            type='text'
                            value={reading.uc}
                            readOnly={!editableUc[`${paramIndex}-${readingIndex}`]}
                            onChange={(e) =>
                              handleUcChange(paramIndex, readingIndex, e.target.value)
                            }
                            className={`w-full border border-gray-300 rounded-md p-1 text-xs ${editableUc[`${paramIndex}-${readingIndex}`]
                              ? 'bg-white'
                              : 'bg-gray-100'
                              }`}
                          />
                        </td>
                        <td className='px-1 py-1'>
                          <div className="flex space-x-1">
                            {/* Edit Uc button */}
                            <button
                              type='button'
                              onClick={() => toggleUcEditable(paramIndex, readingIndex)}
                              title={editableUc[`${paramIndex}-${readingIndex}`] ? "Apply manual Uc" : "Override Uc value"}
                              className={`p-1 rounded-md cursor-pointer ${editableUc[`${paramIndex}-${readingIndex}`]
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-blue-500 hover:bg-blue-600'
                                } text-white`}
                            >
                              <PencilIcon className='h-3 w-3' />
                            </button>

                            {/* Existing delete button */}
                            {param.readings.length > 1 && (
                              <button
                                type='button'
                                onClick={() => removeStdReading(paramIndex, readingIndex)}
                                className='bg-red-500 text-white p-1 rounded-md hover:bg-red-600 cursor-pointer'
                                title="Remove this reading"
                              >
                                <TrashIcon className='h-3 w-3' />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type='button'
                onClick={() => addStdReading(paramIndex)}
                className='mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer'
              >
                Add STD./DUC Reading
              </button>
            </div>
          ))}

          {/* Form Buttons */}
          <div className='flex justify-end space-x-4 mt-6'>
            <button
              type='button'
              onClick={() => close(false)}
              className='bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 cursor-pointer'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={handlePartialSave}
              className='bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 cursor-pointer'
            >
              Save Draft
            </button>
            <button
              type='submit'
              className='bg-blue-500 object-bottom text-white px-6 py-2 rounded hover:bg-blue-600 cursor-pointer'
            >
              Save & Complete
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CalDataSheet;