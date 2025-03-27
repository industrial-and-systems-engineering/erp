import React, { useEffect, useState } from 'react';
import Ucard from './components/Ucard.jsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import generatePdf from './utils/pdfGeneration.js';

const Ucompleted = () => {
  const [calibratedForms, setCalibratedForms] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfError, setPdfError] = useState(null);

  useEffect(() => {
    const fetchCalibratedForms = async () => {
      try {
        const response = await fetch('/api/errorform/completed');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log("Fetched calibrated forms data:", data); // Log the data structure
        setCalibratedForms(data.data);
      } catch (error) {
        console.error('Error fetching calibrated forms:', error);
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
      serialNo: product.serialNo
    });
    
    if (parentForm) {
      console.log("Parent form fields:", {
        organization: parentForm.organization,
        address: parentForm.address,
        srfNo: parentForm.srfNo
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
        customerAddress: 
          parentForm.address || 
          product.address || 
          product.customerAddress,
        
        // Use instrumentDescription as the primary product name
        name: 
          product.instrumentDescription || 
          product.name || 
          product.description,
        
        // Other fields directly from the product
        make: product.make,
        serialNo: product.serialNo,
        
        // Extract location information (new)
        location: parentForm.calibrationFacilityAvailable || "At Laboratory",
        
        // If there's a methodology in parameters, extract it
        method: product.parameters && product.parameters.length > 0 
                ? product.parameters[0].methodUsed 
                : null
      };
      
      console.log("Enhanced product with parent form data:", enhancedProduct);
      
      setSelectedProduct(prevProduct =>
        (prevProduct && prevProduct._id === product._id) ? null : enhancedProduct
      );
    } else {
      // For products without a parent form
      const enhancedProduct = {
        ...product,
        customerName: product.organization || product.customerName || product.customer,
        customerAddress: product.address || product.customerAddress,
        name: product.instrumentDescription || product.name || product.description,
        location: product.calibrationFacilityAvailable || "At Laboratory" // Add location information here too
      };
      
      console.log("Enhanced product without parent form:", enhancedProduct);
      
      setSelectedProduct(prevProduct =>
        (prevProduct && prevProduct._id === product._id) ? null : enhancedProduct
      );
    }
    
    // Clear any previous PDF errors when selecting a new product
    setPdfError(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold text-center my-10">Completed Products</h1>

      {pdfError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p><strong>Error:</strong> {pdfError}</p>
          <p className="text-sm">Try refreshing the page or check console for more details.</p>
        </div>
      )}

      {calibratedForms.length > 0 ? (
        <div className="space-y-2 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4">
            {calibratedForms.map((form, formIndex) =>
              form.products.map((product, productIndex) => (
                <div key={product._id} className="bg-white p-4 border border-gray-200 rounded-md mb-3 hover:shadow-md">
                  <p className="text-gray-700 font-medium">Form: {form.formNumber || `#${formIndex + 1}`}</p>
                  <p className="text-gray-700">Product: {product.name || product.description || `#${productIndex + 1}`}</p>

                  {/* Enhanced display of customer information */}
                  {(product.customer || product.customerName || form.customerName || form.customer) && (
                    <p className="text-gray-700">
                      Customer: {product.customer || product.customerName || form.customerName || form.customer}
                    </p>
                  )}

                  <div className="flex justify-end mt-2">
                    <button
                      className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700"
                      onClick={() => toggleProductDetails(product, form)}
                    >
                      {selectedProduct && selectedProduct._id === product._id ? 'Hide Details' : 'Show Details'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-center">Product Details</h1>
            {selectedProduct && (
              <div className="mt-4 p-4 rounded-lg shadow-md w-full">
                <Ucard equipment={selectedProduct} />
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700"
                    onClick={() => {
                      console.log("Download button clicked");
                      // Add debug logging before generating PDF
                      console.log("Customer info before PDF generation:", {
                        customerName: selectedProduct.customerName || selectedProduct.customer,
                        customerAddress: selectedProduct.customerAddress || selectedProduct.address,
                        productName: selectedProduct.name || selectedProduct.productName || selectedProduct.description
                      });
                      generatePdf(selectedProduct);
                    }}
                  >
                    Download Form
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No calibrated products found.</p>
      )}
    </div>
  );
};

export default Ucompleted;