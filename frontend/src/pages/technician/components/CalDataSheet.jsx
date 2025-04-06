import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";

const CalDataSheet = ({ product, save, close, form, Data }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      Location: Data.Location || "",
      sensorType: Data.sensorType || "",
      resolution: Data.resolution || "",
      roomTemp: Data.roomTemp || "",
      humidity: Data.humidity || "",
      selectedMaster: "",
      recDate: new Date().toISOString().split("T")[0],
    },
  });
  const selectedMaster = watch("selectedMaster");
  const [formData, setFormData] = useState({
    jobNo: product.jobNo,
    srfNo: form.srfNo,
    ulrNo: form.URL_NO,
    name: product.instrumentDescription,
    make: product.make,
    srNo: product.serialNo,
  });
  const [newData, setNewData] = useState({
    Location: Data.Location || "",
    sensorType: Data.sensorType || "",
    resolution: Data.resolution || "",
    roomTemp: Data.roomTemp || "",
    humidity: Data.humidity || "",
    detailsOfMasterUsed: Data.detailsOfMasterUsed || [],
    recDate: new Date().toISOString().split("T")[0],
  });
  const [parameters, setParameters] = useState(
    Data.parameters ||
      product.parameters.map((param) => ({
        ...param,
        readings: param.readings.map((reading) => ({
          ...reading,
        })),
      }))
  );
  // Details of Master Used section
  const masterEquipment = [
    { name: "5½ Digit Multifunction Calibrator With Current Coil", serialNo: "20140557A ED/CC-02" },
    { name: "5½ Digit Multifunction Calibrator", serialNo: "20140557 ED/MFC-02" },
    { name: "6½ Digit Digital Multimeter", serialNo: "2654101 ED/DMM-03" },
    { name: "Decade Capacitance Box", serialNo: "121001 ED/DCB-01" },
    { name: "Decade Inductance Box", serialNo: "121201 ED/DIB-01" },
    { name: "Decade Resistance Box", serialNo: "201008205 ED/RB-02" },
    { name: "Digital Anemo Meter", serialNo: "ED/DAM-01" },
    { name: "Digital Clampmeter", serialNo: "110500541 ED/DCM-01" },
    { name: "Digital IR Thermo Meter", serialNo: "11018053 ED/IT(M-16)-01" },
    { name: "Digital Multimeter (5¾ Digit)", serialNo: "LG0171 ED/DMM-01" },
    { name: "Digital Pressure Calibrator", serialNo: "60303803 ED/DPC/01" },
    { name: "Digital Pressure gauge", serialNo: "NAIM1904001 ED/PG/700/06" },
    { name: "Digital Pressure gauge", serialNo: "007417 ED/LPG9300/03" },
    { name: "Digital Tachometar", serialNo: "747; ED/DTM-01" },
    { name: "Digital Thermometer", serialNo: "T0103;ED/THEM/01" },
    { name: "Digital Timer", serialNo: "2021031701; ED/TIMER-01" },
    { name: "Digital Vibration Meter with Sensor", serialNo: "1572" },
    { name: "Gold Plated Low Resistance Box", serialNo: "11122002 ED/RB-01" },
    { name: "High Voltage Probe with DMM", serialNo: "95290020;ED/HVP-01" },
    { name: "Meg ohm Box", serialNo: "38000208;ED/DMM-02" },
    { name: "Multiproduct Calibrator 5500A", serialNo: "102010 ED/MOHM-01" },
    { name: "Multiproduct Calibrator With Current Coil", serialNo: "6530020 ED/MFC-03" },
    { name: "Precission C.T", serialNo: "6530020 201008204A" },
    { name: "Process Source", serialNo: "12952 995115358 ED/PS/01" },
    { name: "S Type Thermometer with Temp Indicator", serialNo: "2426/T0103 ED/TC(S)/STD/01" },
    { name: "Slip Gauge Block Set", serialNo: "8419" },
    { name: "SPRT Sensor", serialNo: "1405 ED/SPRT/STD/01" },
    { name: "Standard Resistance box", serialNo: "210212 ED/SRB-02" },
    { name: "Temperature Calibrator", serialNo: "99431127 ED/TC-01" },
  ];

  const handleAddMaster = () => {
    if (selectedMaster) {
      const masterToAdd = masterEquipment.find((item) => item.name === selectedMaster);
      if (
        masterToAdd &&
        !newData.detailsOfMasterUsed.some((item) => item.name === masterToAdd.name)
      ) {
        setNewData({
          ...newData,
          detailsOfMasterUsed: [...newData.detailsOfMasterUsed, masterToAdd],
        });
        setValue("selectedMaster", ""); // Reset the select field
      }
    }
  };

  const handleRemoveMaster = (index) => {
    const updatedMasters = [...newData.detailsOfMasterUsed];
    updatedMasters.splice(index, 1);
    setNewData({
      ...newData,
      detailsOfMasterUsed: updatedMasters,
    });
  };
  // Calculation functions for each reading
  const calculateReadingMean = (readings) => {
    const numericReadings = ["r1", "r2", "r3", "r4", "r5"]
      .map((key) => parseFloat(readings[key]))
      .filter((val) => !isNaN(val) && val !== null);

    if (numericReadings.length === 0) return "";

    const mean = numericReadings.reduce((acc, val) => acc + val, 0) / numericReadings.length;
    return mean;
  };
  const calculateStdDev = (readings) => {
    const numericReadings = ["r1", "r2", "r3", "r4", "r5"]
      .map((key) => parseFloat(readings[key]))
      .filter((val) => !isNaN(val) && val !== null);

    if (numericReadings.length <= 1) return 0;

    const mean = numericReadings.reduce((acc, val) => acc + val, 0) / numericReadings.length;
    const squaredDiffs = numericReadings.map((val) => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / (numericReadings.length - 1);

    return Math.sqrt(variance);
  };
  const calculateStdUncertainty = (readings) => {
    const stdDev = parseFloat(calculateStdDev(readings));
    const numericReadings = ["r1", "r2", "r3", "r4", "r5"]
      .map((key) => parseFloat(readings[key]))
      .filter((val) => !isNaN(val) && val !== null);

    return numericReadings.length > 0 ? stdDev / Math.sqrt(numericReadings.length) : "";
  };
  const calculateUC = (reading) => {
    const u1 = parseFloat(reading.masterCertUncertainty) / 2 || 0;
    const u2 = parseFloat(reading.ducResolution) / (2 * Math.sqrt(3)) || 0;
    const u3 = parseFloat(reading.masterAccuracy) / Math.sqrt(3) || 0;
    const u5 = parseFloat(reading.stability) / Math.sqrt(3) || 0;
    const stdUncertainty = parseFloat(calculateStdUncertainty(reading)) || 0;

    const uc = Math.sqrt(
      Math.pow(stdUncertainty, 2) +
        Math.pow(u1, 2) +
        Math.pow(u2, 2) +
        Math.pow(u3, 2) +
        Math.pow(u5, 2)
    );
    return uc;
  };
  const calculateEDof = (reading) => {
    const stdUncertainty = parseFloat(calculateStdUncertainty(reading)) || 0;
    const combinedUncertainty = parseFloat(calculateUC(reading)) || 0;

    if (stdUncertainty === 0) return "N/A";

    return 4 * (Math.pow(combinedUncertainty, 4) / Math.pow(stdUncertainty, 4));
  };
  const calculateUE = (reading) => {
    const uc = parseFloat(calculateUC(reading)) || 0;
    const edof = parseFloat(calculateEDof(reading)) || 0;
    let kAt95CL = 2;

    if (edof < 30) {
      const tDistribution = {
        1: 12.71,
        2: 4.3,
        3: 3.18,
        4: 2.78,
        5: 2.57,
        6: 2.45,
        7: 2.36,
        8: 2.31,
        9: 2.26,
        10: 2.23,
        11: 2.2,
        12: 2.18,
        13: 2.16,
        14: 2.14,
        15: 2.13,
        16: 2.12,
        17: 2.11,
        18: 2.1,
        19: 2.09,
        20: 2.09,
        21: 2.08,
        22: 2.07,
        23: 2.07,
        24: 2.06,
        25: 2.06,
        26: 2.06,
        27: 2.05,
        28: 2.05,
        29: 2.05,
      };
      kAt95CL = tDistribution[Math.round(edof)] || 2;
    }

    const rNameValue = parseFloat(reading.rName) || 1; // Avoid division by zero
    if (reading.rUnit === "degC") {
      return (uc * kAt95CL).toFixed(4);
    }
    return ((uc * kAt95CL * 100) / rNameValue).toFixed(4);
  };
  const handleReadingChange = (paramIndex, readingIndex, field, value) => {
    const newParameters = [...parameters];

    // Validate numeric inputs for readings
    if (
      [
        "rName",
        "r1",
        "r2",
        "r3",
        "r4",
        "r5",
        "masterCertUncertainty",
        "ducResolution",
        "masterAccuracy",
        "stability",
        "repeatibility",
      ].includes(field)
    ) {
      // Allow only numbers and decimal point
      if (value !== "" && !/^-?\d*\.?\d*$/.test(value)) {
        alert("Please enter a valid number format");
        return; // Don't update if not a valid number format
      }
    }

    newParameters[paramIndex].readings[readingIndex][field] = value;

    // Automatically calculate mean and UC
    const updatedReading = newParameters[paramIndex].readings[readingIndex];
    updatedReading.mean = calculateReadingMean(updatedReading);
    updatedReading.uc = calculateUE(updatedReading);

    setParameters(newParameters);
  };
  const addStdReading = (paramIndex) => {
    const newReadings = [...parameters];
    newReadings[paramIndex].readings.push({
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
    setParameters(newReadings);
  };
  const removeStdReading = (paramIndex, readingIndex) => {
    const newParameters = [...parameters];
    // Only allow removal if there's more than one reading
    if (newParameters[paramIndex].readings.length > 1) {
      newParameters[paramIndex].readings.splice(readingIndex, 1);
      setParameters(newParameters);
    }
  };

  // console.log(parameters);
  return (
    <div className='border-2 border-gray-300 rounded-lg p-4'>
      <h1 className='text-2xl font-bold text-center mb-6'>ERROR DETECTOR</h1>
      <form
        className='space-y-4'
        onSubmit={handleSubmit((data) => {
          // Validate all readings have at least name, unit and one reading
          const isReadingsValid = parameters.every((param) =>
            param.readings.every(
              (reading) =>
                reading.rName &&
                reading.rUnit &&
                (reading.r1 || reading.r2 || reading.r3 || reading.r4 || reading.r5)
            )
          );

          if (!isReadingsValid) {
            alert("Please ensure all readings have a name, unit, and at least one reading value");
            return;
          }
          if (newData.detailsOfMasterUsed.length === 0) {
            alert("Please add at least one master equipment");
            return;
          }
          save({
            parameters: parameters,
            ...data,
            detailsOfMasterUsed: newData.detailsOfMasterUsed,
          });
        })}
      >
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
              value={newData.recDate}
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
              {errors.Location && (
                <span className='text-red-500 text-sm'>{errors.Location.message}</span>
              )}
            </div>
            <input
              {...register("Location", { required: "Location is required" })}
              type='text'
              value={newData.Location}
              onChange={(e) => setNewData((prev) => ({ ...prev, Location: e.target.value }))}
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
              placeholder='Enter Location'
            />
            <div className='flex space-x-2'>
              <label className='block text-sm font-medium'>Sensor Type</label>
              {errors.sensorType && (
                <span className='text-red-500 text-sm'>{errors.sensorType.message}</span>
              )}
            </div>
            <input
              type='text'
              {...register("sensorType", { required: "Sensor Type is required" })}
              value={newData.sensorType}
              onChange={(e) => setNewData((prev) => ({ ...prev, sensorType: e.target.value }))}
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
              placeholder='Enter Sensor Type'
            />

            <div className='flex space-x-2'>
              <label className='block text-sm font-medium'>Resolution</label>
              {errors.resolution && (
                <span className='text-red-500 text-sm'>{errors.resolution.message}</span>
              )}
            </div>
            <input
              type='text'
              {...register("resolution", { required: "Resolution is required" })}
              value={newData.resolution}
              onChange={(e) => setNewData((prev) => ({ ...prev, resolution: e.target.value }))}
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
            <input
              {...register("roomTemp", {
                required: "Room Temperature is required",
                pattern: {
                  value: /^-?\d+(\.\d+)?$/,
                  message: "Please enter a valid number",
                },
              })}
              type='text'
              value={newData.roomTemp}
              onChange={(e) => setNewData((prev) => ({ ...prev, roomTemp: e.target.value }))}
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
              placeholder='Enter Room Temp'
            />
            {errors.roomTemp && (
              <span className='text-red-500 text-sm'>{errors.roomTemp.message}</span>
            )}
          </div>
          <div>
            <label className='block text-sm font-medium'>Humidity (%)</label>
            <input
              type='text'
              {...register("humidity", {
                required: "Humidity is required",
                pattern: {
                  value: /^(100|[1-9]?\d)$/,
                  message: "Please enter a valid percentage (0-100)",
                },
              })}
              value={newData.humidity}
              onChange={(e) => setNewData((prev) => ({ ...prev, humidity: e.target.value }))}
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
              placeholder='Enter Humidity'
            />
            {errors.humidity && (
              <span className='text-red-500 text-sm'>{errors.humidity.message}</span>
            )}
          </div>
        </div>
        {/* details of master used */}
        <h2 className='text-lg font-bold mt-6'>Details of Master Used</h2>
        <div className='mt-4'>
          <div className='flex space-x-2 mb-4'>
            <select
              {...register("selectedMaster")}
              className='flex-grow border border-gray-300 rounded-md p-2'
            >
              <option value=''>Select Master Equipment</option>
              {masterEquipment.map((item, idx) => (
                <option
                  key={idx}
                  value={item.name}
                >
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
          {errors.selectedMaster && (
            <span className='text-red-500 text-sm'>{errors.selectedMaster.message}</span>
          )}

          {newData.detailsOfMasterUsed.length > 0 && (
            <div className='border rounded-md p-4 mb-4'>
              <h3 className='font-medium mb-2'>Selected Equipment:</h3>
              <table className='w-full'>
                <thead>
                  <tr className='bg-gray-100'>
                    <th className='text-left p-2'>Name</th>
                    <th className='text-left p-2'>Serial No.</th>
                    <th className='text-center p-2'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {newData.detailsOfMasterUsed.map((item, index) => (
                    <tr
                      key={index}
                      className='border-t'
                    >
                      <td className='p-2'>{item.name}</td>
                      <td className='p-2'>{item.serialNo}</td>
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
        <div>
          {/* Parameters Section */}
          {parameters.map((param, paramIndex) => (
            <div
              key={paramIndex}
              className='mt-6 border p-4 rounded-md'
            >
              <div className='grid grid-cols-4 gap-4 mb-4'>
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
                  <label className='block text-sm font-medium'>Range & L.C</label>
                  <input
                    type='text'
                    value={param.ranges}
                    readOnly
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
              </div>

              {/* STD/DUC Readings */}
              <div className='overflow-x-auto shadow-md rounded-lg'>
                <table className='w-full text-xs text-left text-gray-500 border-collapse'>
                  <thead>
                    <tr className='text-xs text-gray-700 uppercase bg-gray-50'>
                      <th className='px-2 py-1'>STD./DUC</th>
                      <th
                        className='px-2 py-1'
                        colSpan='5'
                      >
                        Readings
                      </th>
                      <th
                        className='px-2 py-1'
                        colSpan='4'
                      >
                        Details of Master
                      </th>
                      <th
                        className='px-2 py-1'
                        colSpan='2'
                      >
                        Results
                      </th>
                    </tr>
                    <tr className='bg-gray-100'>
                      <th className='px-2 py-1'></th>
                      <th className='px-1 py-1'>R1</th>
                      <th className='px-1 py-1'>R2</th>
                      <th className='px-1 py-1'>R3</th>
                      <th className='px-1 py-1'>R4</th>
                      <th className='px-1 py-1'>R5</th>
                      <th
                        className='px-1 py-1'
                        title='Master Cert Uncertainty'
                      >
                        MCU
                      </th>
                      <th
                        className='px-1 py-1'
                        title='DUC Resolution'
                      >
                        DUCR
                      </th>
                      <th
                        className='px-1 py-1'
                        title='Master Accuracy'
                      >
                        MA
                      </th>
                      <th
                        className='px-1 py-1'
                        title='Stability'
                      >
                        St
                      </th>
                      <th
                        className='px-1 py-1'
                        title='Readibility'
                      >
                        Rd
                      </th>
                      <th className='px-1 py-1'>Mean</th>
                      <th className='px-1 py-1'>Uc</th>
                      <th className='px-1 py-1'></th>
                    </tr>
                  </thead>
                  <tbody>
                    {param.readings.map((reading, readingIndex) => (
                      <tr
                        key={readingIndex}
                        className='bg-white hover:bg-gray-50'
                      >
                        <td className='px-1 py-1'>
                          <div className='flex space-x-1'>
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
                            />
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
                              className='w-1/2 border border-gray-300 rounded-md p-1 text-xs'
                            />
                          </div>
                        </td>
                        <td className='px-1 py-1'>
                          <input
                            type='text'
                            value={reading.r1}
                            onChange={(e) =>
                              handleReadingChange(paramIndex, readingIndex, "r1", e.target.value)
                            }
                            className='w-full border border-gray-300 rounded-md p-1 text-xs'
                          />
                        </td>
                        <td className='px-1 py-1'>
                          <input
                            type='text'
                            value={reading.r2}
                            onChange={(e) =>
                              handleReadingChange(paramIndex, readingIndex, "r2", e.target.value)
                            }
                            className='w-full border border-gray-300 rounded-md p-1 text-xs'
                          />
                        </td>
                        <td className='px-1 py-1'>
                          <input
                            type='text'
                            value={reading.r3}
                            onChange={(e) =>
                              handleReadingChange(paramIndex, readingIndex, "r3", e.target.value)
                            }
                            className='w-full border border-gray-300 rounded-md p-1 text-xs'
                          />
                        </td>
                        <td className='px-1 py-1'>
                          <input
                            type='text'
                            value={reading.r4}
                            onChange={(e) =>
                              handleReadingChange(paramIndex, readingIndex, "r4", e.target.value)
                            }
                            className='w-full border border-gray-300 rounded-md p-1 text-xs'
                          />
                        </td>
                        <td className='px-1 py-1'>
                          <input
                            type='text'
                            value={reading.r5}
                            onChange={(e) =>
                              handleReadingChange(paramIndex, readingIndex, "r5", e.target.value)
                            }
                            className='w-full border border-gray-300 rounded-md p-1 text-xs'
                          />
                        </td>
                        <td className='px-1 py-1'>
                          <input
                            type='text'
                            value={reading.masterCertUncertainty}
                            onChange={(e) =>
                              handleReadingChange(
                                paramIndex,
                                readingIndex,
                                "masterCertUncertainty",
                                e.target.value
                              )
                            }
                            className='w-full border border-gray-300 rounded-md p-1 text-xs'
                          />
                        </td>
                        <td className='px-1 py-1'>
                          <input
                            type='text'
                            value={reading.ducResolution}
                            onChange={(e) =>
                              handleReadingChange(
                                paramIndex,
                                readingIndex,
                                "ducResolution",
                                e.target.value
                              )
                            }
                            className='w-full border border-gray-300 rounded-md p-1 text-xs'
                          />
                        </td>
                        <td className='px-1 py-1'>
                          <input
                            type='text'
                            value={reading.masterAccuracy}
                            onChange={(e) =>
                              handleReadingChange(
                                paramIndex,
                                readingIndex,
                                "masterAccuracy",
                                e.target.value
                              )
                            }
                            className='w-full border border-gray-300 rounded-md p-1 text-xs'
                          />
                        </td>
                        <td className='px-1 py-1'>
                          <input
                            type='text'
                            value={reading.stability}
                            onChange={(e) =>
                              handleReadingChange(
                                paramIndex,
                                readingIndex,
                                "stability",
                                e.target.value
                              )
                            }
                            className='w-full border border-gray-300 rounded-md p-1 text-xs'
                          />
                        </td>
                        <td className='px-1 py-1'>
                          <input
                            type='text'
                            value={reading.repeatibility}
                            onChange={(e) =>
                              handleReadingChange(
                                paramIndex,
                                readingIndex,
                                "repeatibility",
                                e.target.value
                              )
                            }
                            className='w-full border border-gray-300 rounded-md p-1 text-xs'
                          />
                        </td>
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
                            readOnly
                            className='w-full border border-gray-300 rounded-md p-1 bg-gray-100 text-xs'
                          />
                        </td>
                        <td className='px-1 py-1'>
                          {param.readings.length > 1 && (
                            <button
                              type='button'
                              onClick={() => removeStdReading(paramIndex, readingIndex)}
                              className='bg-red-500 text-white p-1 rounded-md hover:bg-red-600 cursor-pointer'
                            >
                              <TrashIcon className='h-3 w-3' />
                            </button>
                          )}
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
          <div className='flex justify-end space-x-4 mt-6'>
            <button
              type='button'
              onClick={() => close(false)}
              className='bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 cursor-pointer'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='bg-blue-500 object-bottom text-white px-6 py-2 rounded hover:bg-blue-600 cursor-pointer'
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CalDataSheet;
