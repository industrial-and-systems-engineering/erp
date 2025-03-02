import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../components/navbar/UserNavbar.jsx";

const ErrorDetectorForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    srfNo: "",
    date: "",
    probableDate: "",
    organization: "",
    address: "",
    contactPersonName: "",
    mobileNumber: "",
    telephoneNumber: "",
    emailId: "",
    conditionOfProduct: "",
    itemEnclosed: "",
    specialRequest: "",
    calibrationPeriodicity: "",
    reviewRequest: "",
    calibrationFacilityAvailable: "",
    calibrationServiceDoneByExternalAgency: "",
    calibrationMethodUsed: "",
  });

  const [decisionRules, setDecisionRules] = useState({
    noDecision: false,
    simpleConformative: false,
    conditionalConformative: false,
    customerDrivenConformative: false,
  });

  const [tableRows, setTableRows] = useState([
    {
      jobNo: "",
      instrumentDescription: "",
      serialNo: "",
      parameter: "",
      ranges: "",
      accuracy: "",
      calibrationStatus: "",
      calibratedDate: "",
      remarks: "",
    },
  ]);

  const emptyRow = {
    jobNo: "",
    instrumentDescription: "",
    serialNo: "",
    parameter: "",
    ranges: "",
    accuracy: "",
    calibrationStatus: "",
    calibratedDate: "",
    remarks: "",
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert date strings to Date objects for the backend
    const formattedFormData = {
      ...formData,
      date: formData.date ? new Date(formData.date).toISOString() : "",
      probableDate: formData.probableDate ? new Date(formData.probableDate).toISOString() : "",
      decisionRules: decisionRules,
    };

    // Format the products data
    const formattedProducts = tableRows.map(row => ({
      ...row,
      calibratedDate: row.calibratedDate ? new Date(row.calibratedDate).toISOString() : null,
    }));

    const requestData = {
      form: formattedFormData,
      products: formattedProducts
    };

    console.log("Submitting form data:", JSON.stringify(requestData, null, 2));

    fetch("/api/errorform", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Include authorization header if you're using JWT
        // "Authorization": `Bearer ${localStorage.getItem("token")}`
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

        // Reset form state
        setFormData({
          srfNo: "",
          date: "",
          probableDate: "",
          organization: "",
          address: "",
          contactPersonName: "",
          mobileNumber: "",
          telephoneNumber: "",
          emailId: "",
          conditionOfProduct: "",
          itemEnclosed: "",
          specialRequest: "",
          calibrationPeriodicity: "",
          reviewRequest: "",
          calibrationFacilityAvailable: "",
          calibrationServiceDoneByExternalAgency: "",
          calibrationMethodUsed: "",
        });

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

  // Helper function to handle input changes
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
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">SRF Number</label>
              <input
                type="text"
                name="srfNo"
                value={formData.srfNo}
                onChange={handleInputChange}
                className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Probable Date</label>
              <input
                type="date"
                name="probableDate"
                value={formData.probableDate}
                onChange={handleInputChange}
                className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

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

        {/* Section 2: Product Description */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
          <h3 className="font-semibold text-lg mb-3 text-blue-700">2. Product Description</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-2 text-sm">Job No</th>
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
            <button
              type="button"
              onClick={() => setTableRows([...tableRows, { ...emptyRow }])}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Add Row
            </button>
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
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="2"
              ></textarea>
            </div>

            <div className="bg-gray-50 p-4 rounded-md shadow-sm">
              <h3 className="font-semibold text-lg mb-3 text-blue-700">4. Item Enclosed</h3>
              <textarea
                name="itemEnclosed"
                value={formData.itemEnclosed}
                onChange={handleInputChange}
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
                    onChange={handleCheckboxChange}
                    className="w-4 h-4"
                  />
                  No decision on conformative statement
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="simpleConformative"
                    checked={decisionRules.simpleConformative}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4"
                  />
                  Simple conformative decision
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="conditionalConformative"
                    checked={decisionRules.conditionalConformative}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4"
                  />
                  Conditional conformative decision
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="customerDrivenConformative"
                    checked={decisionRules.customerDrivenConformative}
                    onChange={handleCheckboxChange}
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
                onChange={handleInputChange}
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
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h3 className="font-semibold text-lg mb-3 text-blue-700">10. Calibration Service Done By External Agency</h3>
            <input
              type="text"
              name="calibrationServiceDoneByExternalAgency"
              value={formData.calibrationServiceDoneByExternalAgency}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h3 className="font-semibold text-lg mb-3 text-blue-700">11. Calibration Method Used</h3>
            <input
              type="text"
              name="calibrationMethodUsed"
              value={formData.calibrationMethodUsed}
              onChange={handleInputChange}
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