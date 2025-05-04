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
  // Details of Master Used section
  const masterEquipment = [
    {
      name: "5½ Digit Multifunction Calibrator With Current Coil",
      MakeModel: "ZEAL/ZSMFC5.5 & ZEAL/ZMCC",
      serialNo: "20140557A ED/CC-02",
      CertificateNo: "CAL/24-25/N/CC/020",
      ValidUpto: "05.06.2025",
      CalibratedBy: "Nashik Engineering Cluster",
      TraceableTo: "NPL"
    },
    {
      name: "5½ Digit Multifunction Calibrator",
      MakeModel: "ZEAL/ZSMFC5.5",
      serialNo: "20140557 ED/MFC-02",
      CertificateNo: "CAL/24-25/CC/0173-1",
      ValidUpto: "05.06.2025",
      CalibratedBy: "Nashik Engineering Cluster",
      TraceableTo: "NPL"
    },
    {
      name: "6½ Digit Digital Multimeter",
      MakeModel: "TEKTRONIX DMM4040",
      serialNo: "2654101 ED/DMM-03",
      CertificateNo: "CAL/24-25/CC/0377-1",
      ValidUpto: "17.08.2025",
      CalibratedBy: "Nashik Engineering Cluster",
      TraceableTo: "NPL"
    },
    {
      name: "Decade Capacitance Box",
      MakeModel: "Agronic CDB6",
      serialNo: "121001 ED/DCB-01",
      CertificateNo: "CAL/24-25/CC/0228-2",
      ValidUpto: "23.06.2025",
      CalibratedBy: "Nashik Engineering Cluster",
      TraceableTo: "NPL"
    },
    {
      name: "Decade Inductance Box",
      MakeModel: "Agronic LDB6",
      serialNo: "121201 ED/DIB-01",
      CertificateNo: "CAL/24-25/CC/0228-3",
      ValidUpto: "23.06.2025",
      CalibratedBy: "Nashik Engineering Cluster",
      TraceableTo: "NPL"
    },
    {
      name: "Decade Resistance Box",
      MakeModel: "ZEAL ZSDRB",
      serialNo: "201008205 ED/RB-02",
      CertificateNo: "CAL/24-25/CC/0270-1",
      ValidUpto: "06.07.2025",
      CalibratedBy: "Nashik Engineering Cluster",
      TraceableTo: "NPL"
    },
    {
      name: "Digital Anemo Meter",
      MakeModel: "Lutron AM 4201",
      serialNo: "ED/DAM-01",
      CertificateNo: "CL-027-04/2024-01",
      ValidUpto: "14.04.2025",
      CalibratedBy: "CAL LABS",
      TraceableTo: "NPL"
    },
    {
      name: "Digital Clampmeter",
      MakeModel: "Metravi/Metraclamp-20",
      serialNo: "110500541 ED/DCM-01",
      CertificateNo: "TSC/24-25/1572-2",
      ValidUpto: "12.04.2025",
      CalibratedBy: "Transcal Technologies LLP",
      TraceableTo: "NPL"
    },
    {
      name: "Digital IR Thermo Meter",
      MakeModel: "Metravi MT-16",
      serialNo: "11018053 ED/IT(M-16)-01",
      CertificateNo: "TSC/24-25/16266-4",
      ValidUpto: "16.12.2025",
      CalibratedBy: "Transcal Technologies LLP",
      TraceableTo: "NPL"
    },
    {
      name: "Digital Multimeter (5¾ Digit)",
      MakeModel: "Gaussen Metra Watt/Metrahit-29S",
      serialNo: "LG0171 ED/DMM-01",
      CertificateNo: "CAL/24-25/CC/0428-1",
      ValidUpto: "11.09.2025",
      CalibratedBy: "Nashik Engineering Cluster",
      TraceableTo: "NPL"
    },
    {
      name: "Digital Pressure Calibrator",
      MakeModel: "Druck DPI 603",
      serialNo: "60303803 ED/DPC/01",
      CertificateNo: "TSC/24-25/16266-1",
      ValidUpto: "16.12.2025",
      CalibratedBy: "Transcal Technologies LLP",
      TraceableTo: "NPL"
    },
    {
      name: "Digital Pressure gauge",
      MakeModel: "Adarsh EN-501",
      serialNo: "NAIM1904001 ED/PG/700/06",
      CertificateNo: "TSC/24-25/5928-2",
      ValidUpto: "01.07.2025",
      CalibratedBy: "Transcal Technologies LLP",
      TraceableTo: "NPL"
    },
    {
      name: "Digital Pressure gauge",
      MakeModel: "Sika",
      serialNo: "007417 ED/LPG9300/03",
      CertificateNo: "TSC/24-25/5928-1",
      ValidUpto: "01.07.2025",
      CalibratedBy: "Transcal Technologies LLP",
      TraceableTo: "NPL"
    },
    {
      name: "Digital Tachometar",
      MakeModel: "Line Seiki TM-4000",
      serialNo: "747; ED/DTM-01",
      CertificateNo: "TSC/24-25/16266-02",
      ValidUpto: "16.12.2025",
      CalibratedBy: "Transcal Technologies LLP",
      TraceableTo: "NPL"
    },
    {
      name: "Digital Thermometer",
      MakeModel: "Tempsens Tempet 09-02",
      serialNo: "T0103;ED/THEM/01",
      CertificateNo: "TSC/24-25/16266-6",
      ValidUpto: "16.12.2026",
      CalibratedBy: "Transcal Technologies LLP",
      TraceableTo: "NPL"
    },
    {
      name: "Digital Timer",
      MakeModel: "Hitech Instruments/ HTI369PTMR",
      serialNo: "2021031701; ED/TIMER-01",
      CertificateNo: "TSC/24-25/2105-01",
      ValidUpto: "25.04.2025",
      CalibratedBy: "Transcal Technologies LLP",
      TraceableTo: "NPL"
    },
    {
      name: "Digital Vibration Meter with Sensor",
      MakeModel: "MCM/AVD-80",
      serialNo: "1572",
      CertificateNo: "TSC/24-25/20379-1",
      ValidUpto: "20.02.2026",
      CalibratedBy: "Transcal Technologies LLP",
      TraceableTo: "NPL"
    },
    {
      name: "Gold Plated Low Resistance Box",
      MakeModel: "Hitech Instruments",
      serialNo: "11122002 ED/RB-01",
      CertificateNo: "CAL/24-25/CC/0270-2",
      ValidUpto: "06.07.2025",
      CalibratedBy: "Nashik Engineering Cluster",
      TraceableTo: "NPL"
    },
    {
      name: "High Voltage Probe with DMM",
      MakeModel: "Fluke, 80K-40 DMM: APPA 505",
      serialNo: "95290020;ED/HVP-01 38000208;ED/DMM-02",
      CertificateNo: "C&IJ/CAL/25-02/132",
      ValidUpto: "25.02.2026",
      CalibratedBy: "C&I Calibrations Pvt.Ltd.",
      TraceableTo: "NPL"
    },
    {
      name: "Meg ohm Box",
      MakeModel: "Sigma Instrumments",
      serialNo: "102010 ED/MOHM-01",
      CertificateNo: "CAL/24-25/CC/0228-1",
      ValidUpto: "23.06.2025",
      CalibratedBy: "Nashik Engineering Cluster",
      TraceableTo: "NPL"
    },
    {
      name: "Multiproduct Calibrator 5500A",
      MakeModel: "FLUKE/5500A",
      serialNo: "6530020 ED/MFC-03",
      CertificateNo: "CAL/25/CC/057-1",
      ValidUpto: "27.01.2026",
      CalibratedBy: "Nashik Engineering Cluster",
      TraceableTo: "NPL"
    },
    {
      name: "Multiproduct Calibrator With Current Coil",
      MakeModel: "FLUKE/5500A Zeal/ZMCC",
      serialNo: "6530020... 201008204A",
      CertificateNo: "CAL/25/N/CC/011",
      ValidUpto: "26.01.2026",
      CalibratedBy: "Nashik Engineering Cluster",
      TraceableTo: "NPL"
    },
    {
      name: "Precission C.T",
      MakeModel: "Meco-v",
      serialNo: "12952",
      CertificateNo: "",
      ValidUpto: "",
      CalibratedBy: "",
      TraceableTo: ""
    },
    {
      name: "Process Source",
      MakeModel: "Metravi/11+",
      serialNo: "995115358 ED/PS/01",
      CertificateNo: "CS/23/LB/ET/272-01",
      ValidUpto: "",
      CalibratedBy: "R&D Instrument Services",
      TraceableTo: "NPL"
    },
    {
      name: "S Type Thermometer with Temp Indicator",
      MakeModel: "Tempsens SIMP",
      serialNo: "2426/T0103 ED/TC(S)/STD/01",
      CertificateNo: "TSC/24-25/16266-3",
      ValidUpto: "16.12.2025",
      CalibratedBy: "Transcal Technologies LLP",
      TraceableTo: "NPL"
    },
    {
      name: "Slip Gauge Block Set",
      MakeModel: "Mikronix M122/1",
      serialNo: "8419",
      CertificateNo: "TI/B/SGS/024/2024",
      ValidUpto: "09.02.2026",
      CalibratedBy: "Tanson Instrument",
      TraceableTo: "NPL"
    },
    {
      name: "SPRT Sensor",
      MakeModel: "Tempsens P-100X1",
      serialNo: "1405 ED/SPRT/STD/01",
      CertificateNo: "TSC/24-25/16266-6",
      ValidUpto: "16.12.2025",
      CalibratedBy: "Transcal Technologies LLP",
      TraceableTo: "NPL"
    },
    {
      name: "Standard Resistance box",
      MakeModel: "Sigma Instrumments",
      serialNo: "210212 ED/SRB-02",
      CertificateNo: "C&IJ/CAL/25-02/133",
      ValidUpto: "25.02.2026",
      CalibratedBy: "C & I Calibrations Pvt.Ltd.",
      TraceableTo: "NPL"
    },
    {
      name: "Temperature Calibrator",
      MakeModel: "Metravi;14",
      serialNo: "99431127 ED/TC-01",
      CertificateNo: "CS/24/LB/ET/138-01",
      ValidUpto: "20.09.2025",
      CalibratedBy: "R&D Instrument Services",
      TraceableTo: "NPL"
    }
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
    const readingValues = ["r1", "r2", "r3", "r4", "r5"]
      .map((key) => readings[key])
      .filter((val) => val !== "" && val !== null);

    if (readingValues.length === 0) return "";

    // Find the maximum number of decimal places in any reading
    const maxDecimalPlaces = readingValues.reduce((max, val) => {
      const decimalPart = String(val).split('.');
      const decimalDigits = decimalPart.length > 1 ? decimalPart[1].length : 0;
      return Math.max(max, decimalDigits);
    }, 0);

    // Calculate the mean
    const numericReadings = readingValues.map(val => parseFloat(val)).filter(val => !isNaN(val));
    if (numericReadings.length === 0) return "";

    const mean = numericReadings.reduce((acc, val) => acc + val, 0) / numericReadings.length;

    // Round to the maximum number of decimal places
    return Number(mean.toFixed(maxDecimalPlaces));
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
    const mean = parseFloat(calculateReadingMean(reading)) || 0;
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
    if (reading.rUnit === "°C") {
      return (uc * kAt95CL).toFixed(4);
    }
    return ((uc * kAt95CL * 100) / mean).toFixed(4);
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
    if (field === "rUnit" && /\d/.test(value)) {
      alert("Unit should be a string with letters, not numbers");
      return; // Don't update if the unit contains numbers
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
  // Unit options for dropdown
  const commonUnits = [
    { value: "V", label: "V" },
    { value: "A", label: "A" },
    { value: "°C", label: "°C" },
    { value: "mA", label: "mA" },
    { value: "ohm", label: "ohm" },
    { value: "Hz", label: "Hz" },
    { value: "", label: "Other" },
  ];

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
            <div className='flex items-center space-x-2 mt-1'>
              <input
                type='text'
                {...register("roomTempValue", {
                  required: "Temperature value is required",
                  pattern: {
                    value: /^-?\d*\.?\d*$/,
                    message: "Please enter a valid number",
                  },
                })}
                className='block w-full border border-gray-300 rounded-md p-2'
                placeholder='Value'
                defaultValue={newData.roomTemp ? newData.roomTemp.split('±')[0].trim() : ''}
                onChange={(e) => {
                  const uncertainty = watch("roomTempUncertainty") || "0";
                  const combined = `${e.target.value} ± ${uncertainty}`;
                  setValue("roomTemp", combined);
                  setNewData((prev) => ({ ...prev, roomTemp: combined }));
                }}
              />
              <span className='text-lg font-medium'>±</span>
              <input
                type='text'
                {...register("roomTempUncertainty", {
                  pattern: {
                    value: /^\d*\.?\d*$/,
                    message: "Please enter a valid positive number",
                  },
                })}
                className='block w-full border border-gray-300 rounded-md p-2'
                placeholder='Uncertainty'
                defaultValue={newData.roomTemp ? (newData.roomTemp.split('±')[1]?.trim() || "0") : "0"}
                onChange={(e) => {
                  const value = watch("roomTempValue") || "";
                  const combined = `${value} ± ${e.target.value}`;
                  setValue("roomTemp", combined);
                  setNewData((prev) => ({ ...prev, roomTemp: combined }));
                }}
              />
            </div>
            <input type="hidden" {...register("roomTemp")} />
            {errors.roomTempValue && (
              <span className='text-red-500 text-sm'>{errors.roomTempValue.message}</span>
            )}
            {errors.roomTempUncertainty && (
              <span className='text-red-500 text-sm'>{errors.roomTempUncertainty.message}</span>
            )}
          </div>
          <div>
            <label className='block text-sm font-medium'>Humidity (%)</label>
            <input
              type='text'
              {...register("humidity", {
                required: "Humidity is required",
                pattern: {
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
                  {newData.detailsOfMasterUsed.map((item, index) => (
                    <tr
                      key={index}
                      className='border-t'
                    >
                      <td className='p-2'>{item.name}</td>
                      <td className='p-2'>{item.MakeModel}</td>
                      <td className='p-2'>{item.serialNo}</td>
                      <td className='p-2'>{item.CertificateNo}</td>
                      <td className='p-2'>{item.ValidUpto}</td>
                      <td className='p-2'>{item.CalibratedBy}</td>
                      <td className='p-2'>{item.TraceableTo}</td>
                      {/* Action Button */}
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
              <div className='grid grid-cols-5 gap-4 mb-4'>
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
                <div>
                  <label className='block text-sm font-medium'>Least Count</label>
                  <input
                    type='text'
                    name="leastCount"
                    value={param.leastCount}
                    onChange={(e) => {
                      setParameters((prev) => {
                        const updatedParameters = [...prev];
                        updatedParameters[paramIndex].leastCount = e.target.value;
                        return updatedParameters;
                      });
                    }}
                    className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                  />
                </div>
              </div>

              {/* STD/DUC Readings */}
              <div className='overflow-x-auto shadow-md rounded-lg'>
                <table className='w-full text-xs text-left text-gray-500 border-collapse'>
                  <thead>
                    <tr className='text-xs text-gray-700 uppercase bg-gray-50'>
                      <th className='px-2 py-1' colSpan={2}>STD./DUC</th>
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
                        colSpan='3'
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
