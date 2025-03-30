import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import generatePdf, { generateCalibrationResults } from './utils/pdfGeneration.js';

const ViewCalibration = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Get certificate data from localStorage
      const storedData = localStorage.getItem(`certificate_${documentId}`);
      
      if (storedData) {
        console.log("Retrieved certificate data:", storedData);
        const parsedData = JSON.parse(storedData);
        setCertificateData(parsedData);
        
        // Automatically generate the full certificate
        generateCompleteCertificate(parsedData);
      } else {
        setError("Certificate data not found. Please return to the original page and try again.");
      }
    } catch (err) {
      console.error("Error retrieving certificate data:", err);
      setError("Error retrieving certificate data: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  const generateCompleteCertificate = async (data) => {
    try {
      const { product, certificateNo, jobNo } = data;
      
      // Create a new PDF document for the combined certificate
      const doc = new jsPDF();
      
      // Generate first page directly in the combined document
      // Instead of trying to copy from another PDF
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      
      // Generate first page - This generates the first page directly in our doc
      await generateFirstPage(doc, product, certificateNo);
      
      // Add second page
      doc.addPage();
      
      // Generate the second page with calibration results
      generateCalibrationResults(doc, product, certificateNo, jobNo);
      
      // Save the combined PDF
      doc.save(`Complete_Calibration_Certificate_${certificateNo.replace(/\//g, '_')}.pdf`);
      
    } catch (error) {
      console.error("Error generating complete certificate:", error);
      setError("Failed to generate complete certificate: " + error.message);
    }
  };

  // New function to generate the first page directly in the combined document
  const generateFirstPage = async (doc, product, certificateNo) => {
    try {
      // Extract customer data
      let customerName = "Unknown Customer";
      if (product._parentForm && product._parentForm.organization) {
        customerName = product._parentForm.organization;
      } else if (product.organization) {
        customerName = product.organization;
      } else if (product.customerName) {
        customerName = product.customerName;
      } else if (product.customer) {
        customerName = product.customer;
      }
      
      // Get address
      let customerAddress = "Unknown Address";
      if (product._parentForm && product._parentForm.address) {
        customerAddress = product._parentForm.address;
      } else if (product.address) {
        customerAddress = product.address;
      } else if (product.customerAddress) {
        customerAddress = product.customerAddress;
      }
      
      // Get SRF number
      const srfNo = product._parentForm && product._parentForm.srfNo 
                   ? product._parentForm.srfNo 
                   : "Unknown SRF";
      
      // Extract product details
      const productName = product.instrumentDescription || product.name || product.description || "Unknown Product";
      const productMake = product.make || "Unknown Make";
      const serialNo = product.serialNo || "N/A";
      
      // Get method
      let methodUsed = "ED/SOP/E-002";
      if (product.parameters && product.parameters.length > 0 && product.parameters[0].methodUsed) {
        methodUsed = product.parameters[0].methodUsed.split(" - ")[0]; // Get just the method number
      }
      
      // Get range
      const range = product.parameters && product.parameters.length > 0 ? 
                   product.parameters[0].ranges || "Full Range" : "Full Range";
      
      // Format dates
      const formatDate = (date) => {
        if (!date) return new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).replace(/\//g, '.');
        
        const d = new Date(date);
        return d.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).replace(/\//g, '.');
      };
      
      const issueDate = formatDate();
      const receivedDate = formatDate(product._parentForm && product._parentForm.date);
      const completionDate = formatDate();
      const nextCalibrationDate = formatDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
      
      // Extract temperature and humidity
      const temperature = product.roomTemp || "25±4°C";
      const humidity = product.humidity ? `${product.humidity}%` : "30 to 75% RH";
      
      // Set up the document
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      
      // Add background
      doc.setFillColor(240, 248, 255);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Title
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 102, 204);
      doc.setFontSize(16);
      doc.text("CALIBRATION CERTIFICATE", pageWidth / 2, 15, { align: "center" });
      
      // Use smaller font size for the whole document to match second page
      doc.setFontSize(10);
      
      // Certificate details
      doc.setFont("helvetica", "bold");
      doc.setTextColor(25, 118, 210);
      doc.text("Calibration Certificate No.", 20, 25);
      doc.setTextColor(0, 0, 0);
      doc.text(":", 80, 25);
      doc.setFont("helvetica", "normal");
      doc.text(certificateNo, 85, 25);
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(25, 118, 210);
      doc.text("Date of Issue", 140, 25);
      doc.setTextColor(0, 0, 0);
      doc.text(":", 165, 25);
      doc.setFont("helvetica", "normal");
      doc.text(issueDate, 170, 25);
      
      // SRF No and Page
      doc.setFont("helvetica", "bold");
      doc.setTextColor(25, 118, 210);
      doc.text("Service Request Form No", 20, 30);
      doc.setTextColor(0, 0, 0);
      doc.text(":", 80, 30);
      doc.setFont("helvetica", "normal");
      doc.text(srfNo, 85, 30);
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(25, 118, 210);
      doc.text("Page", 140, 30);
      doc.setTextColor(0, 0, 0);
      doc.text(":", 165, 30);
      doc.setFont("helvetica", "normal");
      doc.text("01 of 02 pages", 170, 30);
      
      // ULR line
      doc.setTextColor(0, 0, 0);
      doc.text("ULR-CC373124000000502F", 20, 35);
      
      // Section Details
      let y = 45;
      const leftMargin = 20;
      const indentedMargin = leftMargin + 5;
      
      // Section 1 - Certificate Issued to
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("1.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Certificate Issued to", leftMargin + 5, y);
      doc.text(":", 80, y);
      doc.setFont("helvetica", "normal");
      doc.text(`M/s. ${customerName}`, 85, y);
      
      // Address - Handle multi-line address with smaller line spacing
      const addressLines = customerAddress.split(',');
      if (addressLines.length > 1) {
        y += 4; // Reduced from 5 to 4
        doc.text(addressLines[0], 85, y);
        
        for (let i = 1; i < addressLines.length; i++) {
          y += 4; // Reduced from 5 to 4
          doc.text(addressLines[i].trim(), 85, y);
        }
      } else {
        y += 4; // Reduced from 5 to 4
        doc.text(customerAddress, 85, y);
      }
      
      // Section 2 - Description & Identification
      y += 8; // Reduced from 10 to 8
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("2.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Description &", leftMargin + 5, y);
      y += 4; // Reduced from 5 to 4
      doc.text("Identification of the item", leftMargin + 5, y);
      y += 4; // Reduced from 5 to 4
      doc.text("to be calibrated", leftMargin + 5, y);
      
      // Item details
      y += 6; // Reduced from 7 to 6
      doc.setTextColor(0, 128, 128);
      doc.text("i)", indentedMargin, y);
      doc.text("Item", indentedMargin + 10, y);
      doc.setTextColor(0, 0, 0);
      doc.text(":", 80, y);
      doc.setFont("helvetica", "normal");
      doc.text(productName, 85, y);
      
      y += 4; // Reduced from 5 to 4
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 128, 128);
      doc.text("ii)", indentedMargin, y);
      doc.text("Make", indentedMargin + 10, y);
      doc.setTextColor(0, 0, 0);
      doc.text(":", 80, y);
      doc.setFont("helvetica", "normal");
      doc.text(productMake, 85, y);
      
      y += 4; // Reduced from 5 to 4
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 128, 128);
      doc.text("iii)", indentedMargin, y);
      doc.text("Sl no.", indentedMargin + 10, y);
      doc.setTextColor(0, 0, 0);
      doc.text(":", 80, y);
      doc.setFont("helvetica", "normal");
      doc.text(serialNo, 85, y);
      
      y += 4; // Reduced from 5 to 4
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 128, 128);
      doc.text("iv)", indentedMargin, y);
      doc.text("Range", indentedMargin + 10, y);
      doc.setTextColor(0, 0, 0);
      doc.text(":", 80, y);
      doc.setFont("helvetica", "normal");
      doc.text(range, 85, y);
      
      // Get condition from service request form
      let condition = "Satisfactory"; // Default fallback
      if (product._parentForm && product._parentForm.condition) {
        condition = product._parentForm.condition;
      } else if (product.condition) {
        condition = product.condition;
      } else if (product.itemCondition) {
        condition = product.itemCondition;
      }
      
      console.log("Using item condition:", condition);
      
      // Section 3 - Condition
      y += 8; // Reduced from 10 to 8
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("3.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Condition of the item", leftMargin + 5, y);
      doc.text(":", 80, y);
      doc.setFont("helvetica", "normal");
      doc.text(condition, 85, y); // Use the extracted condition value
      
      // Section 4 - Date of Item Received
      y += 8; // Reduced from 10 to 8
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("4.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Date of Item Received", leftMargin + 5, y);
      doc.text(":", 80, y);
      doc.setFont("helvetica", "normal");
      doc.text(receivedDate, 85, y);
      
      // Section 5 - Completion Date
      y += 8; // Reduced from 10 to 8
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("5.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Date of Completion of Calibration", leftMargin + 5, y);
      doc.text(":", 85, y);
      doc.setFont("helvetica", "normal");
      doc.text(completionDate, 90, y);
      
      // Section 6 - Next Calibration
      y += 8; // Reduced from 10 to 8
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("6.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Next Calibration Recommended on", leftMargin + 5, y);
      doc.text(":", 85, y);
      doc.setFont("helvetica", "normal");
      doc.text(nextCalibrationDate, 90, y);
      
      // Extract location from calibration data
      let location = "At Laboratory"; // Default fallback value
      if (product.calibrationFacilityAvailable) {
        location = product.calibrationFacilityAvailable;
        console.log("Using calibrationFacilityAvailable as location:", location);
      } else if (product.location) {
        location = product.location;
        console.log("Using location from product:", location);
      } else if (product._parentForm && product._parentForm.calibrationLocation) {
        location = product._parentForm.calibrationLocation;
        console.log("Using calibrationLocation from parent form:", location);
      }
      
      // Section 7 - Location
      y += 8; // Reduced from 10 to 8
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("7.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Location where Calibration Performed", leftMargin + 5, y);
      doc.text(":", 90, y);
      doc.setFont("helvetica", "normal");
      doc.text(location, 95, y); // Use the extracted location value
      
      // Section 8 - Environmental Condition
      y += 8; // Reduced from 10 to 8
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("8.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Environmental Condition during Calibration", leftMargin + 5, y);
      doc.text(":", 100, y);
      doc.setFont("helvetica", "normal");
      doc.text(`Temp: ${temperature}`, 105, y);
      doc.text(`Humidity: ${humidity}`, 145, y); // Moved from 135 to 145 to avoid overlap
      
      // Section 9 - Method
      y += 8; // Reduced from 10 to 8
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("9.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Calibration Method Used", leftMargin + 5, y);
      doc.text(":", 85, y);
      doc.setFont("helvetica", "normal");
      doc.text(`As per our SOP No: ${methodUsed}`, 90, y);
      
      // Section 10 - Reference Standards - Adjusted to save vertical space
      y += 8; // Reduced from 10 to 8
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("10.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Details of Reference Standard used for calibration", leftMargin + 5, y);
      y += 4; // Reduced from 5 to 4
      doc.text("(Traceable to National/International Standards)", leftMargin + 5, y);
      y += 6; // Reduced from 8 to 6
      
      // Reference Standard Table with smaller font
      doc.autoTable({
        startY: y,
        head: [['SI no', 'Description', 'Make/Model', 'Slno/Idno', 'Calibration Certificate No', 'Valid up to', 'Calibrated By', 'Traceable to']],
        body: [
          ['1.', 'Decade Resistance Box', 'Zeal Services ZSDRB', '201008205 ED/RB-02', 'CAL/24-25/CC/0270-1', '06.07.2025', 'Nashik Engineering Cluster', 'NPL']
        ],
        theme: 'grid',
        styles: { 
          fontSize: 7, // Reduced from 8 to 7
          cellPadding: 1, // Reduced from 2 to 1
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
          fontStyle: 'normal'
        },
        headStyles: {
          fillColor: [144, 238, 144],
          textColor: [0, 0, 0],
          fontStyle: 'bold'
        },
        bodyStyles: {
          fillColor: [240, 255, 240]
        }
      });
      
      // Footer with signature - use lastAutoTable instead of previousAutoTable
      let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : y + 40;
      
      // Make sure we have space for the signature
      if (finalY > pageHeight - 30) {
        doc.addPage();
        finalY = 20;
      }
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("Authorised by", leftMargin, finalY);
      
      finalY += 10; // Reduced from 15 to 10
      doc.setTextColor(25, 25, 112);
      doc.text("(P.R.SINGHA)", leftMargin, finalY);
      
      finalY += 5; // Reduced from 7 to 5
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text("(Technical Manager)", leftMargin, finalY);
      
      return doc;
    } catch (error) {
      console.error("Error generating first page:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading certificate data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/user/completed')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Return to Completed Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Complete Calibration Certificate</h1>
        
        {certificateData && (
          <div>
            <div className="mb-6 bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-green-700 font-medium">
                The complete calibration certificate has been generated and downloaded automatically.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-semibold mb-2 text-gray-700">Certificate Details:</h2>
              <ul className="list-disc pl-6 text-gray-600">
                <li>Certificate Number: {certificateData.certificateNo}</li>
                <li>Job Number: {certificateData.jobNo}</li>
                <li>Serial Number: {certificateData.product?.serialNo || "N/A"}</li>
                <li>Created: {new Date(certificateData.timestamp).toLocaleString()}</li>
              </ul>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => generateCompleteCertificate(certificateData)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Download Certificate Again
              </button>
              
              <button
                onClick={() => navigate('/user/completed')}
                className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Return to Completed Products
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCalibration;
