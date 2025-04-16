import React, { useState, useEffect } from "react";
import { useCompletedFormsStore } from "./utils/completedForms";

const CscCompleted = () => {
  const { completedForms, fetchCompletedForms } = useCompletedFormsStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);

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
    setSelectedForm((prevForm) =>
      prevForm && prevForm._id === form._id ? null : form
    );
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
      <h1 className="text-2xl font-bold my-6 mb-4 text-center">
        Completed SRF Forms
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left pane - List of completed forms */}
        <div className="lg:col-span-1 bg-gray-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3 pb-2 border-b">
            SRF Forms
          </h2>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            {completedForms.map((form) => (
              <div
                key={form._id}
                onClick={() => toggleFormDetails(form)}
                className={`p-4 rounded-lg shadow-sm cursor-pointer transition-all ${
                  selectedForm && selectedForm._id === form._id
                    ? "bg-green-100 border-l-4 border-green-500"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">
                    SRF #{form.srfNo || "N/A"}
                  </h3>
                  <span className="text-xs bg-green-100 text-green-800 rounded-full px-2 py-1">
                    Completed
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  Contact: {form.contactPersonName || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Products: {form.products?.length || 0}
                </p>
                <button className="mt-2 w-full p-2 rounded text-sm font-medium bg-green-500 hover:bg-green-600 text-white">
                  {selectedForm && selectedForm._id === form._id
                    ? "Hide Details"
                    : "View Details"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right pane - Details of selected form */}
        <div className="lg:col-span-2">
          {selectedForm ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
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
                      <span className="font-medium">Telephone:</span>{" "}
                      {selectedForm.telephoneNumber || "N/A"}
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
                    <p>
                      <span className="font-medium">
                        Created At:
                      </span>{" "}
                      {new Date(selectedForm.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">
                        Updated At:
                      </span>{" "}
                      {new Date(selectedForm.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium text-lg border-b pb-2 mb-3">
                    Form Details
                  </h4>
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
                Select a form from the list to view details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CscCompleted;
