import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "./components/UserNavbar.jsx";
import { useLocation } from "react-router-dom";
import SignatureCanvas from 'react-signature-canvas';

const ErrorDetectorForm = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const sigCanvas = useRef({});

  const defaultConditionOfProduct = "technician will enter";
  const defaultItemEnclosed = "labworker will enter";
  const availableMethods = [
    "ED/SOP/E-001(A) - Calibration of Ammeter",
    "ED/SOP/E-002(S) - Calibration of Megger/DC Voltage/Resistance",
    "ED/SOP/E-003(S) - Temperature Controller/Indicator/Recorder - Thermocouple & RTD",
    "ED/SOP/E-004(S) - Calibration of Voltmeter",
    "ED/SOP/E-005(S) - Measurement of AC/DC Voltage, Current, and DC Resistance",
    "ED/SOP/E-006(S) - Temperature Calibrator/Source/Process Source - Thermocouples & RTD"
  ];

  const [formData, setFormData] = useState({
    srfNo: "kpg/24-25/formno",
    date: today,
    probableDate: today,
    organization: "",
    address: "",
    contactPersonName: "",
    mobileNumber: "",
    telephoneNumber: "",
    emailId: "",
    conditionOfProduct: defaultConditionOfProduct,
    itemEnclosed: "",
    specialRequest: "",
    calibrationPeriodicity: "",
    reviewRequest: "",
    calibrationFacilityAvailable: "",
    calibrationServiceDoneByExternalAgency: "",
    calibrationMethodUsed: "",
    eSignature: "",
    signerName: "",
  });

  const [decisionRules, setDecisionRules] = useState({
    noDecision: false,
    simpleConformative: false,
    conditionalConformative: false,
    customerDrivenConformative: false,
  });

  const [signatureData, setSignatureData] = useState(null);
  const [isSignatureEmpty, setIsSignatureEmpty] = useState(true);

  const emptyRow = {
    instrumentDescription: "",
    make: "",
    serialNo: "",
    parameters: [
      {
        parameter: "",
        ranges: "",
        accuracy: "",
        methodUsed: "",
        calibrationStatus: "",
        calibratedDate: "",
        remarks: "",
      },
    ],
  };

  const [tableRows, setTableRows] = useState([{ ...emptyRow }]);

  const clearSignature = () => {
    sigCanvas.current.clear();
    setSignatureData(null);
    setIsSignatureEmpty(true);
  };

  const handleSignatureEnd = () => {
    setSignatureData(sigCanvas.current.toDataURL());
    setIsSignatureEmpty(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignatureEmpty) {
      alert("Please provide your signature");
      return;
    }

    const formattedFormData = {
      ...formData,
      eSignature: signatureData,
      date: formData.date ? new Date(formData.date).toISOString() : "",
      probableDate: formData.probableDate
        ? new Date(formData.probableDate).toISOString()
        : "",
      decisionRules: decisionRules,
    };

    const nonEmptyRows = tableRows.filter((row) =>
      row.parameters[0].instrumentDescription &&
      row.parameters[0].serialNo &&
      row.parameters[0].methodUsed
    );

    if (nonEmptyRows.length > 15) {
      alert(
        `You can only create a maximum of 15 products per user. Currently trying to create ${nonEmptyRows.length}.`
      );
      return;
    }

    const formattedProducts = nonEmptyRows.map((row) => ({
      ...row,
      instrumentDescription: row.parameters[0].instrumentDescription,
      serialNo: row.parameters[0].serialNo,
      methodUsed: row.parameters[0].methodUsed,
      calibratedDate: row.calibratedDate
        ? new Date(row.calibratedDate).toISOString()
        : null,
    }));
    // console.log(formattedProducts);
    const requestData = {
      form: formattedFormData,
      products: formattedProducts,
    };

    console.log("Submitting form data:", JSON.stringify(requestData, null, 2));

    fetch("/api/errorform", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((res) => {
        if (res.status === 401) {
          alert(
            "Your session has expired or you are not authorized. Please log in again."
          );
          navigate("/user");
          return null;
        }
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;

        // Reset form
        setFormData((prevData) => ({
          ...prevData,
          organization: "",
          address: "",
          contactPersonName: "",
          mobileNumber: "",
          telephoneNumber: "",
          emailId: "",
          conditionOfProduct: defaultConditionOfProduct,
          itemEnclosed: defaultItemEnclosed,
          specialRequest: "",
          calibrationPeriodicity: "",
          reviewRequest: "",
          calibrationFacilityAvailable: "",
          calibrationServiceDoneByExternalAgency: "",
          calibrationMethodUsed: "",
          eSignature: "",
          signerName: "",
        }));

        setDecisionRules({
          noDecision: false,
          simpleConformative: false,
          conditionalConformative: false,
          customerDrivenConformative: false,
        });

        setTableRows([{ ...emptyRow }]);
        clearSignature();
        alert("Form submitted successfully!");

      })
      .catch((err) => {
        console.error("Error submitting form:", err);
        alert("Error submitting form. Please try again.");
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setDecisionRules({ ...decisionRules, [name]: checked });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <UserNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
          {/* Form Header */}
          <div className="bg-blue-700 text-white py-4 px-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">SERVICE REQUEST FORM (SRF)</h1>
                <p className="text-blue-100 mt-1">Equipment Calibration Services</p>
              </div>
              <div className="text-right">
                <p className="text-sm">
                  Form No: <span className="font-mono">{formData.srfNo}</span>
                </p>
                <p className="text-sm mt-1">Date: {today}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Section 1: Basic Information */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold mr-3">
                  1
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Customer Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50 p-5 rounded-lg border border-gray-200">
                {/* SRF Number row */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SRF Number
                  </label>
                  <input
                    type="text"
                    name="srfNo"
                    value={formData.srfNo}
                    disabled
                    className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500 font-medium"
                  />
                </div>

                {/* Date row */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    name="date"
                    value={formData.date}
                    disabled
                    className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500 font-medium"
                  />
                </div>

                {/* Probable Date row */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Probable Completion Date
                  </label>
                  <input
                    type="date"
                    name="probableDate"
                    value={formData.probableDate}
                    disabled
                    className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500 font-medium"
                  />
                </div>

                {/* Organization */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Address */}
                <div className="col-span-1 md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Contact Person */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactPersonName"
                    value={formData.contactPersonName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Mobile Number */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="e.g., 9876543210"
                  />
                </div>

                {/* Telephone Number */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telephone Number
                  </label>
                  <input
                    type="text"
                    name="telephoneNumber"
                    value={formData.telephoneNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 022-12345678"
                  />
                </div>

                {/* Email ID */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="emailId"
                    value={formData.emailId}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="example@company.com"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Product Description */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold mr-3">
                    2
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Product Description
                  </h2>
                </div>
                <div className="bg-yellow-100 text-yellow-800 text-sm font-medium py-1 px-3 rounded-full">
                  Optional
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-blue-700 text-white">
                        <th className="px-3 py-3 text-xs font-medium text-left">
                          Instrument Description
                        </th>
                        <th className="px-3 py-3 text-xs font-medium text-left">
                          Make
                        </th>
                        <th className="px-3 py-3 text-xs font-medium text-left">
                          Serial No
                        </th>
                        <th className="px-3 py-3 text-xs font-medium text-left">
                          Parameter
                        </th>
                        <th className="px-3 py-3 text-xs font-medium text-left">
                          Ranges
                        </th>
                        <th className="px-3 py-3 text-xs font-medium text-left">
                          Accuracy
                        </th>
                        {/* NEW COLUMN for Method Used */}
                        <th className="px-3 py-3 text-xs font-medium text-left">
                          Method Used
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tableRows.map((row, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          {/* Instrument Description */}
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.parameters?.[0]?.instrumentDescription || ""}
                              onChange={(e) =>
                                setTableRows((prevRows) =>
                                  prevRows.map((r, i) =>
                                    i === index
                                      ? {
                                        ...r,
                                        parameters: [
                                          {
                                            ...r.parameters[0],
                                            instrumentDescription: e.target.value,
                                          },
                                        ],
                                      }
                                      : r
                                  )
                                )
                              }
                              className="w-full p-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </td>
                          {/* make */}
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.make || ""}
                              onChange={(e) =>
                                setTableRows((prevRows) =>
                                  prevRows.map((r, i) =>
                                    i === index
                                      ? { ...r, make: e.target.value, } : r
                                  ))}
                              className="w-full p-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </td>

                          {/* Serial No */}
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.parameters?.[0]?.serialNo || ""}
                              onChange={(e) =>
                                setTableRows((prevRows) =>
                                  prevRows.map((r, i) =>
                                    i === index
                                      ? {
                                        ...r,
                                        parameters: [
                                          {
                                            ...r.parameters[0],
                                            serialNo: e.target.value
                                          }
                                        ]
                                      }
                                      : r
                                  )
                                )
                              }
                              className="w-full p-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </td>

                          {/* Parameter */}
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.parameters?.[0]?.parameter || ""}
                              onChange={(e) =>
                                setTableRows((prevRows) =>
                                  prevRows.map((r, i) =>
                                    i === index
                                      ? {
                                        ...r,
                                        parameters: [
                                          {
                                            ...r.parameters[0],
                                            parameter: e.target.value,
                                          },
                                        ],
                                      }
                                      : r
                                  )
                                )
                              }
                              className="w-full p-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </td>

                          {/* Ranges */}
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.parameters?.[0]?.ranges || ""}
                              onChange={(e) =>
                                setTableRows((prevRows) =>
                                  prevRows.map((r, i) =>
                                    i === index
                                      ? {
                                        ...r,
                                        parameters: [
                                          {
                                            ...r.parameters[0],
                                            ranges: e.target.value
                                          }
                                        ]
                                      }
                                      : r
                                  )
                                )
                              }
                              className="w-full p-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </td>

                          {/* Accuracy */}
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={row.parameters?.[0]?.accuracy || ""}
                              onChange={(e) =>
                                setTableRows((prevRows) =>
                                  prevRows.map((r, i) =>
                                    i === index
                                      ? { ...r, parameters: [{ ...r.parameters[0], accuracy: e.target.value }] }
                                      : r
                                  )
                                )
                              }
                              className="w-full p-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </td>

                          {/* NEW: Method Used */}
                          <td className="px-2 py-2">
                            <select
                              value={row.methodUsed}
                              onChange={(e) =>
                                setTableRows((prevRows) =>
                                  prevRows.map((r, i) =>
                                    i === index
                                      ? {
                                        ...r,
                                        parameters: [
                                          {
                                            ...r.parameters[0],
                                            methodUsed: e.target.value,
                                          },
                                        ],
                                      }
                                      : r
                                  )
                                )
                              }
                              className="w-full p-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">-- Select Method --</option>
                              {availableMethods.map((method, mIndex) => (
                                <option key={mIndex} value={method}>
                                  {method}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-gray-100 border-t border-gray-200 flex flex-wrap justify-between items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (tableRows.length < 15) {
                        setTableRows([...tableRows, { ...emptyRow }]);
                      } else {
                        alert("Maximum of 15 products per user allowed.");
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Row
                  </button>
                  <div className="text-sm text-gray-600 italic">
                    <span className="font-medium">Note:</span> Job numbers will
                    be assigned automatically. (Max 15 products per user)
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3-7: Additional Details (Two-column layout) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Condition of Product */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                  <div className="flex items-center mb-3">
                    <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold mr-3 text-sm">
                      3
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Condition of Product
                    </h3>
                  </div>
                  <textarea
                    name="conditionOfProduct"
                    value={formData.conditionOfProduct}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                    rows="2"
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1 italic">
                    To be filled by technician
                  </p>
                </div>

                {/* Item Enclosed */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                  <div className="flex items-center mb-3">
                    <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold mr-3 text-sm">
                      4
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Item Enclosed
                    </h3>
                  </div>
                  <textarea
                    type="text"
                    name="itemEnclosed"
                    value={formData.itemEnclosed}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., No,Yes"
                  ></textarea>
                  {/* <p className="text-xs text-gray-500 mt-1 italic">
                    To be filled by lab worker
                  </p> */}
                </div>

                {/* Special Request */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                  <div className="flex items-center mb-3">
                    <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold mr-3 text-sm">
                      5
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Special Request
                    </h3>
                  </div>
                  <textarea
                    name="specialRequest"
                    value={formData.specialRequest}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Enter any special requirements here..."
                  ></textarea>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Decision Rules */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                  <div className="flex items-center mb-3">
                    <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold mr-3 text-sm">
                      6
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Decision Rules
                    </h3>
                  </div>
                  <div className="space-y-2 bg-gray-100 p-3 rounded-md">
                    <label className="flex items-center gap-2 text-gray-600">
                      <input
                        type="checkbox"
                        name="noDecision"
                        checked={decisionRules.noDecision}
                        disabled
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm">
                        No decision on conformative statement
                      </span>
                    </label>
                    <label className="flex items-center gap-2 text-gray-600">
                      <input
                        type="checkbox"
                        name="simpleConformative"
                        checked={decisionRules.simpleConformative}
                        disabled
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm">
                        Simple conformative decision
                      </span>
                    </label>
                    <label className="flex items-center gap-2 text-gray-600">
                      <input
                        type="checkbox"
                        name="conditionalConformative"
                        checked={decisionRules.conditionalConformative}
                        disabled
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm">
                        Conditional conformative decision
                      </span>
                    </label>
                    <label className="flex items-center gap-2 text-gray-600">
                      <input
                        type="checkbox"
                        name="customerDrivenConformative"
                        checked={decisionRules.customerDrivenConformative}
                        disabled
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm">
                        Customer-driven conformative decision
                      </span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 italic">
                    This will be determined by lab staff
                  </p>
                </div>

                {/* Calibration Periodicity */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                  <div className="flex items-center mb-3">
                    <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold mr-3 text-sm">
                      7
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Calibration Periodicity
                    </h3>
                  </div>
                  <input
                    type="text"
                    name="calibrationPeriodicity"
                    value={formData.calibrationPeriodicity}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Annual, Semi-annual, Quarterly"
                  />
                </div>

                {/* Review Request */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                  <div className="flex items-center mb-3">
                    <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold mr-3 text-sm">
                      8
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Review Request
                    </h3>
                  </div>
                  <input
                    type="text"
                    name="reviewRequest"
                    value={formData.reviewRequest}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1 italic">
                    For internal use only
                  </p>
                </div>
              </div>
            </div>

            {/* Section 8-10: Final Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                <div className="flex items-center mb-3">
                  <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold mr-3 text-sm">
                    9
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Calibration Facility Available
                  </h3>
                </div>
                <input
                  type="text"
                  name="calibrationFacilityAvailable"
                  value={formData.calibrationFacilityAvailable}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1 italic">
                  For internal use only
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                <div className="flex items-center mb-3">
                  <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold mr-3 text-sm">
                    10
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    External Calibration Service
                  </h3>
                </div>
                <input
                  type="text"
                  name="calibrationServiceDoneByExternalAgency"
                  value={formData.calibrationServiceDoneByExternalAgency}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1 italic">
                  For internal use only
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                <div className="flex items-center mb-3">
                  <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold mr-3 text-sm">
                    11
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Calibration Method Used
                  </h3>
                </div>
                <input
                  type="text"
                  name="calibrationMethodUsed"
                  value={formData.calibrationMethodUsed}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1 italic">
                  For internal use only
                </p>
              </div>

              {/* Add E-Signature Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold mr-3">
                    12
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">E-Signature</h2>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Signer's Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="signerName"
                      value={formData.signerName}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder="Enter name as it will appear on signature"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Draw Your Signature <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg relative">
                      <SignatureCanvas
                        ref={sigCanvas}
                        penColor="black"
                        canvasProps={{
                          className: "w-full h-48 bg-white rounded-lg",
                        }}
                        onEnd={handleSignatureEnd}
                      />
                      <button
                        type="button"
                        onClick={clearSignature}
                        className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                      >
                        Clear
                      </button>
                    </div>
                    {isSignatureEmpty && (
                      <p className="text-red-500 text-sm mt-1">Signature is required</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Section */}
            <div className="border-t border-gray-200 pt-6 mt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-gray-600 text-sm">
                  <p>
                    By submitting this form, I confirm that all information
                    provided is accurate and complete.
                  </p>
                  <p>
                    Fields marked with <span className="text-red-500">*</span>{" "}
                    are required.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white text-lg font-semibold rounded-md transition-colors shadow-lg flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Submit Form
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ErrorDetectorForm;
