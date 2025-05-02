import React, { useState, useEffect } from "react";
import { useCompletedFormsStore } from "./utils/completedForms";

const CscCompleted = () => {
  const { completedForms, fetchCompletedForms } = useCompletedFormsStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  // Add a key state to force re-render when form changes
  const [cardKey, setCardKey] = useState(0);

  useEffect(() => {
    const loadForms = async () => {
      try {
        setLoading(true);
        await fetchCompletedForms();
      } catch (err) {
        setError("Failed to load completed forms");
      } finally {
        setLoading(false);
      }
    };
    loadForms();
  }, [fetchCompletedForms]);

  const toggleFormDetails = (form) => {
    if (selectedForm && selectedForm._id === form._id) {
      // If clicking the same form, hide it
      setSelectedForm(null);
    } else {
      // If switching to a different form, update state and increment key
      setSelectedForm(form);
      setCardKey(prevKey => prevKey + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
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
      {completedForms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* SRF Forms List Sidebar */}
          <div className="bg-gray-50 rounded-lg shadow-md p-4 col-span-1 overflow-y-auto h-[87vh]">
            <h2 className="font-semibold text-lg mb-4 text-gray-700 border-b pb-2">
              Completed SRF Forms
            </h2>
            <div className="space-y-3">
              {[...completedForms].reverse().map((form) => (
                <div
                  key={form._id}
                  className={`bg-white p-4 rounded-lg shadow-sm border-l-4 transition-all duration-200 hover:shadow-md ${selectedForm && selectedForm._id === form._id
                    ? "border-l-green-600"
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
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600"
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
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm">
                      Completed
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
                        <span className="font-medium">
                          Contact Person:
                        </span>{" "}
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
                      <h3 className="text-lg font-medium mb-2">
                        Form Details
                      </h3>
                      <p>
                        <span className="font-medium">SRF ID:</span>{" "}
                        {selectedForm.srfNo || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">ULR Number:</span>{" "}
                        {selectedForm.URL_NO || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">
                          Submission Date:
                        </span>{" "}
                        {new Date(selectedForm.date).toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium">
                          Probable Date:
                        </span>{" "}
                        {new Date(selectedForm.probableDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium text-lg border-b pb-2 mb-3">
                      Form Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p>
                          <span className="font-medium">Condition:</span>{" "}
                          {selectedForm.conditionOfProduct || "N/A"}
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
                              {selectedForm.decisionRules.simpleConformative && (
                                <li>Simple Conformative</li>
                              )}
                              {selectedForm.decisionRules.conditionalConformative && (
                                <li>Conditional Conformative</li>
                              )}
                              {selectedForm.decisionRules.customerDrivenConformative && (
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
                          {selectedForm.calibrationFacilityAvailable || "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">
                            External Calibration:
                          </span>{" "}
                          {selectedForm.calibrationServiceDoneByExternalAgency || "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">
                            Calibration Method:
                          </span>{" "}
                          {selectedForm.calibrationMethodUsed || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Products summary */}
                  <h4 className="font-medium text-lg mt-4">Products List</h4>
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
                        </tr>
                      </thead>
                      <tbody>
                        {selectedForm.products.map((product, index) => (
                          <tr
                            key={product._id}
                            className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                          >
                            <td className="border border-gray-200 px-4 py-2">
                              {product.jobNo}
                            </td>
                            <td className="border border-gray-200 px-4 py-2">
                              {product.instrumentDescription}
                            </td>
                            <td className="border border-gray-200 px-4 py-2">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                Completed
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                <p className="text-gray-500">
                  Select a form from the list to view details
                </p>
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
          <h3 className="text-xl font-medium text-gray-600 mb-2">No Completed SRF Forms</h3>
          <p className="text-gray-500">
            There are currently no completed SRF forms to display.
          </p>
        </div>
      )}
    </div>
  );
};

export default CscCompleted;