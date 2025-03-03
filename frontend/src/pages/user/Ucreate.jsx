import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../components/navbar/UserNavbar.jsx";
import { useLocation } from "react-router-dom";
import { countstore } from "../../utils/getcounter.js";

const ErrorDetectorForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { UserNumber, checkcount } = countstore();

  const [nextJobNumber, setNextJobNumber] = useState(1);

  useEffect(() => {
    const verifycnt = async () => {
      await checkcount();
    };
    verifycnt();
  }, [checkcount]);

  // Load the next job number from localStorage when component mounts
  useEffect(() => {
    if (UserNumber) {
      // Try to get the last job number from localStorage
      const lastJobNumberKey = `lastJobNumber_${UserNumber}`;
      const storedLastJobNumber = localStorage.getItem(lastJobNumberKey);
      
      if (storedLastJobNumber) {
        // If we have a stored number, the next number is one more than that
        setNextJobNumber(parseInt(storedLastJobNumber) + 1);
      } else {
        // If no stored number, start at 1
        setNextJobNumber(1);
      }
      
      // You could also fetch this from your backend if you prefer server-side storage
      // fetchLastJobNumber(UserNumber);
    }
  }, [UserNumber]);

  const today = new Date().toISOString().slice(0, 10);
  
  const defaultConditionOfProduct = "technician will enter";
  const defaultItemEnclosed = "labworker will enter";
  
  const [formData, setFormData] = useState({
    srfNo: `kpg/24-25/${UserNumber}`,
    date: today,
    probableDate: today,
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
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      srfNo: `kpg/24-25/${UserNumber}`,
    }));
  }, [UserNumber]);

  const [decisionRules, setDecisionRules] = useState({
    noDecision: false,
    simpleConformative: false,
    conditionalConformative: false,
    customerDrivenConformative: false,
  });

  // Modified emptyRow without jobNo field
  const emptyRow = {
    instrumentDescription: "",
    serialNo: "",
    parameter: "",
    ranges: "",
    accuracy: "",
    calibrationStatus: "",
    calibratedDate: "",
    remarks: "",
  };

  const [tableRows, setTableRows] = useState([{ ...emptyRow }]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert date strings to Date objects for the backend
    const formattedFormData = {
      ...formData,
      date: formData.date ? new Date(formData.date).toISOString() : "",
      probableDate: formData.probableDate ? new Date(formData.probableDate).toISOString() : "",
      decisionRules: decisionRules,
    };

    // Filter out empty table rows (all fields empty)
    const nonEmptyRows = tableRows.filter(row => 
      Object.values(row).some(value => value !== "")
    );

    // Check if we're trying to create more than the allowed max of 15 products
    const totalJobsAfterSubmit = nextJobNumber + nonEmptyRows.length - 1;
    if (totalJobsAfterSubmit > 15) {
      alert(`You can only create a maximum of 15 products per user. Currently trying to create ${totalJobsAfterSubmit}.`);
      return;
    }

    // Format the products data - generate sequential job numbers
    let currentJobNumber = nextJobNumber;
    const formattedProducts = nonEmptyRows.map((row) => {
      // Create a job number with format "1-01", "1-02", etc.
      const jobNo = `${UserNumber}-${String(currentJobNumber).padStart(2, '0')}`;
      currentJobNumber++;
      
      return {
        ...row,
        jobNo,
        calibratedDate: row.calibratedDate ? new Date(row.calibratedDate).toISOString() : null,
      };
    });

    // Store the last job number used
    if (formattedProducts.length > 0) {
      localStorage.setItem(`lastJobNumber_${UserNumber}`, (currentJobNumber - 1).toString());
    }

    const requestData = {
      form: formattedFormData,
      products: formattedProducts,
    };

    console.log("Submitting form data:", JSON.stringify(requestData, null, 2));

    fetch("/api/errorform", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Response from backend:", data);

        // Update next job number for next form submission
        setNextJobNumber(currentJobNumber);

        // Reset form state (keeping the default values for srfNo, date and probableDate)
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
        }));

        setDecisionRules({
          noDecision: false,
          simpleConformative: false,
          conditionalConformative: false,
          customerDrivenConformative: false,
        });

        setTableRows([{ ...emptyRow }]);

        if (data.redirectURL) {
          navigate(data.redirectURL);
        } else {
          alert("Form submitted successfully!");
        }
      })
      .catch((err) => {
        console.error("Error submitting form:", err);
        alert("Error submitting form. Please try again.");
      });
  };

  // Helper function to handle input changes for editable fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Helper function to handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setDecisionRules({ ...decisionRules, [name]: checked });
  };

  return (
    <div className="container mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <UserNavbar />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center border-b-2 border-blue-600 pb-3 mb-6">
          <h2 className="text-2xl font-bold text-blue-800">SERVICE REQUEST FORM (SRF)</h2>
        </div>

        {/* Section 1: Basic Information */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
          <h3 className="font-semibold text-lg mb-3 text-blue-700">1. Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* SRF Number (read-only) */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">SRF Number</label>
              <input
                type="text"
                name="srfNo"
                value={formData.srfNo}
                disabled
                className="p-2 border rounded-md bg-gray-100 text-gray-700"
              />
            </div>

            {/* Date (read-only) */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Date</label>
              <input
                type=""
                name="date"
                value={formData.date}
                disabled
                className="p-2 border rounded-md bg-gray-100 text-gray-700"
              />
            </div>

            {/* Probable Date (read-only) */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Probable Date</label>
              <input
                type="date"
                name="probableDate"
                value={formData.probableDate}
                disabled
                className="p-2 border rounded-md bg-gray-100 text-gray-700"
              />
            </div>

            {/* Organization */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Organization</label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Address */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Contact Person */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Contact Person</label>
              <input
                type="text"
                name="contactPersonName"
                value={formData.contactPersonName}
                onChange={handleInputChange}
                className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Mobile Number */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Mobile Number</label>
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Telephone Number */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Telephone Number</label>
              <input
                type="text"
                name="telephoneNumber"
                value={formData.telephoneNumber}
                onChange={handleInputChange}
                className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Email ID */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Email ID</label>
              <input
                type="email"
                name="emailId"
                value={formData.emailId}
                onChange={handleInputChange}
                className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Product Description (now optional) */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg text-blue-700">2. Product Description (Optional)</h3>
            <div className="text-sm text-gray-600 italic">You can submit the form without filling this section</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-2 text-sm">Instrument Description</th>
                  <th className="p-2 text-sm">Serial No</th>
                  <th className="p-2 text-sm">Parameter</th>
                  <th className="p-2 text-sm">Ranges</th>
                  <th className="p-2 text-sm">Accuracy</th>
                  <th className="p-2 text-sm">Calibration Status</th>
                  <th className="p-2 text-sm">Calibrated Date</th>
                  <th className="p-2 text-sm">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, index) => (
                  <tr key={index} className="border-t">
                    {Object.keys(emptyRow).map((key) => (
                      <td key={key} className="p-1">
                        {key === "calibratedDate" ? (
                          <input
                            type="date"
                            value={row[key]}
                            onChange={(e) =>
                              setTableRows((prevRows) =>
                                prevRows.map((r, i) =>
                                  i === index ? { ...r, [key]: e.target.value } : r
                                )
                              )
                            }
                            className="p-1 border rounded-md w-full text-sm"
                          />
                        ) : (
                          <input
                            type="text"
                            value={row[key]}
                            onChange={(e) =>
                              setTableRows((prevRows) =>
                                prevRows.map((r, i) =>
                                  i === index ? { ...r, [key]: e.target.value } : r
                                )
                              )
                            }
                            className="p-1 border rounded-md w-full text-sm"
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  // Check if adding a new row would exceed the max limit of 15
                  if (nextJobNumber + tableRows.length - 1 < 15) {
                    setTableRows([...tableRows, { ...emptyRow }]);
                  } else {
                    alert("Maximum of 15 products per user allowed.");
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Add Row
              </button>
              <div className="text-sm text-gray-700">
                <span className="font-medium">Note:</span> Job numbers will be assigned as {UserNumber}-{String(nextJobNumber).padStart(2, '0')}, {UserNumber}-{String(nextJobNumber+1).padStart(2, '0')}, etc. (Max 15 products per user)
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md shadow-sm">
              <h3 className="font-semibold text-lg mb-3 text-blue-700">3. Condition of Product</h3>
              <textarea
                name="conditionOfProduct"
                value={formData.conditionOfProduct}
                disabled
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="2"
              ></textarea>
            </div>

            <div className="bg-gray-50 p-4 rounded-md shadow-sm">
              <h3 className="font-semibold text-lg mb-3 text-blue-700">4. Item Enclosed</h3>
              <textarea
                name="itemEnclosed"
                value={formData.itemEnclosed}
                disabled
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="2"
              ></textarea>
            </div>

            <div className="bg-gray-50 p-4 rounded-md shadow-sm">
              <h3 className="font-semibold text-lg mb-3 text-blue-700">5. Special Request</h3>
              <textarea
                name="specialRequest"
                value={formData.specialRequest}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="2"
              ></textarea>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md shadow-sm">
              <h3 className="font-semibold text-lg mb-3 text-blue-700">6. Decision Rules</h3>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="noDecision"
                    checked={decisionRules.noDecision}
                    disabled
                    className="w-4 h-4"
                  />
                  No decision on conformative statement
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="simpleConformative"
                    checked={decisionRules.simpleConformative}
                    disabled
                    className="w-4 h-4"
                  />
                  Simple conformative decision
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="conditionalConformative"
                    checked={decisionRules.conditionalConformative}
                    disabled
                    className="w-4 h-4"
                  />
                  Conditional conformative decision
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="customerDrivenConformative"
                    checked={decisionRules.customerDrivenConformative}
                    disabled
                    className="w-4 h-4"
                  />
                  Customer-driven conformative decision
                </label>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md shadow-sm">
              <h3 className="font-semibold text-lg mb-3 text-blue-700">7. Calibration Periodicity</h3>
              <input
                type="text"
                name="calibrationPeriodicity"
                value={formData.calibrationPeriodicity}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-md shadow-sm">
              <h3 className="font-semibold text-lg mb-3 text-blue-700">8. Review Request</h3>
              <input
                type="text"
                name="reviewRequest"
                value={formData.reviewRequest}
                disabled
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Final Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h3 className="font-semibold text-lg mb-3 text-blue-700">9. Calibration Facility Available</h3>
            <input
              type="text"
              name="calibrationFacilityAvailable"
              value={formData.calibrationFacilityAvailable}
              disabled
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h3 className="font-semibold text-lg mb-3 text-blue-700">10. Calibration Service Done By External Agency</h3>
            <input
              type="text"
              name="calibrationServiceDoneByExternalAgency"
              value={formData.calibrationServiceDoneByExternalAgency}
              disabled
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h3 className="font-semibold text-lg mb-3 text-blue-700">11. Calibration Method Used</h3>
            <input
              type="text"
              name="calibrationMethodUsed"
              value={formData.calibrationMethodUsed}
              disabled
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-md hover:bg-blue-700 transition-colors shadow-md"
          >
            Submit Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default ErrorDetectorForm;