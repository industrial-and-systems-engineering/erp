import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function generatePdf(selectedProduct, returnDoc = false, customCertificateNo = null) {
  try {
    console.log("generatePdf function called");
    
    if (!selectedProduct) {
      console.error("No product selected");
      return null;
    }
    
    console.log("Full selected product object:", JSON.stringify(selectedProduct, null, 2));
    
    let customerName = "Unknown Customer";
    if (selectedProduct._parentForm && selectedProduct._parentForm.organization) {
      customerName = selectedProduct._parentForm.organization;
      console.log("Using organization from parent form:", customerName);
    } else if (selectedProduct.organization) {
      customerName = selectedProduct.organization;
      console.log("Using organization from product:", customerName);
    } else if (selectedProduct.customerName) {
      customerName = selectedProduct.customerName;
      console.log("Using customerName as fallback:", customerName);
    } else if (selectedProduct.customer) {
      customerName = selectedProduct.customer;
      console.log("Using customer as fallback:", customerName);
    }
    
    let customerAddress = "Unknown Address";
    if (selectedProduct._parentForm && selectedProduct._parentForm.address) {
      customerAddress = selectedProduct._parentForm.address;
      console.log("Using address from parent form:", customerAddress);
    } else if (selectedProduct.address) {
      customerAddress = selectedProduct.address;
      console.log("Using address from product:", customerAddress);
    } else if (selectedProduct.customerAddress) {
      customerAddress = selectedProduct.customerAddress;
      console.log("Using customerAddress as fallback:", customerAddress);
    }
    
    let productName = "Unknown Product";
    if (selectedProduct.instrumentDescription) {
      productName = selectedProduct.instrumentDescription;
      console.log("Using instrumentDescription as product name:", productName);
    } else if (selectedProduct.name) {
      productName = selectedProduct.name;
      console.log("Using name as fallback:", productName);
    } else if (selectedProduct.description) {
      productName = selectedProduct.description;
      console.log("Using description as fallback:", productName);
    }
    
    const productMake = selectedProduct.make || "Unknown Make";
    const serialNo = selectedProduct.serialNo || "N/A";
    
    const srfNo = selectedProduct._parentForm && selectedProduct._parentForm.srfNo 
                  ? selectedProduct._parentForm.srfNo 
                  : "Unknown SRF";
                  
    let methodUsed = "ED/SOP/E-002";
    if (selectedProduct.parameters && selectedProduct.parameters.length > 0 && selectedProduct.parameters[0].methodUsed) {
      methodUsed = selectedProduct.parameters[0].methodUsed.split(" - ")[0];
    }
    
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

    // Function to format range with kV unit if no unit exists
    const formatRange = (rangeValue) => {
      if (!rangeValue) return "Full Range";
      
      // If the range already includes a unit, leave it as is
      if (/[a-zA-Z]/.test(rangeValue)) {
        return rangeValue;
      }
      
      // Otherwise, append "kV" as the unit
      return `${rangeValue} kV`;
    };

    const certificateNo = customCertificateNo || `ED/CAL/${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}/${new Date().getMonth() > 3 ? 
                          `${new Date().getFullYear()}-${new Date().getFullYear() + 1 - 2000}` : 
                          `${new Date().getFullYear() - 1}-${new Date().getFullYear() - 2000}`}`;

    const temperature = selectedProduct.roomTemp || "25±4°C";
    const humidity = selectedProduct.humidity ? `${selectedProduct.humidity}%` : "30 to 75% RH";
    
    console.log("Extracted environmental conditions:", { temperature, humidity });

    let condition = "Satisfactory";
    if (selectedProduct._parentForm && selectedProduct._parentForm.condition) {
      condition = selectedProduct._parentForm.condition;
      console.log("Using condition from parent form:", condition);
    } else if (selectedProduct.condition) {
      condition = selectedProduct.condition;
      console.log("Using condition from product:", condition);
    } else if (selectedProduct.itemCondition) {
      condition = selectedProduct.itemCondition;
      console.log("Using itemCondition as fallback:", condition);
    }

    let location = "At Laboratory";
    if (selectedProduct.calibrationFacilityAvailable) {
      location = selectedProduct.calibrationFacilityAvailable;
      console.log("Using calibrationFacilityAvailable as location:", location);
    } else if (selectedProduct.location) {
      location = selectedProduct.location;
      console.log("Using location from product:", location);
    } else if (selectedProduct._parentForm && selectedProduct._parentForm.calibrationLocation) {
      location = selectedProduct._parentForm.calibrationLocation;
      console.log("Using calibrationLocation from parent form:", location);
    }

    const referenceStandards = [];
    
    if (selectedProduct.referenceStandards && selectedProduct.referenceStandards.length > 0) {
      referenceStandards.push(...selectedProduct.referenceStandards);
      console.log("Using referenceStandards from product:", selectedProduct.referenceStandards);
    } 
    else if (selectedProduct.parameters && 
             selectedProduct.parameters.length > 0 && 
             selectedProduct.parameters[0].referenceStandards) {
      referenceStandards.push(...selectedProduct.parameters[0].referenceStandards);
      console.log("Using referenceStandards from parameters:", selectedProduct.parameters[0].referenceStandards);
    }
    else if (selectedProduct._parentForm && 
             selectedProduct._parentForm.referenceStandards && 
             selectedProduct._parentForm.referenceStandards.length > 0) {
      referenceStandards.push(...selectedProduct._parentForm.referenceStandards);
      console.log("Using referenceStandards from parent form:", selectedProduct._parentForm.referenceStandards);
    } 
    else {
      const referenceStandard = {
        description: selectedProduct.instrumentDescription || selectedProduct.name || "Measurement Instrument",
        makeModel: selectedProduct.make || "Unknown Make",
        slNoIdNo: selectedProduct.serialNo || "N/A",
        calibrationCertificateNo: selectedProduct.calibrationCertificateNo || 
                                  `ED/CAL/${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}/${
                                    new Date().getFullYear()
                                  }`,
        validUpTo: formatDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1))),
        calibratedBy: "Error Detector",
        traceableTo: "National Standards"
      };
      
      referenceStandards.push(referenceStandard);
      console.log("Created reference standard from product details:", referenceStandard);
    }
    
    console.log("Final reference standards data:", referenceStandards);

    const certificate = {
      certificateNo: certificateNo,
      issueDate: formatDate(),
      serviceRequestFormNo: srfNo,
      issuedTo: customerName,
      address: customerAddress,
      description: productName,
      make: productMake,
      serialNo: serialNo,
      range: selectedProduct.parameters && selectedProduct.parameters.length > 0 ? 
             formatRange(selectedProduct.parameters[0].ranges || "Full Range") : "Full Range",
      condition: condition,
      receivedDate: formatDate(selectedProduct._parentForm && selectedProduct._parentForm.date),
      completionDate: formatDate(),
      nextCalibrationDate: formatDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1))),
      location: location,
      temperature: temperature,
      humidity: humidity,
      method: methodUsed,
      referenceStandards: referenceStandards
    };
    
    console.log("Certificate data prepared:", certificate);

    console.log("Creating jsPDF instance");
    const doc = new jsPDF();
    console.log("jsPDF instance created successfully");

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Create a light blue background for the entire page
    doc.setFillColor(240, 248, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Add a greenish background to the top section ending just above the CALIBRATION CERTIFICATE heading
    doc.setFillColor(140, 205, 162); // #8CCDA2
    doc.rect(0, 0, pageWidth, 22, 'F'); // Height ends just before the heading at y=26

    // Add a matching greenish background to the bottom of the page
    doc.setFillColor(140, 205, 162); // #8CCDA2
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');

    // Add office contact information at the bottom in pink color
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(187, 107, 158); // Same pink color as accreditation text
    doc.text("Office: 53/2, Haridevpur Road, Kolkata - 700 082, West Bengal, India", pageWidth / 2, pageHeight - 13, { align: "center" });
    doc.text("Mobile: 9830532452, E-mail: errordetector268@gmail.com / errordetector268@yahoo.com / calibrationerror94@gmail.com", pageWidth / 2, pageHeight - 7, { align: "center" });

    // Add the logo images in the top right corner
    try {
      // Load and place the first image (cc.png)
      const ccImg = new Image();
      ccImg.src = '/cc.png'; // Adjust path as needed based on your project structure
      doc.addImage(ccImg, 'PNG', pageWidth - 60, 5, 25, 15);
      
      // Load and place the second image (ilac-mra.png)
      const ilacImg = new Image();
      ilacImg.src = '/ilac-mra.png'; // Adjust path as needed based on your project structure
      doc.addImage(ilacImg, 'PNG', pageWidth - 30, 5, 25, 15);
    } catch (imgError) {
      console.error("Error adding logo images:", imgError);
    }

    try {
      // Add company logo in the top left corner
      const dImg = new Image();
      dImg.src = '/Dupdated.png'; // Changed from D.png to Dupdated.png
      doc.addImage(dImg, 'PNG', 10, 5, 25, 15);
    } catch (imgError) {
      console.error("Error adding D logo:", imgError);
    }

    // Add company name and title
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 102, 204);
    doc.setFontSize(14);
    doc.text("ERROR DETECTOR", pageWidth / 2, 10, { align: "center" });
    
    // Add accreditation text with border
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    const accreditationText = "An ISO/IEC 17025:2017 Accredited Calibration Lab by NABL";
    const textWidth = doc.getStringUnitWidth(accreditationText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    
    // Position the box to avoid overlap with logos
    const boxX = pageWidth/2 - 15 - textWidth/2 - 3;
    const boxY = 12;
    const boxWidth = textWidth + 6;
    const boxHeight = 6;
    
    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(0.5);
    doc.rect(boxX, boxY, boxWidth, boxHeight);
    
    // Set text color to #BB6B9E (187,107,158) for the accreditation text
    doc.setTextColor(187, 107, 158); // Set specific RGB values for color #BB6B9E
    doc.text(accreditationText, pageWidth/2 - 15, 15, { align: "center" });
    
    // Reset text color back to default
    doc.setTextColor(0, 0, 0);
    
    // Add the CALIBRATION CERTIFICATE heading
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text("CALIBRATION CERTIFICATE", pageWidth / 2, 26, { align: "center" });
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(25, 118, 210);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(25, 118, 210);
    doc.text("Calibration Certificate No.", 20, 35); // Moved down from 30 to 35
    doc.setTextColor(0, 0, 0);
    doc.text(":", 80, 35); // Moved down from 30 to 35
    doc.setFont("helvetica", "normal");
    doc.text(certificate.certificateNo, 85, 35); // Moved down from 30 to 35
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(25, 118, 210);
    doc.text("Date of Issue", 140, 35); // Moved down from 30 to 35
    doc.setTextColor(0, 0, 0);
    doc.text(":", 165, 35); // Moved down from 30 to 35
    doc.setFont("helvetica", "normal");
    doc.text(certificate.issueDate, 170, 35); // Moved down from 30 to 35
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(25, 118, 210);
    doc.text("Service Request Form No", 20, 40); // Moved down from 35 to 40
    doc.setTextColor(0, 0, 0);
    doc.text(":", 80, 40); // Moved down from 35 to 40
    doc.setFont("helvetica", "normal");
    doc.text(certificate.serviceRequestFormNo, 85, 40); // Moved down from 35 to 40
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(25, 118, 210);
    doc.text("Page", 140, 40); // Moved down from 35 to 40
    doc.setTextColor(0, 0, 0);
    doc.text(":", 165, 40); // Moved down from 35 to 40
    doc.setFont("helvetica", "normal");
    doc.text("01 of 02 pages", 170, 40); // Moved down from 35 to 40
    
    doc.setTextColor(0, 0, 0);
    const currentYear = new Date().getFullYear().toString().slice(-2);
    doc.text(`ULR-CC3731${currentYear}000000502F`, 20, 45); // Moved down from 40 to 45
    
    let y = 55; // Increased starting y-position from 50 to 55
    const leftMargin = 20;
    const indentedMargin = leftMargin + 5;
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    doc.text("1.", leftMargin, y);
    doc.setTextColor(0, 0, 0);
    doc.text("Certificate Issued to", leftMargin + 5, y);
    doc.text(":", 80, y);
    doc.setFont("helvetica", "normal");
    doc.text(`M/s. ${certificate.issuedTo}`, 85, y);
    
    const addressLines = certificate.address.split(',');
    if (addressLines.length > 1) {
      y += 5;
      doc.text(addressLines[0], 85, y);
      
      for (let i = 1; i < addressLines.length; i++) {
        y += 5;
        doc.text(addressLines[i].trim(), 85, y);
      }
    } else {
      y += 5;
      doc.text(certificate.address, 85, y);
    }

    y += 8; // Reduced from 12 to 8
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    doc.text("2.", leftMargin, y);
    doc.setTextColor(0, 0, 0);
    doc.text("Description &", leftMargin + 5, y);
    y += 5;
    doc.text("Identification of the item", leftMargin + 5, y);
    y += 5;
    doc.text("to be calibrated", leftMargin + 5, y);
    
    y += 6; // Reduced from 7 to 6
    doc.setTextColor(0, 128, 128);
    doc.text("i)", indentedMargin, y);
    doc.text("Item", indentedMargin + 10, y);
    doc.setTextColor(0, 0, 0);
    doc.text(":", 80, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.description, 85, y);
    
    y += 5; // Maintained at 5
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 128, 128);
    doc.text("ii)", indentedMargin, y);
    doc.text("Make", indentedMargin + 10, y);
    doc.setTextColor(0, 0, 0);
    doc.text(":", 80, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.make, 85, y);
    
    y += 5; // Maintained at 5
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 128, 128);
    doc.text("iii)", indentedMargin, y);
    doc.text("Sl no.", indentedMargin + 10, y);
    doc.setTextColor(0, 0, 0);
    doc.text(":", 80, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.serialNo, 85, y);
    
    y += 5; // Maintained at 5
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 128, 128);
    doc.text("iv)", indentedMargin, y);
    doc.text("Range", indentedMargin + 10, y);
    doc.setTextColor(0, 0, 0);
    doc.text(":", 80, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.range, 85, y);

    y += 8; // Adjusted spacing
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    doc.text("3.", leftMargin, y);
    doc.setTextColor(0, 0, 0);
    doc.text("Condition of the item", leftMargin + 5, y);
    doc.text(":", 80, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.condition, 85, y);

    y += 8; // Reduced from 12 to 8
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    doc.text("4.", leftMargin, y);
    doc.setTextColor(0, 0, 0);
    doc.text("Date of Item Received", leftMargin + 5, y);
    doc.text(":", 80, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.receivedDate, 85, y);

    y += 8; // Reduced from 12 to 8
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    doc.text("5.", leftMargin, y);
    doc.setTextColor(0, 0, 0);
    doc.text("Date of Completion of Calibration", leftMargin + 5, y);
    doc.text(":", 85, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.completionDate, 90, y);

    y += 8; // Reduced from 12 to 8
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    doc.text("6.", leftMargin, y);
    doc.setTextColor(0, 0, 0);
    doc.text("Next Calibration Recommended on", leftMargin + 5, y);
    doc.text(":", 85, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.nextCalibrationDate, 90, y);

    y += 8; // Reduced from 12 to 8
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    doc.text("7.", leftMargin, y);
    doc.setTextColor(0, 0, 0);
    doc.text("Location where Calibration Performed", leftMargin + 5, y);
    doc.text(":", 90, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.location, 95, y);

    y += 8; // Reduced from 12 to 8
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    doc.text("8.", leftMargin, y);
    doc.setTextColor(0, 0, 0);
    doc.text("Environmental Condition during Calibration", leftMargin + 5, y);
    doc.text(":", 100, y);
    doc.setFont("helvetica", "normal");
    doc.text(`Temp: ${certificate.temperature}`, 105, y);
    doc.text(`Humidity: ${certificate.humidity}`, 135, y);

    y += 8; // Reduced from 12 to 8
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    doc.text("9.", leftMargin, y);
    doc.setTextColor(0, 0, 0);
    doc.text("Calibration Method Used", leftMargin + 5, y);
    doc.text(":", 85, y);
    doc.setFont("helvetica", "normal");
    doc.text(`As per our SOP No: ${certificate.method}`, 90, y);

    y += 10; // Slight increase before the reference standards section
    
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
      body: certificate.referenceStandards.map((ref, index) => [
        `${index + 1}.`,
        ref.description,
        ref.makeModel,
        ref.slNoIdNo,
        ref.calibrationCertificateNo,
        ref.validUpTo,
        ref.calibratedBy,
        ref.traceableTo
      ]),
      theme: 'grid',
      styles: { 
        fontSize: 8,
        cellPadding: 2,
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

    let finalY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 20 : y + 40; // Increased from +15 to +20
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    
    const rightMargin = pageWidth - 50;
    doc.text("Authorised by", rightMargin, finalY);
    
    finalY += 7; // Reduced from 15 to 7
    doc.setTextColor(25, 25, 112);
    doc.text("(P.R.SINGHA)", rightMargin, finalY);
    
    finalY += 5; // Reduced from 10 to 5
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("(Technical Manager)", rightMargin, finalY);

    if (returnDoc) {
      console.log("Returning PDF document for further processing");
      return doc;
    }

    console.log("Attempting to save PDF");
    doc.save(`Calibration_Certificate_${certificate.certificateNo.replace(/\//g, '_')}.pdf`);
    console.log("PDF saved successfully");
    return true;
    
  } catch (error) {
    console.error("Error generating PDF:", error);
    return null;
  }
}

export function addQrCodeToPdf(doc, qrCodeDataUrl, text) {
  try {
    if (!doc) {
      console.error("No PDF document provided");
      return null;
    }
    
    if (!qrCodeDataUrl) {
      console.error("No QR code data URL provided");
      return doc;
    }
    
    console.log("Adding QR code to PDF");
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    const qrSize = 30;
    const qrX = 20;
    // Position QR code higher to avoid overlap with the green bottom region
    const qrY = pageHeight - qrSize - 20; // Changed from 10 to 25
    
    console.log("QR code dimensions:", {
      pageWidth,
      pageHeight,
      qrX,
      qrY,
      qrSize
    });
    
    doc.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
    
    if (text) {
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.text(text, qrX + qrSize + 5, qrY + qrSize/2);
    }
    
    console.log("QR code added successfully");
    return doc;
  } catch (error) {
    console.error("Error adding QR code to PDF:", error);
    return doc;
  }
}

export function generateCalibrationResults(doc, product, certificateNo, jobNo) {
  try {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    
    // Create a light blue background for the entire page
    doc.setFillColor(240, 248, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Add a greenish background to the top section ending just above the CALIBRATION RESULTS heading
    doc.setFillColor(140, 205, 162); // #8CCDA2
    doc.rect(0, 0, pageWidth, 22, 'F'); // Height ends just before the heading
    
    // Add a matching greenish background to the bottom of the page
    doc.setFillColor(140, 205, 162); // #8CCDA2
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    
    // Add the logo images in the top right corner
    try {
      // Load and place the first image (cc.png)
      const ccImg = new Image();
      ccImg.src = '/cc.png'; // Adjust path as needed based on your project structure
      doc.addImage(ccImg, 'PNG', pageWidth - 60, 5, 25, 15);
      
      // Load and place the second image (ilac-mra.png)
      const ilacImg = new Image();
      ilacImg.src = '/ilac-mra.png'; // Adjust path as needed based on your project structure
      doc.addImage(ilacImg, 'PNG', pageWidth - 30, 5, 25, 15);
    } catch (imgError) {
      console.error("Error adding logo images:", imgError);
    }
    
    try {
      // Add company logo in the top left corner
      const dImg = new Image();
      dImg.src = '/Dupdated.png'; // Changed from D.png to Dupdated.png
      doc.addImage(dImg, 'PNG', 10, 5, 25, 15);
    } catch (imgError) {
      console.error("Error adding D logo:", imgError);
    }

    // Add company name and header
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 102, 204);
    doc.setFontSize(14);
    doc.text("ERROR DETECTOR", pageWidth / 2, 10, { align: "center" });
    
    // Add accreditation text with border
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    const accreditationText = "An ISO/IEC 17025:2017 Accredited Calibration Lab by NABL";
    const textWidth = doc.getStringUnitWidth(accreditationText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    
    // Position the box to avoid overlap with logos
    const boxX = pageWidth/2 - 15 - textWidth/2 - 3;
    const boxY = 12;
    const boxWidth = textWidth + 6;
    const boxHeight = 6;
    
    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(0.5);
    doc.rect(boxX, boxY, boxWidth, boxHeight);
    
    // Set text color to #BB6B9E (187,107,158) for the accreditation text
    doc.setTextColor(187, 107, 158); // Set specific RGB values for color #BB6B9E
    doc.text(accreditationText, pageWidth/2 - 15, 15, { align: "center" });
    
    // Reset text color back to default black
    doc.setTextColor(0, 0, 0);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 102, 204);
    doc.setFontSize(16);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`Calibration Certificate No. : ${certificateNo}`, margin, 30);
    doc.text(`Job No: ${jobNo}`, margin, 35);
    const currentYear = new Date().getFullYear().toString().slice(-2);
    doc.text(`ULR-CC3731${currentYear}000000502F`, margin, 40);
    
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`;
    
    doc.text(`Date of Issue: ${formattedDate}`, margin + 100, 30);
    doc.text(`Meter Serial no: ${product.serialNo || "N/A"}`, margin + 100, 35);
    doc.text("Page: 02 of 02 Pages", margin + 100, 40);
    
    doc.setFontSize(14);
    doc.text("CALIBRATION RESULTS", pageWidth / 2, 65, { align: "center" }); // Moved down
    
    let tableData = [];
    
    let parameterDetails = "N/A";
    let rangeDetails = "N/A";
    
    // Format range with kV unit if not already present
    const formatRange = (rangeValue) => {
      if (!rangeValue) return "Full Range";
      
      // If the range already includes a unit, leave it as is
      if (/[a-zA-Z]/.test(rangeValue)) {
        return rangeValue;
      }
      
      // Otherwise, append "kV" as the unit
      return `${rangeValue} kV`;
    };
    
    if (product.parameters && product.parameters.length > 0) {
      const parameter = product.parameters[0];
      parameterDetails = parameter.parameter || "DC high resistance @1000 Volt";
      rangeDetails = formatRange(parameter.ranges || "Full Range");
      
      if (parameter.readings && parameter.readings.length > 0) {
        tableData = parameter.readings.map((reading, index) => {
          const ducValue = `${reading.rName || "N/A"} ${reading.rUnit || ""}`.trim();
          
          const stdValue = `${reading.mean || "N/A"} ${reading.rUnit || ""}`.trim();
          
          const uncertainty = reading.uc ? `${reading.uc}%` : "N/A";
          
          if (index === 0) {
            return [
              "1.", 
              parameterDetails, 
              ducValue, 
              stdValue, 
              uncertainty
            ];
          }
          
          return [
            `${index + 1}.`, 
            "", 
            ducValue, 
            stdValue, 
            uncertainty
          ];
        });
        
        if (tableData.length === 0) {
          tableData.push([
            "1.", 
            parameterDetails, 
            "N/A", 
            "N/A", 
            "N/A"
          ]);
        }
      } else {
        tableData.push([
          "1.", 
          parameterDetails, 
          "N/A", 
          "N/A", 
          "N/A"
        ]);
      }
    } else {
      console.warn("No calibration parameters found in product data, using default values");
      tableData = [
        ["1.", "DC high resistance @1000 Volt", "1 M.ohm", "1.0045 M.ohm", "5.75%"],
        ["2.", "Range: 1000 M.ohm", "2 M.ohm", "2.0085 M.ohm", "14.37%"],
        ["3.", "", "5 M.ohm", "5.0156 M.ohm", "11.51%"],
        ["4.", "", "10 M.ohm", "10.0179 M.ohm", "5.71%"],
        ["5.", "", "20 M.ohm", "20.0546 M.ohm", "14.39%"],
        ["6.", "", "50 M.ohm", "48.0469 M.ohm", "12.02%"],
        ["7.", "", "100 M.ohm", "95.1580 M.ohm", "6.07%"],
        ["8.", "", "200 M.ohm", "195.2565 M.ohm", "14.78%"],
        ["9.", "", "500 M.ohm", "505.1733 M.ohm", "11.67%"],
        ["10.", "", "1000 M.ohm", "1003.083 M.ohm", "6.22%"],
      ];
    }
    
    console.log("Calibration results table data:", tableData);
    
    doc.autoTable({
      startY: 55,
      head: [["Sl.No.", "Parameter, range and Least count", "*DUC Value set at", "Standard value applied to reach *DUC value", "(±) Measurement uncertainty At 95% **C.L where k=2"]],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [144, 238, 144],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      },
      bodyStyles: {
        fillColor: [240, 255, 240]
      },
      styles: { fontSize: 8 }
    });
    
    let tableEndY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 200;
    
    doc.setFontSize(8);
    doc.text("*DUC: Device Under Calibration, **C.L: Confidence Level", margin, tableEndY);
    
    tableEndY += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("REMARKS:", margin, tableEndY);
    doc.setFont("helvetica", "normal");
    doc.text("The above insulation tester has been calibrated over its range and readings are tabulated above.", margin + 20, tableEndY);
    
    tableEndY += 15;
    doc.text("Calibrated by", margin, tableEndY);
    doc.text("Checked by", pageWidth / 2 - 15, tableEndY);
    doc.text("Authorised by", pageWidth - 60, tableEndY);
    
    tableEndY += 7; // Reduced from 20 to 7
    doc.setFont("helvetica", "bold");
    doc.text("Technical Manager", pageWidth - 60, tableEndY);
    
    tableEndY += 15;
    doc.text("Note:", margin, tableEndY);
    
    const notes = [
      "This calibration certificate shall not be reproduced except in full, without written approval of the laboratory.",
      "This calibration certificate refers only to particular item submitted for calibration.",
      "The observations reported represent values at the time of measurements, and under stated conditions only.",
      "All measurements are traceable to National /International Standards.",
      "The reported uncertainty applies only to the measured values and gives no indication of long term stability of device.",
      "The calibration certificate is valid for scientific and industrial purpose only.",
      "Calibration results are reported is \"As Found\" without any adjustment and repair.",
      "Next calibration due date is given as requested by customer.",
      "NABL-133 guidelines are adopted for use of NABL symbol."
    ];
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    
    notes.forEach((note, index) => {
      tableEndY += 7;
      doc.text(`${index + 1}. ${note}`, margin, tableEndY);
    });
    
    tableEndY += 10;
    doc.setFont("helvetica", "bold");
    doc.text("****------END OF CALIBRATION CERTIFICATE-----****", pageWidth / 2, tableEndY, { align: "center" });
    
    // Add office contact information at the bottom in pink color
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(187, 107, 158); // Same pink color as accreditation text
    doc.text("Office: 53/2, Haridevpur Road, Kolkata - 700 082, West Bengal, India", pageWidth / 2, pageHeight - 13, { align: "center" });
    doc.text("Mobile: 9830532452, E-mail: errordetector268@gmail.com / errordetector268@yahoo.com / calibrationerror94@gmail.com", pageWidth / 2, pageHeight - 7, { align: "center" });
    
    return doc;
  } catch (error) {
    console.error("Error generating calibration results:", error);
    return null;
  }
}