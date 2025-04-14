import React, { useEffect, useState } from 'react';
import Ucard from './components/Ucard.jsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import generatePdf, { generateCalibrationResults, generateSimplifiedCertificate } from './utils/pdfGeneration.js';
import QRCode from 'qrcode';

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
      
      const enhancedProduct = {
        ...product,
        _parentForm: parentForm,
        
        customerName: 
          parentForm.organization || 
          product.organization || 
          product.customerName || 
          product.customer,
        
        customerAddress: 
          parentForm.address || 
          product.address || 
          product.customerAddress,
        
        name: 
          product.instrumentDescription || 
          product.name || 
          product.description,
        
        make: product.make,
        serialNo: product.serialNo,
        
        location: product.calibrationFacilityAvailable || "At Laboratory",
        
        method: product.parameters && product.parameters.length > 0 
                ? product.parameters[0].methodUsed 
                : null
      };
      
      console.log("Enhanced product with parent form data:", enhancedProduct);
      
      setSelectedProduct(prevProduct =>
        (prevProduct && prevProduct._id === product._id) ? null : enhancedProduct
      );
    } else {
      const enhancedProduct = {
        ...product,
        customerName: product.organization || product.customerName || product.customer,
        customerAddress: product.address || product.customerAddress,
        name: product.instrumentDescription || product.name || product.description,
        location: product.calibrationFacilityAvailable || "At Laboratory"
      };
      
      console.log("Enhanced product without parent form:", enhancedProduct);
      
      setSelectedProduct(prevProduct =>
        (prevProduct && prevProduct._id === product._id) ? null : enhancedProduct
      );
    }
    setPdfError(null);
  };

  const generatePdfWithQR = async (selectedProduct) => {
    try {
      console.log("Generating first page PDF with QR code");
      
      if (!selectedProduct.referenceStandards || selectedProduct.referenceStandards.length === 0) {
        selectedProduct.referenceStandards = [{
          description: selectedProduct.instrumentDescription || selectedProduct.name || "Measurement Instrument",
          makeModel: selectedProduct.make || "Unknown Make",
          slNoIdNo: selectedProduct.serialNo || "N/A",
          calibrationCertificateNo: selectedProduct.calibrationCertificateNo || 
                                   `ED/CAL/${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}/${
                                     new Date().getFullYear()
                                   }`,
          validUpTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                     .toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'}).replace(/\//g, '.'),
          calibratedBy: "Error Detector",
          traceableTo: "National Standards"
        }];
      }
      
      const certificateNo = `ED/CAL/${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}/${new Date().getMonth() > 3 ? 
        `${new Date().getFullYear()}-${new Date().getFullYear() + 1 - 2000}` : 
        `${new Date().getFullYear() - 1}-${new Date().getFullYear() - 2000}`}`;
      
      const jobNo = certificateNo.split('/')[2];
      
      const documentId = `${selectedProduct._id}_${certificateNo.replace(/\//g, '_')}`;
      
      const viewUrl = `${window.location.origin}/view-calibration/${documentId}`;
      console.log("QR code will link to:", viewUrl);
      
      try {
        const qrCodeDataUrl = await QRCode.toDataURL(viewUrl, {
          errorCorrectionLevel: 'M',
          margin: 1,
          width: 200,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        
        console.log("QR code generated successfully with URL:", viewUrl);
        
        // Create only the first page of the PDF document
        const doc = await generatePdf(selectedProduct, true, certificateNo);
        
        if (!doc) {
          throw new Error("Failed to generate PDF first page");
        }
        
        console.log("PDF first page generated successfully");
        
        // Add QR code to the first page
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const qrSize = 30;
        
        // Position QR code above the green footer
        doc.addImage(qrCodeDataUrl, 'PNG', 20, pageHeight - 60, qrSize, qrSize);
        
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        doc.text("Scan this QR code to view the complete calibration certificate", 55, pageHeight - 45);
        
        // Save the first page PDF with a different name
        doc.save(`Calibration_Certificate_FirstPage_${certificateNo.replace(/\//g, '_')}.pdf`);
        console.log("First page PDF with QR code saved successfully");
        
        // Store product and certificate data for second page generation later
        const certificateData = {
          product: {
            ...selectedProduct,
            qrCodeDataUrl: qrCodeDataUrl // Include QR code in the product data
          },
          certificateNo: certificateNo,
          jobNo: jobNo,
          documentId: documentId,
          timestamp: new Date().toISOString(),
          completeGenerated: false // Flag to track if the complete certificate has been generated
        };
        
        localStorage.setItem(`certificate_${documentId}`, JSON.stringify(certificateData));
        console.log("Certificate data stored for QR lookup with ID:", documentId);
        
        // Show success message to the user
        // alert(`First page of certificate generated successfully. Scan the QR code to view and download the complete certificate.`);
        
      } catch (qrError) {
        console.error("Error generating QR code:", qrError);
        throw new Error("Failed to generate QR code: " + qrError.message);
      }
      
    } catch (error) {
      console.error("Error generating PDF with QR:", error);
      setPdfError("Failed to generate PDF with QR code: " + error.message);
    }
  };
  
  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }
    const amount= 5000;
    const currency= "INR";
    const receiptId= "qwsaq1";

    const paymenthandler = async (e) => {

      if(e && e.preventDefault) e.preventDefault();
      try {
        const response = await fetch("http://localhost:8080/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            currency,
            receipt: receiptId,
          }),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const order = await response.json();
        console.log(order);
        var options = {
          "key": "rzp_test_T6N1vi1kjLuL9s", // Enter the Key ID generated from the Dashboard
          amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency,
          "name": "Acme Corp", //your business name
          "description": "Test Transaction",
          "image": "https://example.com/your_logo",
          "order_id":order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          "handler": async function (response){
            const body={...response,};
            const validateresponse=await fetch("http://localhost:8080/order/validate", {
             method: "POST",
             body: JSON.stringify(body),
             headers: {
                "Content-Type": "application/json",
             },
            });
            const jsonres=await validateresponse.json();
            console.log(jsonres);
          },
          "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
              "name": "Gaurav Kumar", //your customer's name
              "email": "gaurav.kumar@example.com", 
              "contact": "9000090000"  //Provide the customer's phone number for better conversion rates 
          },
          "notes": {
              "address": "Razorpay Corporate Office"
          },
          "theme": {
              "color": "#3399cc"
          }
      };
      var rzp1 = new window.Razorpay(options);
      rzp1.open();
      rzp1.on('payment.failed', function (response){
              alert(response.error.code);
              alert(response.error.description);
              alert(response.error.source);
              alert(response.error.step);
              alert(response.error.reason);
              alert(response.error.metadata.order_id);
              alert(response.error.metadata.payment_id);
      });
      } catch (err) {
        console.error("Payment handler error:", err);
      }
    };
    
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

                  {(product.customer || form.customerName) && (
                    <p className="text-gray-700">Customer: {product.customer || form.customerName}</p>
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
                    className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-2'
                    onClick={() => {
                      console.log("Download button clicked");
                      generateSimplifiedCertificate(selectedProduct);
                    }}
                  >
                    Download Form
                  </button>
                  <button
                    className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors'
                    onClick={() => {
                      console.log("Download with QR button clicked");
                      generatePdfWithQR(selectedProduct);
                    }}
                  >
                    Download with QR
                  </button>
                  
                  <button
                    className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors'
                    onClick={(e) => {
                      //console.log("Download with QR button clicked");
                      paymenthandler(e);
                    }}
                  >
                    pay
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

      {/* <button onClick={paymenthandler}>pay</button> */}
    </div>
  );
};

export default Ucompleted;
