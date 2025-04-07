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
      const storedData = localStorage.getItem(`certificate_${documentId}`);
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setCertificateData(parsedData);
        generateCompleteCertificate(parsedData);
      } else {
        const allKeys = Object.keys(localStorage);
        const certificateKeys = allKeys.filter(key => key.startsWith('certificate_'));
        setError(`Certificate data not found for ID: ${documentId}. Please return to the original page and try again.`);
      }
    } catch (err) {
      setError("Error retrieving certificate data: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  const generateCompleteCertificate = async (data) => {
    try {
      const { product, certificateNo, jobNo } = data;
      const doc = new jsPDF();
      await generateFirstPage(doc, product, certificateNo);
      doc.addPage();
      generateCalibrationResults(doc, product, certificateNo, jobNo);
      doc.save(`Complete_Calibration_Certificate_${certificateNo.replace(/\//g, '_')}.pdf`);
    } catch (error) {
      setError("Failed to generate complete certificate: " + error.message);
    }
  };

  const generateFirstPage = async (doc, product, certificateNo) => {
    try {
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
      
      let customerAddress = "Unknown Address";
      if (product._parentForm && product._parentForm.address) {
        customerAddress = product._parentForm.address;
      } else if (product.address) {
        customerAddress = product.address;
      } else if (product.customerAddress) {
        customerAddress = product.customerAddress;
      }
      
      const srfNo = product._parentForm && product._parentForm.srfNo 
                   ? product._parentForm.srfNo 
                   : "Unknown SRF";
      
      const productName = product.instrumentDescription || product.name || product.description || "Unknown Product";
      const productMake = product.make || "Unknown Make";
      const serialNo = product.serialNo || "N/A";
      
      let methodUsed = "ED/SOP/E-002";
      if (product.parameters && product.parameters.length > 0 && product.parameters[0].methodUsed) {
        methodUsed = product.parameters[0].methodUsed.split(" - ")[0];
      }
      
      const formatRange = (rangeValue) => {
        if (!rangeValue) return "Full Range";
        
        // If the range already includes a unit, leave it as is
        if (/[a-zA-Z]/.test(rangeValue)) {
          return rangeValue;
        }
        
        // Otherwise, append "kV" as the unit
        return `${rangeValue} kV`;
      };
      
      const range = product.parameters && product.parameters.length > 0 ? 
                   formatRange(product.parameters[0].ranges || "Full Range") : "Full Range";
      
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
      
      const temperature = product.roomTemp || "25±4°C";
      const humidity = product.humidity ? `${product.humidity}%` : "30 to 75% RH";
      
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      
      doc.setFillColor(240, 248, 255);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Add greenish background at the top
      doc.setFillColor(140, 205, 162); // #8CCDA2
      doc.rect(0, 0, pageWidth, 22, 'F');
      
      // Add matching greenish background to the bottom of the page - increased height from 15 to 20
      doc.setFillColor(140, 205, 162); // #8CCDA2
      doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
      
      // Add office contact information at the bottom in pink color with increased font size
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5); // Increased from 7 to 8.5
      doc.setTextColor(187, 107, 158); // Same pink color as accreditation text
      doc.text("Office: 53/2, Haridevpur Road, Kolkata - 700 082, West Bengal, India", pageWidth / 2, pageHeight - 13, { align: "center" });
      doc.text("Mobile: 9830532452, E-mail: errordetector268@gmail.com / errordetector268@yahoo.com / calibrationerror94@gmail.com", pageWidth / 2, pageHeight - 7, { align: "center" });
      
      // Add D.png to the top left corner
      try {
        // Add company logo in the top left corner
        const dImg = new Image();
        dImg.src = '/Dupdated.png'; // Changed from D.png to Dupdated.png
        doc.addImage(dImg, 'PNG', 10, 5, 25, 15);
      } catch (imgError) {
        console.error("Error adding D logo:", imgError);
      }
      
      // Add the logo images in the top right corner with ilac-mra first
      try {
        // Load and place the first image (ilac-mra.png) on the left
        const ilacImg = new Image();
        ilacImg.src = '/ilac-mra.png'; // Adjust path as needed based on your project structure
        doc.addImage(ilacImg, 'PNG', pageWidth - 60, 5, 25, 15);
        
        // Load and place the second image (cc.png) on the right
        const ccImg = new Image();
        ccImg.src = '/cc.png'; // Adjust path as needed based on your project structure
        doc.addImage(ccImg, 'PNG', pageWidth - 30, 5, 25, 15);
      } catch (imgError) {
        console.error("Error adding logo images:", imgError);
      }
      
      // Add company name and accreditation text above the main heading
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 102, 204);
      doc.setFontSize(14); // Increased from 12 to 14
      doc.text("ERROR DETECTOR", pageWidth / 2, 10, { align: "center" });
      
      // Draw blue border around the accreditation text
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      const accreditationText = "An ISO/IEC 17025:2017 Accredited Calibration Lab by NABL";
      const textWidth = doc.getStringUnitWidth(accreditationText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      
      // Adjust positioning to move box to the left
      const boxX = pageWidth/2 - 15 - textWidth/2 - 3; // Added -15 to move it left
      const boxY = 12;
      const boxWidth = textWidth + 6; // 3px padding on each side
      const boxHeight = 6; // Adjust height as needed
      
      // Draw the border (blue rectangle)
      doc.setDrawColor(0, 102, 204); // Blue border color
      doc.setLineWidth(0.5);
      doc.rect(boxX, boxY, boxWidth, boxHeight);
      
      // Add the text inside the border - use the same adjusted position with the specific color
      doc.setTextColor(187, 107, 158); // Set the specific color #BB6B9E
      doc.text(accreditationText, pageWidth/2 - 15, 15, { align: "center" }); // Added -15 to move it left
      
      // Reset to black for other text
      doc.setTextColor(0, 0, 0);
      
      // Main heading with slightly larger spacing below the accreditation text
      doc.setFont("helvetica", "normal"); // Changed from bold to normal
      doc.setFontSize(14); // Reduced from 16 to 14
      doc.text("CALIBRATION CERTIFICATE", pageWidth / 2, 26, { align: "center" });
      
      doc.setFontSize(10);
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(25, 118, 210);
      doc.text("Calibration Certificate No.", 20, 35); // Moved down from 25 to 35
      doc.setTextColor(0, 0, 0);
      doc.text(":", 80, 35); // Moved down from 25 to 35
      doc.setFont("helvetica", "normal");
      doc.text(certificateNo, 85, 35); // Moved down from 25 to 35
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(25, 118, 210);
      doc.text("Date of Issue", 140, 35); // Moved down from 25 to 35
      doc.setTextColor(0, 0, 0);
      doc.text(":", 165, 35); // Moved down from 25 to 35
      doc.setFont("helvetica", "normal");
      doc.text(issueDate, 170, 35); // Moved down from 25 to 35
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(25, 118, 210);
      doc.text("Service Request Form No", 20, 40); // Moved down from 30 to 40
      doc.setTextColor(0, 0, 0);
      doc.text(":", 80, 40); // Moved down from 30 to 40
      doc.setFont("helvetica", "normal");
      doc.text(srfNo, 85, 40); // Moved down from 30 to 40
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(25, 118, 210);
      doc.text("Page", 140, 40); // Moved down from 30 to 40
      doc.setTextColor(0, 0, 0);
      doc.text(":", 165, 40); // Moved down from 30 to 40
      doc.setFont("helvetica", "normal");
      doc.text("01 of 02 pages", 170, 40); // Moved down from 30 to 40
      
      doc.setTextColor(0, 0, 0);
      const currentYear = new Date().getFullYear().toString().slice(-2);
      doc.text(`ULR-CC3731${currentYear}000000502F`, 20, 45); // Moved down from 35 to 45
      
      let y = 55; // Increased starting position from 45 to 55
      const leftMargin = 20;
      const indentedMargin = leftMargin + 5;
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("1.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Certificate Issued to", leftMargin + 5, y);
      doc.text(":", 80, y);
      doc.setFont("helvetica", "normal");
      doc.text(`M/s. ${customerName}`, 85, y);
      
      const addressLines = customerAddress.split(',');
      if (addressLines.length > 1) {
        y += 4;
        doc.text(addressLines[0], 85, y);
        
        for (let i = 1; i < addressLines.length; i++) {
          y += 4;
          doc.text(addressLines[i].trim(), 85, y);
        }
      } else {
        y += 4;
        doc.text(customerAddress, 85, y);
      }
      
      y += 10; // Increased spacing
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("2.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Description &", leftMargin + 5, y);
      y += 4;
      doc.text("Identification of the item", leftMargin + 5, y);
      y += 4;
      doc.text("to be calibrated", leftMargin + 5, y);
      
      y += 6; // Reduced from 10 to 6
      doc.setTextColor(0, 128, 128);
      doc.text("i)", indentedMargin, y);
      doc.text("Item", indentedMargin + 10, y);
      doc.setTextColor(0, 0, 0);
      doc.text(":", 80, y);
      doc.setFont("helvetica", "normal");
      doc.text(productName, 85, y);
      
      y += 4; // Maintained at 4
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 128, 128);
      doc.text("ii)", indentedMargin, y);
      doc.text("Make", indentedMargin + 10, y);
      doc.setTextColor(0, 0, 0);
      doc.text(":", 80, y);
      doc.setFont("helvetica", "normal");
      doc.text(productMake, 85, y);
      
      y += 4; // Maintained at 4
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 128, 128);
      doc.text("iii)", indentedMargin, y);
      doc.text("Sl no.", indentedMargin + 10, y);
      doc.setTextColor(0, 0, 0);
      doc.text(":", 80, y);
      doc.setFont("helvetica", "normal");
      doc.text(serialNo, 85, y);
      
      y += 4; // Maintained at 4
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 128, 128);
      doc.text("iv)", indentedMargin, y);
      doc.text("Range", indentedMargin + 10, y);
      doc.setTextColor(0, 0, 0);
      doc.text(":", 80, y);
      doc.setFont("helvetica", "normal");
      doc.text(range, 85, y);
      
      let condition = "Satisfactory";
      if (product._parentForm && product._parentForm.condition) {
        condition = product._parentForm.condition;
      } else if (product.condition) {
        condition = product.condition;
      } else if (product.itemCondition) {
        condition = product.itemCondition;
      }
      
      y += 10; // Increased spacing
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("3.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Condition of the item", leftMargin + 5, y);
      doc.text(":", 80, y);
      doc.setFont("helvetica", "normal");
      doc.text(condition, 85, y);
      
      y += 8; // Reduced from 10 to 8
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("4.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Date of Item Received", leftMargin + 5, y);
      doc.text(":", 80, y);
      doc.setFont("helvetica", "normal");
      doc.text(receivedDate, 85, y);
      
      y += 8; // Reduced from 10 to 8
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("5.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Date of Completion of Calibration", leftMargin + 5, y);
      doc.text(":", 85, y);
      doc.setFont("helvetica", "normal");
      doc.text(completionDate, 90, y);
      
      y += 8; // Reduced from 10 to 8
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("6.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Next Calibration Recommended on", leftMargin + 5, y);
      doc.text(":", 85, y);
      doc.setFont("helvetica", "normal");
      doc.text(nextCalibrationDate, 90, y);
      
      let location = "At Laboratory";
      if (product.calibrationFacilityAvailable) {
        location = product.calibrationFacilityAvailable;
      } else if (product.location) {
        location = product.location;
      } else if (product._parentForm && product._parentForm.calibrationLocation) {
        location = product._parentForm.calibrationLocation;
      }
      
      y += 8; // Reduced from 10 to 8
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("7.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Location where Calibration Performed", leftMargin + 5, y);
      doc.text(":", 90, y);
      doc.setFont("helvetica", "normal");
      doc.text(location, 95, y);
      
      y += 8; // Reduced from 10 to 8
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("8.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Environmental Condition during Calibration", leftMargin + 5, y);
      doc.text(":", 100, y);
      doc.setFont("helvetica", "normal");
      doc.text(`Temp: ${temperature}`, 105, y);
      doc.text(`Humidity: ${humidity}`, 145, y);
      
      y += 8; // Reduced from 10 to 8
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("9.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Calibration Method Used", leftMargin + 5, y);
      doc.text(":", 85, y);
      doc.setFont("helvetica", "normal");
      doc.text(`As per our SOP No: ${methodUsed}`, 90, y);
      
      y += 10; // Slight increase before the reference standards section
      
      const referenceStandards = [];
      
      if (product.referenceStandards && product.referenceStandards.length > 0) {
        referenceStandards.push(...product.referenceStandards);
      } else if (product.parameters && 
                 product.parameters.length > 0 && 
                 product.parameters[0].referenceStandards) {
        referenceStandards.push(...product.parameters[0].referenceStandards);
      } else if (product._parentForm && 
                 product._parentForm.referenceStandards && 
                 product._parentForm.referenceStandards.length > 0) {
        referenceStandards.push(...product._parentForm.referenceStandards);
      } else if (product.calibrationDataSheet && 
                 product.calibrationDataSheet.referenceStandards) {
        referenceStandards.push(...product.calibrationDataSheet.referenceStandards);
      } else {
        // Create a reference standard entry using the product details
        referenceStandards.push({
          description: product.instrumentDescription || product.name || "Measurement Instrument",
          makeModel: product.make || "Unknown Make",
          slNoIdNo: product.serialNo || "N/A",
          calibrationCertificateNo: product.calibrationCertificateNo || 
                                    `ED/CAL/${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}/${
                                      new Date().getFullYear()
                                    }`,
          validUpTo: formatDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1))),
          calibratedBy: "Error Detector",
          traceableTo: "National Standards"
        });
      }
      
      doc.autoTable({
        startY: y,
        head: [['SI no', 'Description', 'Make/Model', 'Slno/Idno', 'Calibration Certificate No', 'Valid up to', 'Calibrated By', 'Traceable to']],
        body: referenceStandards.map((ref, index) => [
          `${index + 1}.`,
          ref.description || "N/A",
          ref.makeModel || "N/A",
          ref.slNoIdNo || "N/A",
          ref.calibrationCertificateNo || "N/A",
          ref.validUpTo || "N/A",
          ref.calibratedBy || "N/A",
          ref.traceableTo || "N/A"
        ]),
        theme: 'grid',
        styles: { 
          fontSize: 7,
          cellPadding: 1,
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
      
      let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : y + 40; // Increased spacing
      
      if (finalY > pageHeight - 30) {
        doc.addPage();
        finalY = 20;
      }
      
      // Position the signature on the right side of the page
      const signatureX = pageWidth - 60; // Positioning signature from right side
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("Authorised by", signatureX, finalY);
      
      finalY += 7; // Reduced from 15 to 7
      doc.setTextColor(25, 25, 112);
      doc.text("(P.R.SINGHA)", signatureX, finalY);
      
      finalY += 5; // Reduced from 10 to 5
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text("(Technical Manager)", signatureX, finalY);
      
      // For calibration results page, also add QR code if available from previous page
      if (product.qrCodeDataUrl) {
        try {
          // Position it above the green footer - adjusted for new green region height
          doc.addImage(product.qrCodeDataUrl, 'PNG', 20, pageHeight - 60, 30, 30);
          doc.setFontSize(8);
          doc.setTextColor(0, 0, 0);
          doc.text("Scan this QR code to view the complete calibration certificate", 55, pageHeight - 45);
        } catch (qrError) {
          console.error("Error adding QR code to certificate page:", qrError);
        }
      }
      
      return doc;
    } catch (error) {
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
