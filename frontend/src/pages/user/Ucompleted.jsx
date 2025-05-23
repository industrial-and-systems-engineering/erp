import React, { useEffect, useState } from 'react';
import Ucard from './components/Ucard.jsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import generatePdf, { generateCalibrationResults, generateSimplifiedCertificate, addQrCodeToPdf } from './utils/pdfGeneration.js';
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
      setPdfError(null); // Clear any previous errors

      if (!selectedProduct.referenceStandards || selectedProduct.referenceStandards.length === 0) {
        selectedProduct.referenceStandards = [
          {
            description: "Digital Pressure Calibrator",
            makeModel: "Druck DPI 603",
            slNoIdNo: "60303803 ED/DPC/01",
            calibrationCertificateNo: "TSC/24-25/16266-1",
            validUpTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
              .toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.'),
            calibratedBy: "Transcal Technologies LLP",
            traceableTo: "NPL"
          },
          {
            description: "Digital IR Thermo Meter",
            makeModel: "Metravi MT-16",
            slNoIdNo: "11018053 ED/IT(M-16)-01",
            calibrationCertificateNo: "TSC/24-25/16266-4",
            validUpTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
              .toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.'),
            calibratedBy: "Transcal Technologies LLP",
            traceableTo: "NPL"
          },
          {
            description: "Digital Anemo Meter",
            makeModel: "Lutron AM 4201",
            slNoIdNo: "ED/DAM-01",
            calibrationCertificateNo: "CL-027-04/2024-01",
            validUpTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
              .toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.'),
            calibratedBy: "CAL LABS",
            traceableTo: "NPL"
          }
        ];
      }

      const certificateNo = `ED/CAL/${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}/${new Date().getMonth() > 3 ?
        `${new Date().getFullYear()}-${new Date().getFullYear() + 1 - 2000}` :
        `${new Date().getFullYear() - 1}-${new Date().getFullYear() - 2000}`}`;

      const jobNo = certificateNo.split('/')[2];
      const documentId = `${selectedProduct._id}_${certificateNo.replace(/\//g, '_')}`;
      const viewUrl = `${window.location.origin}/view-calibration/${documentId}`;
      console.log("QR code will link to:", viewUrl);

      // Generate QR code with error handling - Wait for completion before continuing
      let qrCodeDataUrl = null;
      try {
        const QRCode = await import('qrcode');
        qrCodeDataUrl = await QRCode.toDataURL(viewUrl, {
          errorCorrectionLevel: 'M', // Changed back to 'M' for better readability
          margin: 2,
          width: 300, // Increased size for better visibility
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        console.log("QR code generated successfully with URL:", viewUrl);
      } catch (qrError) {
        console.warn("Error generating QR code:", qrError);
        // Continue without QR code, but inform the user
        alert("Could not generate QR code, but will continue with PDF generation.");
      }

      // Create PDF document
      try {
        // Generate first page with the enhanced product data
        const doc = await generatePdf(selectedProduct, true, certificateNo);
        if (!doc) {
          throw new Error("Failed to generate PDF document");
        }

        console.log("PDF first page generated successfully");

        // Add QR code to the PDF
        if (qrCodeDataUrl) {
          try {
            console.log("Adding QR code to PDF document");
            const qrText = "Scan this QR code to view the complete calibration certificate";

            // Add QR code with updated function that places it directly
            addQrCodeToPdf(doc, qrCodeDataUrl, qrText);

            console.log("QR code added to PDF successfully");
          } catch (qrAddError) {
            console.warn("Error adding QR code to PDF:", qrAddError);
            // Continue without QR code
          }
        } else {
          console.warn("No QR code data available to add to PDF");
        }

        // Save the PDF file
        try {
          doc.save(`Calibration_Certificate_FirstPage_${certificateNo.replace(/\//g, '_')}.pdf`);
          console.log("PDF saved successfully" + (qrCodeDataUrl ? " with QR code" : " without QR code"));
        } catch (saveError) {
          console.error("Error saving PDF:", saveError);
          throw new Error("Failed to save PDF: " + saveError.message);
        }

        // Store certificate data for later retrieval
        const certificateData = {
          product: {
            ...selectedProduct,
            qrCodeDataUrl: qrCodeDataUrl,
            qrCodeUrl: viewUrl // Store the URL in case we need to regenerate the QR code
          },
          certificateNo: certificateNo,
          jobNo: jobNo,
          documentId: documentId,
          timestamp: new Date().toISOString(),
          completeGenerated: false
        };

        // Try to store in localStorage first
        try {
          localStorage.setItem(`certificate_${documentId}`, JSON.stringify(certificateData));
          console.log("Certificate data stored in localStorage with ID:", documentId);
        } catch (storageError) {
          console.warn("Failed to store in localStorage:", storageError);
          // Try sessionStorage as fallback
          try {
            sessionStorage.setItem(`certificate_${documentId}`, JSON.stringify(certificateData));
            console.log("Certificate data stored in sessionStorage instead");
          } catch (sessionError) {
            console.error("Failed to store certificate data:", sessionError);
          }
        }

        alert("Certificate with QR code generated successfully. You can scan the QR code to view the complete certificate.");
      } catch (pdfError) {
        console.error("Error in PDF generation process:", pdfError);
        throw new Error("Failed to process PDF: " + pdfError.message);
      }

    } catch (error) {
      console.error("Error in overall PDF with QR process:", error);
      setPdfError("Failed to generate PDF with QR code: " + error.message);
      alert(`There was an error generating the PDF with QR code: ${error.message}\nPlease try using the regular Download button instead.`);
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }
  const amount = 5000;
  const currency = "INR";
  const receiptId = "qwsaq1";

  const paymenthandler = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      if (!selectedProduct || !selectedProduct._id) {
        throw new Error("No product selected");
      }

      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Include productId in the request body
        body: JSON.stringify({
          amount,
          currency,
          receipt: receiptId,
          productId: selectedProduct._id,  // Sending the product ID
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const order = await response.json();
      console.log(order);

      var options = {
        "key": "rzp_test_T6N1vi1kjLuL9s",
        amount, // Amount is in currency subunits.
        currency,
        "name": "Acme Corp",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": order.id,
        "handler": async function (response) {
          const body = { ...response };
          const validateresponse = await fetch("/api/order/validate", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const jsonres = await validateresponse.json();
          console.log(jsonres);
        },
        "prefill": {
          "name": "Gaurav Kumar",
          "email": "gaurav.kumar@example.com",
          "contact": "9000090000"
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
      rzp1.on('payment.failed', function (response) {
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
    <div>
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
          <div className='bg-gray-50 rounded-lg shadow-md p-4 col-span-1 overflow-y-auto h-[87vh]'>
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
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${selectedProduct && selectedProduct._id === product._id
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

          <div className='col-span-3 bg-white rounded-lg shadow-md overflow-y-auto h-[87vh]'>
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
                  {!selectedProduct.ispaymentDone ? (
                    <button
                      className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors'
                      onClick={(e) => {
                        paymenthandler(e);
                      }}
                    >
                      Pay
                    </button>
                  ) : (
                    <button
                      className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors'
                      onClick={() => {
                        console.log("Download with QR button clicked");
                        generatePdfWithQR(selectedProduct);
                      }}
                    >
                      Download with QR
                    </button>
                  )}
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
