import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import generatePdf, { generateCalibrationResults, addWatermark } from './utils/pdfGeneration.js';

const ViewCalibration = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    const fetchAndGenerateCertificate = async () => {
      try {
        setLoading(true);
        const storedData = localStorage.getItem(`certificate_${documentId}`);
        
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setCertificateData(parsedData);
          
          // If this is the first time viewing the certificate via QR code,
          // automatically generate the complete certificate
          if (!parsedData.completeGenerated) {
            setIsGeneratingPdf(true);
            await generateCompleteCertificate(parsedData);
            
            // Update the flag in localStorage
            const updatedData = {
              ...parsedData,
              completeGenerated: true
            };
            localStorage.setItem(`certificate_${documentId}`, JSON.stringify(updatedData));
            setCertificateData(updatedData);
            setIsGeneratingPdf(false);
          }
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
    };

    fetchAndGenerateCertificate();
  }, [documentId]);

  const generateCompleteCertificate = async (data) => {
    try {
      const { product, certificateNo, jobNo } = data;
      console.log(`Using job number ${jobNo} from stored certificate data for consistency`);
      const doc = new jsPDF();
      await generateFirstPage(doc, product, certificateNo, jobNo); // Pass jobNo to first page generation
      doc.addPage();
      generateCalibrationResults(doc, product, certificateNo, jobNo);
      
      // Add watermark to both pages
      try {
        // Add watermark to first page
        doc.setPage(1);
        addWatermark(doc, '/watermarkupd.png');
        
        // Add watermark to second page
        doc.setPage(2);
        addWatermark(doc, '/watermarkupd.png');
      } catch (watermarkError) {
        console.error("Error adding watermark to merged PDF:", watermarkError);
      }
      
      // If we have a QR code data URL, add it to both pages but WITHOUT the text
      if (product.qrCodeDataUrl) {
        // Add to first page
        doc.setPage(1);
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const qrSize = 30;
        doc.addImage(product.qrCodeDataUrl, 'PNG', 20, pageHeight - 60, qrSize, qrSize);
        
        // Add to second page
        doc.setPage(2);
        doc.addImage(product.qrCodeDataUrl, 'PNG', 20, pageHeight - 60, qrSize, qrSize);
      }
      
      doc.save(`Complete_Calibration_Certificate_${certificateNo.replace(/\//g, '_')}.pdf`);
      return true;
    } catch (error) {
      setError("Failed to generate complete certificate: " + error.message);
      return false;
    }
  };

  const generateFirstPage = async (doc, product, certificateNo, jobNo) => { // Add jobNo parameter
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
      
      const formatRange = (rangeValue) => {
        if (!rangeValue) return "Full Range";
        
        // If the range already includes a unit, leave it as is
        if (/[a-zA-Z]/.test(rangeValue)) {
          return rangeValue;
        }
        
        // Otherwise, append "kV" as the unit
        return `${rangeValue} kV`;
      };
      
      // Get the range and add least count beside it
      const rangeValue = product.parameters && product.parameters.length > 0 ? 
                   formatRange(product.parameters[0].ranges || "Full Range") : "Full Range";
      const range = `${rangeValue}, Least count=0.2 kV`;
      
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
      
      // Try to get completion date from technician's calibration data
      let completionDate = null;
      if (product.parameters && product.parameters.length > 0) {
        // Try to find the first parameter with a calibratedDate
        for (const param of product.parameters) {
          if (param.calibratedDate) {
            completionDate = formatDate(param.calibratedDate);
            console.log("Using calibratedDate from parameter:", completionDate);
            break;
          }
        }
      }
      // Fallback to current date if no technician date is found
      if (!completionDate) {
        completionDate = formatDate();
      }
      
      const nextCalibrationDate = formatDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
      
      const temperature = product.roomTemp || "25±4°C";
      const humidity = product.humidity ? `${product.humidity}%` : "30 to 75% RH";
      
      // Make sure temperature has °C symbol
      const formattedTemperature = temperature.includes("°C") ? temperature : 
                                (temperature.includes("±") ? temperature.replace("±", "±") + "°C" : temperature + "°C");
      
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
      
      // Add job number display
      doc.setFont("helvetica", "bold");
      doc.setTextColor(25, 118, 210);
      doc.text("Job No", 20, 40); // Add job number below certificate number
      doc.setTextColor(0, 0, 0);
      doc.text(":", 80, 40); 
      doc.setFont("helvetica", "normal");
      doc.text(jobNo || certificateNo.split('/')[2], 85, 40); // Use provided jobNo or extract from certificate number
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(25, 118, 210);
      doc.text("Date of Issue", 140, 35); // Moved down from 25 to 35
      doc.setTextColor(0, 0, 0);
      doc.text(":", 165, 35); // Moved down from 25 to 35
      doc.setFont("helvetica", "normal");
      doc.text(issueDate, 170, 35); // Moved down from 25 to 35
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(25, 118, 210);
      doc.text("Service Request Form No", 20, 45); // Move down by 5 to make room for job number
      doc.setTextColor(0, 0, 0);
      doc.text(":", 80, 45); 
      doc.setFont("helvetica", "normal");
      doc.text(srfNo, 85, 45); 
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(25, 118, 210);
      doc.text("Page", 140, 45); // Move down by 5 to align with Service Request Form No
      doc.setTextColor(0, 0, 0);
      doc.text(":", 165, 45); 
      doc.setFont("helvetica", "normal");
      doc.text("01 of 02 pages", 170, 45); 
      
      doc.setTextColor(0, 0, 0);
      const currentYear = new Date().getFullYear().toString().slice(-2);
      doc.text(`ULR-CC3731${currentYear}000000502F`, 20, 50); // Move down by 5 to maintain spacing
      
      let y = 60; // Increased starting position from 55 to 60 to account for added job number
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
      
      let condition = "";
      if (product._parentForm && product._parentForm.conditionOfProduct) {
        condition = product._parentForm.conditionOfProduct;
      } else if (product._parentForm && product._parentForm.condition) {
        condition = product._parentForm.condition;
      } else if (product.conditionOfProduct) {
        condition = product.conditionOfProduct;
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
      doc.text("Characterisation and Condition of the item", leftMargin + 5, y);
      y += 5;
      
      // Add characterization
      doc.setTextColor(0, 128, 128);
      doc.text("i)", indentedMargin, y);
      doc.text("Characterisation", indentedMargin + 10, y);
      doc.setTextColor(0, 0, 0);
      doc.text(":", 80, y);
      doc.setFont("helvetica", "normal");
      doc.text("Not Applicable", 85, y);
      
      // Add condition
      y += 5;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 128, 128);
      doc.text("ii)", indentedMargin, y);
      doc.text("Condition", indentedMargin + 10, y);
      doc.setTextColor(0, 0, 0);
      doc.text(":", 80, y);
      doc.setFont("helvetica", "normal");
      doc.text(condition || "Satisfactory", 85, y);  // Use the condition value from CSR or default to "Satisfactory"
      
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

      let location = "";
      // Check for location in various sources with improved priority
      if (product.calibrationDataSheet && product.calibrationDataSheet.Location) {
        location = product.calibrationDataSheet.Location;
      } else if (product._parentForm && product._parentForm.calibrationFacilityAvailable) {
        location = product._parentForm.calibrationFacilityAvailable;
      } else if (product.calibrationFacilityAvailable) {
        location = product.calibrationFacilityAvailable;
      } else if (product.location) {
        location = product.location;
      } else if (product._parentForm && product._parentForm.calibrationLocation) {
        location = product._parentForm.calibrationLocation;
      } else if (product._parentForm && product._parentForm.location) {
        location = product._parentForm.location;
      }
      
      y += 8; // Reduced from 10 to 8
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("7.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Location where Calibration Performed", leftMargin + 5, y);
      doc.text(":", 90, y);
      doc.setFont("helvetica", "normal");
      doc.text(location || "", 95, y);  // Use the location value without hardcoded default
      
      y += 8; // Reduced from 10 to 8
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("8.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Environmental Condition during Calibration", leftMargin + 5, y);
      doc.text(":", 100, y);
      doc.setFont("helvetica", "normal");
      doc.text(`Temp: ${formattedTemperature}`, 105, y);
      doc.text(`Humidity: ${humidity}`, 145, y);
      
      y += 8; // Reduced from 10 to 8
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("9.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Calibration Method Used", leftMargin + 5, y);
      doc.text(":", 85, y);
      doc.setFont("helvetica", "normal");
      
      // Define methodUsed variable to avoid "methodUsed is not defined" error
      let methodUsed = "";
      if (product._parentForm && product._parentForm.calibrationMethodUsed) {
        methodUsed = product._parentForm.calibrationMethodUsed;
      } else if (product.calibrationMethodUsed) {
        methodUsed = product.calibrationMethodUsed;
      } else if (product.parameters && product.parameters.length > 0 && product.parameters[0].methodUsed) {
        methodUsed = product.parameters[0].methodUsed.split(" - ")[0];
      } else {
        methodUsed = "ED/SOP/E-002"; // Default value
      }
      
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
                                    `ED/CAL/${jobNo}/${
                                      new Date().getFullYear()
                                    }`,
          validUpTo: formatDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1))),
          calibratedBy: "Error Detector",
          traceableTo: "National Standards"
        });
      }
      
      // Make sure to process all parameters when constructing the list of parameters
      // This ensures all data is available when generating the second page
      if (product.parameters && product.parameters.length > 0) {
        console.log(`Processing ${product.parameters.length} parameters for calibration results`);
        
        // Make sure each parameter has its readings properly set up
        product.parameters.forEach((param, index) => {
          if (!param.readings) {
            console.log(`Parameter ${index + 1} (${param.parameter || 'Unnamed'}) has no readings, initializing empty array`);
            param.readings = [];
          }
        });
      }
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("10.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Details of Reference Standard used for calibration", leftMargin + 5, y);
      y += 5;
      doc.text("(Traceable to National/International Standards)", leftMargin + 5, y);
      y += 8;
      
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
          // No scan text for the first page in the merged PDF 
        } catch (qrError) {
          console.error("Error adding QR code to certificate page:", qrError);
        }
      }
      
      // Calculate center position for watermark - shifted upward by 20 units
      const watermarkWidth = pageWidth * 0.6;
      const watermarkHeight = watermarkWidth * 0.75;
      const watermarkX = (pageWidth - watermarkWidth) / 2;
      const watermarkY = (pageHeight - watermarkHeight) / 2 - 20; // Shifted upward by 20 units
      
      addWatermark(doc, '/watermarkupd.png');
      
      return doc;
    } catch (error) {
      throw error;
    }
  };

  if (loading || isGeneratingPdf) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-700">
            {isGeneratingPdf ? "Generating your complete certificate..." : "Loading certificate data..."}
          </p>
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
                {certificateData.completeGenerated 
                  ? "The complete calibration certificate has been generated and downloaded automatically." 
                  : "Your complete certificate is being generated now and will download automatically."}
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
                onClick={() => {
                  setIsGeneratingPdf(true);
                  generateCompleteCertificate(certificateData).finally(() => {
                    setIsGeneratingPdf(false);
                  });
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={isGeneratingPdf}
              >
                {isGeneratingPdf ? "Generating..." : "Download Certificate Again"}
              </button>
              
              <button
                onClick={() => navigate('/user/completed')}
                className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                disabled={isGeneratingPdf}
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