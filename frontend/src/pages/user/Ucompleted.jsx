import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../utils/isloggedin';
import UserNavbar from '../../components/navbar/UserNavbar.jsx';
import Ucard from '../../components/EquipmentCard/Ucard.jsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Ucompleted = () => {
  const [calibratedForms, setCalibratedForms] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfError, setPdfError] = useState(null);

  useEffect(() => {
    const fetchCalibratedForms = async () => {
      try {
        const response = await fetch('/api/errorform/calibrated');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log("Fetched calibrated forms data:", data); // Log the data structure
        setCalibratedForms(data);
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
    if (parentForm) {
      console.log("Parent form:", parentForm);
      // Merge parent form customer info into the product for easier access
      const enhancedProduct = {
        ...product,
        _parentForm: parentForm, // Store reference to parent form
        customerName: product.customerName || parentForm.customerName,
        customerAddress: product.customerAddress || parentForm.customerAddress,
        // Add other fields that might be in the parent form but needed for the product
      };
      setSelectedProduct(prevProduct => 
        (prevProduct && prevProduct._id === product._id) ? null : enhancedProduct
      );
    } else {
      setSelectedProduct(prevProduct => 
        (prevProduct && prevProduct._id === product._id) ? null : product
      );
    }
    // Clear any previous PDF errors when selecting a new product
    setPdfError(null);
  };

  const generatePdf = () => {
    try {
      console.log("generatePdf function called");
      
      if (!selectedProduct) {
        console.error("No product selected");
        setPdfError("No product selected");
        return;
      }
      
      console.log("Selected product for PDF generation:", selectedProduct);
      
      // Extract customer data with detailed logging
      let customerName = "Unknown Customer";
      if (selectedProduct.customer) {
        customerName = selectedProduct.customer;
        console.log("Using customer from product.customer:", customerName);
      } else if (selectedProduct.customerName) {
        customerName = selectedProduct.customerName;
        console.log("Using customer from product.customerName:", customerName);
      } else if (selectedProduct._parentForm && selectedProduct._parentForm.customerName) {
        customerName = selectedProduct._parentForm.customerName;
        console.log("Using customer from parent form:", customerName);
      } else {
        console.log("No customer name found, using default");
      }
      
      let customerAddress = "Unknown Address";
      if (selectedProduct.address) {
        customerAddress = selectedProduct.address;
        console.log("Using address from product.address:", customerAddress);
      } else if (selectedProduct.customerAddress) {
        customerAddress = selectedProduct.customerAddress;
        console.log("Using address from product.customerAddress:", customerAddress);
      } else if (selectedProduct._parentForm && selectedProduct._parentForm.customerAddress) {
        customerAddress = selectedProduct._parentForm.customerAddress;
        console.log("Using address from parent form:", customerAddress);
      } else {
        console.log("No customer address found, using default");
      }
      
      // Extract product details with proper fallbacks
      const productName = selectedProduct.name || 
                          selectedProduct.productName || 
                          selectedProduct.description || 
                          "Unknown Product";
                          
      const productMake = selectedProduct.make || 
                          selectedProduct.manufacturer || 
                          "Unknown Make";
                          
      const serialNo = selectedProduct.serialNo || 
                       selectedProduct.serialNumber || 
                       "N/A";

      // Use selectedProduct data for certificate fields
      const certificate = {
        // Map your selectedProduct properties to these fields with better fallbacks
        certificateNo: selectedProduct.certificateNo || "CC-" + Math.floor(Math.random() * 10000),
        issueDate: new Date().toLocaleDateString(),
        serviceRequestFormNo: selectedProduct.serviceRequestFormNo || 
                              (selectedProduct._parentForm && selectedProduct._parentForm.formNumber) ||
                              "SRF-" + Math.floor(Math.random() * 10000),
        issuedTo: customerName,
        address: customerAddress,
        description: productName,
        make: productMake,
        serialNo: serialNo,
        range: selectedProduct.range || selectedProduct.measurementRange || "Full Range",
        condition: selectedProduct.condition || "Good",
        receivedDate: selectedProduct.receivedDate || 
                     (selectedProduct._parentForm && selectedProduct._parentForm.submissionDate) ||
                     new Date().toLocaleDateString(),
        completionDate: selectedProduct.completionDate || selectedProduct.calibratedDate || new Date().toLocaleDateString(),
        nextCalibrationDate: selectedProduct.nextCalibrationDate || 
                             new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString(),
        location: selectedProduct.location || selectedProduct.calibrationLocation || "Lab",
        temperature: selectedProduct.temperature || selectedProduct.calibrationTemperature || "23 ± 2",
        humidity: selectedProduct.humidity || selectedProduct.calibrationHumidity || "50 ± 5%",
        method: selectedProduct.method || selectedProduct.calibrationMethod || "SOP-CAL-001",
        referenceStandard: selectedProduct.referenceStandard || [
          {
            description: "Reference Standard",
            makeModel: "Standard Make",
            slNoIdNo: "STD12345",
            calibrationCertificateNo: "CC-STD-001",
            validUpTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString(),
            calibratedBy: "National Lab",
            traceableTo: "SI Units"
          }
        ]
      };
      
      console.log("Certificate data prepared:", certificate);

      // Create new jsPDF instance
      console.log("Creating jsPDF instance");
      const doc = new jsPDF();
      console.log("jsPDF instance created successfully");

      // Header Section
      try {
        // Try with default font first
        doc.setFontSize(14);
        doc.text("CALIBRATION CERTIFICATE", 105, 15, { align: "center" });
        console.log("Header title added");
      } catch (fontError) {
        console.error("Error with font:", fontError);
        // Fallback to a standard font
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("CALIBRATION CERTIFICATE", 105, 15, { align: "center" });
      }

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Calibration Certificate No.: ${certificate.certificateNo}`, 20, 25);
      doc.text(`Date of Issue: ${certificate.issueDate}`, 150, 25);
      doc.text(`Service Request Form No.: ${certificate.serviceRequestFormNo}`, 20, 30);
      doc.text(`Page: 01 of 02 pages`, 150, 30);
      doc.text(`ULR-CC373124000000502F`, 20, 35);
      console.log("Header information added");

      // Section Details
      let y = 45;
      const leftMargin = 20;

      // Section 1
      doc.setFont("helvetica", "bold");
      doc.text("1. Certificate Issued to", leftMargin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.text(`   : ${certificate.issuedTo}`, leftMargin + 5, y);
      y += 5;
      doc.text(`     ${certificate.address}`, leftMargin + 5, y);
      console.log("Section 1 added");

      // Section 2
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text("2. Description & Identification of the item to be calibrated", leftMargin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.text(`   i) Item          : ${certificate.description}`, leftMargin + 5, y);
      y += 5;
      doc.text(`   ii) Make         : ${certificate.make}`, leftMargin + 5, y);
      y += 5;
      doc.text(`   iii) Sl no.      : ${certificate.serialNo}`, leftMargin + 5, y);
      y += 5;
      doc.text(`   iv) Range        : ${certificate.range}`, leftMargin + 5, y);
      console.log("Section 2 added");

      // Section 3
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text("3. Condition of the item", leftMargin, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.text(`   : ${certificate.condition}`, leftMargin + 5, y);
      console.log("Section 3 added");

      // Section 4 - Date of Item Received
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text("4. Date of Item Received", leftMargin, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.text(`   : ${certificate.receivedDate}`, leftMargin + 5, y);
      console.log("Section 4 added");

      // Section 5 - Date of Completion of Calibration
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text("5. Date of Completion of Calibration", leftMargin, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.text(`   : ${certificate.completionDate}`, leftMargin + 5, y);
      console.log("Section 5 added");

      // Section 6 - Next Calibration Recommended on
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text("6. Next Calibration Recommended on", leftMargin, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.text(`   : ${certificate.nextCalibrationDate}`, leftMargin + 5, y);
      console.log("Section 6 added");

      // Section 7 - Location where Calibration Performed
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text("7. Location where Calibration Performed", leftMargin, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.text(`   : ${certificate.location}`, leftMargin + 5, y);
      console.log("Section 7 added");

      // Section 8 - Environmental Condition during Calibration
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text("8. Environmental Condition during Calibration", leftMargin, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.text(`   : Temp: ${certificate.temperature}°C, Humidity: ${certificate.humidity}`, leftMargin + 5, y);
      console.log("Section 8 added");

      // Section 9 - Calibration Method Used
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text("9. Calibration Method Used", leftMargin, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.text(`   : As per our SOP No.: ${certificate.method}`, leftMargin + 5, y);
      console.log("Section 9 added");

      // Section 10 - Reference Standard Details (Table)
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text(
        "10. Details of Reference Standard used for calibration",
        leftMargin,
        y
      );
      y += 6;
      
      try {
        console.log("Attempting to create table");
        // AutoTable for reference standards
        doc.autoTable({
          startY: y + 5,
          head: [['Sl No', 'Description', 'Make/Model', 'Sl No/Id No', 'Calibration Certificate No', 'Valid up to', 'Calibrated By', 'Traceable to']],
          body: certificate.referenceStandard.map((ref, index) => [
            index + 1,
            ref.description || "",
            ref.makeModel || "",
            ref.slNoIdNo || "",
            ref.calibrationCertificateNo || "",
            ref.validUpTo || "",
            ref.calibratedBy || "",
            ref.traceableTo || ""
          ]),
          theme: 'grid',
          styles: { fontSize: 8 }
        });
        console.log("Table created successfully");
      } catch (tableError) {
        console.error("Error creating table:", tableError);
        // Handle table error, maybe add a text instead
        y += 10;
        doc.text("Reference standard data could not be displayed due to an error.", leftMargin, y);
      }

      // Footer with signature
      let finalY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : y + 40;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Authorised by:", leftMargin, finalY);
      finalY += 5;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("(P.R. SINGHA)", leftMargin + 10, finalY);
      finalY += 5;
      doc.text("(Technical Manager)", leftMargin + 10, finalY);
      console.log("Footer added");

      // Save the PDF
      console.log("Attempting to save PDF");
      doc.save(`Calibration_Certificate_${certificate.certificateNo}.pdf`);
      console.log("PDF saved successfully");
      
      // Clear any previous errors if successful
      setPdfError(null);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      setPdfError(`PDF Generation Error: ${error.message}`);
    }
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
                  
                  {/* Display customer information if available */}
                  {(product.customer || form.customerName) && (
                    <p className="text-gray-700">Customer: {product.customer || form.customerName}</p>
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
                      generatePdf();
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