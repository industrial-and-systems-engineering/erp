import React, { useState, useEffect } from "react";
import { usePendingFormsStore } from "./utils/pendingFroms";
import { generateReport } from "../user/utils/pdfGenerator.js";

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
  // Add key state to force re-render when form changes
  const [cardKey, setCardKey] = useState(0);
  // Add state for rejection modal
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionProduct, setRejectionProduct] = useState(null);
  const [rejectionForm, setRejectionForm] = useState(null);
  const [rejectionFeedback, setRejectionFeedback] = useState("");

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
    // If clicking the same form, hide it
    if (selectedForm && selectedForm._id === form._id) {
      setSelectedForm(null);
    } else {
      // If switching to a different form, update state and increment key
      setSelectedForm(form);
      setCardKey(prevKey => prevKey + 1);
    }
    // Reset editing state when changing forms
    setIsEditing(false);
    setFormChanges({});
  };

  const startEditing = () => {
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
      calibrationServiceDoneByExternalAgency: selectedForm.calibrationServiceDoneByExternalAgency,
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
      const updatedDetails = { ...formChanges, formUpdated: true };
      const response = await updateFormDetails(selectedForm._id, updatedDetails);

      if (!response.success) {
        throw new Error(response.message);
      }

      setSelectedForm((prevForm) => {
        if (!prevForm) return null;
        return { ...prevForm, ...updatedDetails };
      });

      setIsEditing(false);
      setFormChanges({});
      setSuccessMessage("Form details updated successfully");
    } catch (err) {
      console.error("Failed to update form", err);
      setError("Failed to update form details");
    }
  };

  // New handler functions for approve/reject functionality
  const handleViewReport = async (productId, reportType) => {
    try {
      // Find the product in the selected form
      const product = selectedForm.products.find(p => p._id === productId);
      if (!product) {
        alert('Product not found');
        return;
      }

      // Generate the report based on type
      if (reportType === 'with-qr') {
        await generateReport(product, selectedForm, false, false, true);
      } else {
        await generateReport(product, selectedForm);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    }
  };

  const handleApproveProduct = async (productId, formId) => {
    try {
      const response = await fetch(`/api/csc/approve/${productId}/${formId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to approve product');
      }

      const result = await response.json();
      if (result.success) {
        setSuccessMessage("Product approved successfully");
        fetchPendingForms(); // Refresh the list
        // Update selected form with new data
        if (result.data && result.data.length > 0) {
          setSelectedForm(result.data[0]);
        }
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error("Failed to approve product", err);
      setError("Failed to approve product");
    }
  };

  const handleRejectProduct = (productId, formId) => {
    setRejectionProduct(productId);
    setRejectionForm(formId);
    setRejectionFeedback("");
    setShowRejectionModal(true);
  };

  const confirmRejectProduct = async () => {
    try {
      const response = await fetch(`/api/csc/reject/${rejectionProduct}/${rejectionForm}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          feedback: rejectionFeedback
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject product');
      }

      const result = await response.json();
      if (result.success) {
        setSuccessMessage("Product rejected and sent back to technician with feedback");
        fetchPendingForms(); // Refresh the list
        // Update selected form with new data
        if (result.data && result.data.length > 0) {
          setSelectedForm(result.data[0]);
        }
        setShowRejectionModal(false);
        setRejectionProduct(null);
        setRejectionForm(null);
        setRejectionFeedback("");
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error("Failed to reject product", err);
      setError("Failed to reject product");
    }
  };

  const cancelRejection = () => {
    setShowRejectionModal(false);
    setRejectionProduct(null);
    setRejectionForm(null);
    setRejectionFeedback("");
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
    <div>
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mx-auto max-w-4xl my-4">
          <p>{successMessage}</p>
        </div>
      )}

      {pendingForms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* SRF Forms List Sidebar */}
          <div className="bg-gray-50 rounded-lg shadow-md p-4 col-span-1 overflow-y-auto h-[87vh]">
            <h2 className="font-semibold text-lg mb-4 text-gray-700 border-b pb-2">
              SRF Forms
            </h2>
            <div className="space-y-3">
              {pendingForms
                .slice()
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .map((form) => (
                  <div
                    key={form._id}
                    className={`bg-white p-4 rounded-lg shadow-sm border-l-4 transition-all duration-200 hover:shadow-md ${selectedForm && selectedForm._id === form._id
                      ? "border-l-blue-600"
                      : "border-l-gray-300"
                      }`}
                  >
                    <div className="flex justify-between items-center gap-2">
                      <div>
                        <p className="font-medium text-gray-800">SRF #{form.srfNo || "N/A"}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(form.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-600">
                          Products: {form.products?.length || 0}
                        </p>
                      </div>
                      <button
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${selectedForm && selectedForm._id === form._id
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          }`}
                        onClick={() => toggleFormDetails(form)}
                      >
                        {selectedForm && selectedForm._id === form._id ? (
                          <span className="flex items-center gap-1">
                            <span>Hide</span>
                            <span className="text-xs">▲</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <span>Details</span>
                            <span className="text-xs">▼</span>
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Form Details Panel */}
          <div className="col-span-3 bg-white rounded-lg shadow-md overflow-y-auto h-[87vh]">
            {selectedForm ? (
              <div className="bg-white p-6 rounded-lg shadow-md" key={cardKey}>
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
                        <span className="font-medium">Email:</span>{" "}
                        {selectedForm.emailId || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Form Details</h3>
                      <p>
                        <span className="font-medium">SRF ID:</span>{" "}
                        {selectedForm.srfNo || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">ULR Number:</span>{" "}
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
                      </div>
                    )}
                  </div>

                  {isEditing ? (
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

                        {/* Second column of form fields - kept existing functionality */}
                        <div className="space-y-3">
                          {/* Keep your existing edit fields */}
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

                          {/* Other form fields remain the same */}
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

                      {/* Decision rules section */}
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
                            {/* Checkboxes for decision rules */}
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

                            {/* Other checkboxes remain the same */}
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
                                <th className="border border-gray-200 px-4 py-2 text-left">
                                  Status
                                </th>
                                <th className="border border-gray-200 px-4 py-2 text-left">
                                  Actions
                                </th>
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
                                    {product.technicianCompleted && !product.cscReviewed ? (
                                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg text-sm">
                                        Pending Review
                                      </span>
                                    ) : product.cscApproved ? (
                                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-sm">
                                        Approved
                                      </span>
                                    ) : product.rejectedToDraft ? (
                                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-lg text-sm">
                                        Rejected to Draft
                                      </span>
                                    ) : product.isCalibrated ? (
                                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm">
                                        Calibrated
                                      </span>
                                    ) : (
                                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-lg text-sm">
                                        Not Started
                                      </span>
                                    )}
                                  </td>
                                  <td className="border border-gray-200 px-4 py-2">
                                    {product.technicianCompleted && !product.cscReviewed ? (
                                      <div className="flex space-x-2 flex-wrap">
                                        <button
                                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm mb-1"
                                          onClick={() => handleViewReport(product._id, 'with-qr')}
                                        >
                                          View Report (QR)
                                        </button>
                                        <button
                                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm mb-1"
                                          onClick={() => handleViewReport(product._id, 'without-qr')}
                                        >
                                          View Report (No QR)
                                        </button>
                                        <button
                                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm mb-1"
                                          onClick={() => handleApproveProduct(product._id, selectedForm._id)}
                                        >
                                          Approve
                                        </button>
                                        <button
                                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm mb-1"
                                          onClick={() => handleRejectProduct(product._id, selectedForm._id)}
                                        >
                                          Reject
                                        </button>
                                      </div>
                                    ) : (
                                      <span className="text-gray-400">No actions available</span>
                                    )}
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
              <div className="flex flex-col items-center justify-center h-full p-10 text-center">
                <svg
                  className="w-16 h-16 text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  ></path>
                </svg>
                <h3 className="text-xl font-medium text-gray-600 mb-2">No SRF Form Selected</h3>
                <p className="text-gray-500">Select a form from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-10 text-center">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            ></path>
          </svg>
          <h3 className="text-xl font-medium text-gray-600 mb-2">No Pending SRF Forms</h3>
          <p className="text-gray-500">
            There are currently no pending SRF forms to display.
          </p>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium mb-4">Reject Product</h3>
            <p className="text-gray-600 mb-4">
              Please provide feedback for the technician about why this product is being rejected:
            </p>
            <textarea
              value={rejectionFeedback}
              onChange={(e) => setRejectionFeedback(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter feedback for the technician..."
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={cancelRejection}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmRejectProduct}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                disabled={!rejectionFeedback.trim()}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tpending;