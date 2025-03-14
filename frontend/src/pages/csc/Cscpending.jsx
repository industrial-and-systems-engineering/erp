import React, { useState, useEffect } from "react";
import { usePendingFormsStore } from "./utils/pendingFroms";

const Tpending = () => {
  const { pendingForms, fetchPendingForms, updateFormDetails, markFormCompleted } =
    usePendingFormsStore();
  const [selectedForm, setSelectedForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formChanges, setFormChanges] = useState({});
  const [jobcardSelected, selectJobcard] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadForms = async () => {
      try {
        setLoading(true);
        await fetchPendingForms();
      } catch (err) {
        setError("Failed to load pending forms");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadForms();
  }, [fetchPendingForms]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const toggleFormDetails = (form) => {
    console.log(pendingForms);
    setSelectedForm((prevForm) =>
      prevForm && prevForm._id === form._id ? null : form
    );
    // Reset editing state when changing forms
    setIsEditing(false);
    setFormChanges({});
  };

  const startEditing = () => {
    // Initialize form changes with values from the first product
    // or with default values if no products exist
    setFormChanges({
      conditionOfProduct: selectedForm.conditionOfProduct,
      itemEnclosed: selectedForm.itemEnclosed,
      specialRequest: selectedForm.specialRequest,
      decisionRules: selectedForm.decisionRules || {
        noDecision: false,
        simpleConformative: false,
        conditionalConformative: false,
        customerDrivenConformative: false
      },
      calibrationPeriodicity: selectedForm.calibrationPeriodicity,
      reviewRequest: selectedForm.reviewRequest,
      calibrationFacilityAvailable: selectedForm.calibrationFacilityAvailable,
      calibrationServiceDoneByExternalAgency:
        selectedForm.calibrationServiceDoneByExternalAgency,
      calibrationMethodUsed: selectedForm.calibrationMethodUsed,
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setFormChanges({});
  };

  const handleInputChange = (field, value) => {
    setFormChanges((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (rule, checked) => {
    setFormChanges((prev) => ({
      ...prev,
      decisionRules: {
        ...prev.decisionRules,
        [rule]: checked,
      },
    }));
  };

  const saveFormChanges = async () => {
    try {
      // Prepare the updated details with formUpdated set to true.
      const updatedDetails = { ...formChanges, formUpdated: true };
  
      // Call updateFormDetails with only the form ID (no need to loop through products)
      const response = await updateFormDetails(selectedForm._id, updatedDetails);
      if (!response.success) {
        throw new Error(response.message);
      }
  
      // Optionally update local state
      setSelectedForm((prevForm) => {
        if (!prevForm) return null;
        return { ...prevForm, ...updatedDetails };
      });
  
      // Exit edit mode, clear changes and show success
      setIsEditing(false);
      setFormChanges({});
      setSuccessMessage("Form details updated and removed from pending list");
    } catch (err) {
      console.error("Failed to update form", err);
      setError("Failed to update form details");
    }
  };
  



  const handleMarkAsCompleted = async () => {
    if (!selectedForm) return;

    try {
      const result = await markFormCompleted(selectedForm._id, selectedForm);
      
      if (result.success) {
        setSuccessMessage("Form marked as completed and moved to completed forms");
        setSelectedForm(null);
      } else {
        setError(result.message || "Failed to mark form as completed");
      }
    } catch (err) {
      console.error("Error marking form as completed", err);
      setError("An unexpected error occurred");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto max-w-4xl my-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold my-6 mb-4 text-center">
        Pending SRF Forms
      </h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mx-auto max-w-4xl my-4">
          <p>{successMessage}</p>
        </div>
      )}

      {pendingForms.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-gray-50 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3 pb-2 border-b">
              SRF Forms
            </h2>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {pendingForms.map((form) => (
                <div
                  key={form._id}
                  className={`p-4 rounded-lg shadow-sm cursor-pointer transition-all
                                        ${selectedForm &&
                      selectedForm._id === form._id
                      ? "bg-blue-100 border-l-4 border-blue-500"
                      : "bg-white hover:bg-gray-50"
                    }`}
                  onClick={() => toggleFormDetails(form)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">SRF #{form.srfNo || "N/A"}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                      {new Date(form.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    Contact: {form.contactPersonName || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Products: {form.products?.length || 0}
                  </p>
                  <button
                    className={`mt-2 w-full p-2 rounded text-sm font-medium transition-colors text-white
                                            ${selectedForm &&
                        selectedForm._id === form._id
                        ? "bg-gray-500 hover:bg-gray-600"
                        : "bg-blue-500 hover:bg-blue-600"
                      }`}
                  >
                    {selectedForm && selectedForm._id === form._id
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">

            {selectedForm ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="border-b pb-4 mb-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">
                      SRF #{selectedForm.srfNo}
                    </h2>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm">
                      {selectedForm.requestStatus === false
                        ? "Pending"
                        : "Completed"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Customer Details
                      </h3>
                      <p>
                        <span className="font-medium">Organization:</span>{" "}
                        {selectedForm.organization || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Address:</span>{" "}
                        {selectedForm.address || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Contact Person:</span>{" "}
                        {selectedForm.contactPersonName || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Mobile:</span>{" "}
                        {selectedForm.mobileNumber || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Telephone:</span>{" "}
                        {selectedForm.telephoneNumber || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {selectedForm.emailId || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Form Details</h3>
                      <p>
                        <span className="font-medium">SRF ID:</span>{" "}
                        {selectedForm._id}
                      </p>
                      <p>
                        <span className="font-medium">URL Number:</span>{" "}
                        {selectedForm.URL_NO || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Submission Date:</span>{" "}
                        {new Date(selectedForm.date).toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium">Probable Date:</span>{" "}
                        {new Date(selectedForm.probableDate).toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium">Created At:</span>{" "}
                        {new Date(selectedForm.createdAt).toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium">Updated At:</span>{" "}
                        {new Date(selectedForm.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium">
                      Products ({selectedForm.products?.length || 0})
                    </h3>
                    {!isEditing && (
                      <div className="space-x-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                          onClick={startEditing}
                        >
                          Edit Form Details
                        </button>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                          onClick={handleMarkAsCompleted}
                        >
                          Mark as Completed
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    // Editing mode for all products in the form
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-medium text-lg border-b pb-2 mb-3">
                        Edit Form Details{" "}
                        <span className="text-gray-500 text-sm ml-2">
                          (Will apply to all products)
                        </span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Condition of Product
                            </label>
                            <select
                              className="w-full border-gray-300 rounded-md shadow-sm p-2"
                              value={formChanges.conditionOfProduct || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "conditionOfProduct",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select condition</option>
                              <option value="good">Good</option>
                              <option value="average">Average</option>
                              <option value="poor">Poor</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Items Enclosed
                            </label>
                            <input
                              type="text"
                              className="w-full border-gray-300 rounded-md shadow-sm p-2"
                              value={formChanges.itemEnclosed || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "itemEnclosed",
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Special Request
                            </label>
                            <textarea
                              className="w-full border-gray-300 rounded-md shadow-sm p-2"
                              value={formChanges.specialRequest || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "specialRequest",
                                  e.target.value
                                )
                              }
                              rows="2"
                            ></textarea>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Calibration Periodicity
                            </label>
                            <select
                              className="w-full border-gray-300 rounded-md shadow-sm p-2"
                              value={formChanges.calibrationPeriodicity || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "calibrationPeriodicity",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select periodicity</option>
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="quarterly">Quarterly</option>
                              <option value="yearly">Yearly</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Review Request
                            </label>
                            <input
                              type="text"
                              className="w-full border-gray-300 rounded-md shadow-sm p-2"
                              value={formChanges.reviewRequest}
                              onChange={(e) =>
                                handleInputChange(
                                  "reviewRequest",
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Calibration Facility
                            </label>
                            <select
                              className="w-full border-gray-300 rounded-md shadow-sm p-2"
                              value={formChanges.calibrationFacilityAvailable}
                              onChange={(e) =>
                                handleInputChange(
                                  "calibrationFacilityAvailable",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select facility</option>
                              <option value="lab">Lab</option>
                              <option value="onsite">Onsite</option>
                              <option value="external">External</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            External Calibration
                          </label>
                          <select
                            className="w-full border-gray-300 rounded-md shadow-sm p-2"
                            value={
                              formChanges.calibrationServiceDoneByExternalAgency
                            }
                            onChange={(e) =>
                              handleInputChange(
                                "calibrationServiceDoneByExternalAgency",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select option</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Calibration Method
                          </label>
                          <input
                            type="text"
                            className="w-full border-gray-300 rounded-md shadow-sm p-2"
                            value={formChanges.calibrationMethodUsed}
                            onChange={(e) =>
                              handleInputChange(
                                "calibrationMethodUsed",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Decision Rules
                          </label>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="noDecision"
                                className="mr-2"
                                checked={
                                  formChanges.decisionRules?.noDecision || false
                                }
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    "noDecision",
                                    e.target.checked
                                  )
                                }
                              />
                              <label htmlFor="noDecision">No Decision</label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="simpleConformative"
                                className="mr-2"
                                checked={
                                  formChanges.decisionRules
                                    ?.simpleConformative || false
                                }
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    "simpleConformative",
                                    e.target.checked
                                  )
                                }
                              />
                              <label htmlFor="simpleConformative">
                                Simple Conformative
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="conditionalConformative"
                                className="mr-2"
                                checked={
                                  formChanges.decisionRules
                                    ?.conditionalConformative || false
                                }
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    "conditionalConformative",
                                    e.target.checked
                                  )
                                }
                              />
                              <label htmlFor="conditionalConformative">
                                Conditional Conformative
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="customerDrivenConformative"
                                className="mr-2"
                                checked={
                                  formChanges.decisionRules
                                    ?.customerDrivenConformative || false
                                }
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    "customerDrivenConformative",
                                    e.target.checked
                                  )
                                }
                              />
                              <label htmlFor="customerDrivenConformative">
                                Customer Driven Conformative
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end space-x-3">
                        <button
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg text-sm"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                          onClick={saveFormChanges}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display all products in the form
                    <div>
                      <div className="space-y-4">
                        {/* Form level details summary */}
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <h4 className="font-medium text-lg border-b pb-2 mb-3">
                            Form Details
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p>
                                <span className="font-medium">Condition:</span>{" "}
                                {selectedForm.conditionOfProduct}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Items Enclosed:
                                </span>{" "}
                                {selectedForm.itemEnclosed || "N/A"}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Special Request:
                                </span>{" "}
                                {selectedForm.specialRequest || "None"}
                              </p>

                              {selectedForm.decisionRules && (
                                <div className="mt-2">
                                  <p className="font-medium">Decision Rules:</p>
                                  <ul className="list-disc pl-5 mt-1 text-sm">
                                    {selectedForm.decisionRules.noDecision && (
                                      <li>No Decision</li>
                                    )}
                                    {selectedForm.decisionRules
                                      .simpleConformative && (
                                        <li>Simple Conformative</li>
                                      )}
                                    {selectedForm.decisionRules
                                      .conditionalConformative && (
                                        <li>Conditional Conformative</li>
                                      )}
                                    {selectedForm.decisionRules
                                      .customerDrivenConformative && (
                                        <li>Customer Driven Conformative</li>
                                      )}
                                  </ul>
                                </div>
                              )}
                            </div>
                            <div>
                              <p>
                                <span className="font-medium">
                                  Calibration Periodicity:
                                </span>{" "}
                                {selectedForm.calibrationPeriodicity || "N/A"}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Review Request:
                                </span>{" "}
                                {selectedForm.reviewRequest || "None"}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Calibration Facility:
                                </span>{" "}
                                {selectedForm.calibrationFacilityAvailable ||
                                  "N/A"}
                              </p>
                              <p>
                                <span className="font-medium">
                                  External Calibration:
                                </span>{" "}
                                {
                                  selectedForm.calibrationServiceDoneByExternalAgency
                                }
                              </p>
                              <p>
                                <span className="font-medium">
                                  Calibration Method:
                                </span>{" "}
                                {selectedForm.calibrationMethodUsed}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Products summary */}
                        <h4 className="font-medium text-lg mt-4">
                          Products List
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full border-collapse border border-gray-200">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="border border-gray-200 px-4 py-2 text-left">
                                  Job No.
                                </th>
                                <th className="border border-gray-200 px-4 py-2 text-left">
                                  Instrument Description
                                </th>
                                <th className="border border-gray-200 px-4 py-2 text-left"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedForm.products.map((product, index) => (
                                <tr
                                  key={product._id}
                                  className={
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                  }
                                >
                                  <td className="border border-gray-200 px-4 py-2">
                                    {product.jobNo}
                                  </td>
                                  <td className="border border-gray-200 px-4 py-2">
                                    {product.instrumentDescription}
                                  </td>
                                  <td className="border border-gray-200 px-4 py-2">
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">
                                      View JobCard
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col items-center justify-center text-center">
                <svg
                  className="w-16 h-16 text-gray-300 mb-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">
                  No SRF form selected
                </h3>
                <p className="mt-1 text-gray-500">
                  Select a form from the list to view all details
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-2xl mx-auto">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            No pending SRF forms found
          </h2>
          <p className="text-gray-500">
            All forms have been processed or no forms have been submitted yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default Tpending;
