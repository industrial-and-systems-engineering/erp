import React, { useEffect, useState } from "react";
import Ucard from "./components/Ucard.jsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import generatePdf from "./utils/pdfGeneration.js";

const Ucompleted = () => {
  const [calibratedForms, setCalibratedForms] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfError, setPdfError] = useState(null);
  const [cardKey, setCardKey] = useState(0);

  useEffect(() => {
    const fetchCalibratedForms = async () => {
      try {
        const response = await fetch("/api/errorform/completed");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        console.log("Fetched calibrated forms data:", data);
        setCalibratedForms(data.data);
      } catch (error) {
        console.error("Error fetching calibrated forms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalibratedForms();
  }, []);

  const toggleProductDetails = (product, parentForm) => {
    console.log("Selected product:", product);
    console.log("Parent form:", parentForm);

    // Log key fields based on the actual structure we observed
    console.log("Product fields:", {
      instrumentDescription: product.instrumentDescription,
      make: product.make,
      serialNo: product.serialNo,
    });

    if (parentForm) {
      console.log("Parent form fields:", {
        organization: parentForm.organization,
        address: parentForm.address,
        srfNo: parentForm.srfNo,
      });

      // Create enhanced product with correct field mapping
      const enhancedProduct = {
        ...product,
        _parentForm: parentForm,

        // Extract organization as customer name
        customerName:
          parentForm.organization ||
          product.organization ||
          product.customerName ||
          product.customer,

        // Extract address
        customerAddress: parentForm.address || product.address || product.customerAddress,

        // Use instrumentDescription as the primary product name
        name: product.instrumentDescription || product.name || product.description,

        // Other fields directly from the product
        make: product.make,
        serialNo: product.serialNo,

        // Extract location information (new)
        location: parentForm.calibrationFacilityAvailable || "At Laboratory",

        // If there's a methodology in parameters, extract it
        method:
          product.parameters && product.parameters.length > 0
            ? product.parameters[0].methodUsed
            : null,
      };

      console.log("Enhanced product with parent form data:", enhancedProduct);

      setSelectedProduct((prevProduct) =>
        prevProduct && prevProduct._id === product._id ? null : enhancedProduct
      );
    } else {
      // For products without a parent form
      const enhancedProduct = {
        ...product,
        customerName: product.organization || product.customerName || product.customer,
        customerAddress: product.address || product.customerAddress,
        name: product.instrumentDescription || product.name || product.description,
        location: product.calibrationFacilityAvailable || "At Laboratory", // Add location information here too
      };

      console.log("Enhanced product without parent form:", enhancedProduct);

      setSelectedProduct((prevProduct) =>
        prevProduct && prevProduct._id === product._id ? null : enhancedProduct
      );
    }

    // Clear any previous PDF errors when selecting a new product
    setPdfError(null);
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='container py-10'>
      {pdfError && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          <p>
            <strong>Error:</strong> {pdfError}
          </p>
          <p className='text-sm'>Try refreshing the page or check console for more details.</p>
        </div>
      )}

      {calibratedForms.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          {/* Product List Sidebar */}
          <div className='bg-gray-50 rounded-lg shadow-md p-4 col-span-1 overflow-y-auto max-h-[600px]'>
            <h2 className='font-semibold text-lg mb-4 text-gray-700 border-b pb-2'>
              Completed Products
            </h2>

            {calibratedForms.map((form, formIndex) =>
              form.products.map((product, productIndex) => (
                <div
                  key={product._id}
                  className='bg-white p-4 border border-gray-200 rounded-md mb-3 hover:shadow-md'
                >
                  <p className='text-gray-700 font-medium'>
                    Form: {form.formNumber || `#${formIndex + 1}`}
                  </p>
                  <p className='text-gray-700'>
                    Product: {product.name || product.description || `#${productIndex + 1}`}
                  </p>

                  {/* Enhanced display of customer information */}
                  {(product.customer ||
                    product.customerName ||
                    form.customerName ||
                    form.customer) && (
                    <p className='text-gray-700'>
                      Customer:{" "}
                      {product.customer ||
                        product.customerName ||
                        form.customerName ||
                        form.customer}
                    </p>
                  )}

                  <div className='flex justify-end mt-2'>
                    <button
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedProduct && selectedProduct._id === product._id
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                      onClick={() => toggleProductDetails(product, form)}
                    >
                      {selectedProduct && selectedProduct._id === product._id ? (
                        <span className='flex items-center justify-center gap-1'>
                          <span>Hide Details</span>
                          <span className='text-xs'>▲</span>
                        </span>
                      ) : (
                        <span className='flex items-center justify-center gap-1'>
                          <span>Show Details</span>
                          <span className='text-xs'>▼</span>
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Product Details Panel */}
          <div className='col-span-3 bg-white rounded-lg shadow-md overflow-y-auto max-h-[600px]'>
            {selectedProduct ? (
              <div className='p-4'>
                <h1 className='text-xl font-bold mb-4 border-b pb-2'>Product Details</h1>
                <Ucard
                  key={cardKey}
                  equipment={selectedProduct}
                />
                <div className='flex justify-end mt-4'>
                  <button
                    className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
                    onClick={() => {
                      console.log("Download button clicked");
                      // Add debug logging before generating PDF
                      console.log("Customer info before PDF generation:", {
                        customerName: selectedProduct.customerName || selectedProduct.customer,
                        customerAddress: selectedProduct.customerAddress || selectedProduct.address,
                        productName:
                          selectedProduct.name ||
                          selectedProduct.productName ||
                          selectedProduct.description,
                      });
                      generatePdf(selectedProduct);
                    }}
                  >
                    Download Form
                  </button>
                </div>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center h-full p-10 text-center'>
                <svg
                  className='w-16 h-16 text-gray-300 mb-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                  ></path>
                </svg>
                <h3 className='text-xl font-medium text-gray-600 mb-2'>No Product Selected</h3>
                <p className='text-gray-500'>Select a product from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow-md p-10 text-center'>
          <svg
            className='w-16 h-16 text-gray-300 mx-auto mb-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
            ></path>
          </svg>
          <h3 className='text-xl font-medium text-gray-600 mb-2'>No Completed Products</h3>
          <p className='text-gray-500'>There are currently no completed products to display.</p>
        </div>
      )}
    </div>
  );
};

export default Ucompleted;
