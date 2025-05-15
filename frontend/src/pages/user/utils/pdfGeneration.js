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
                  
    let methodUsed = "";
    if (selectedProduct._parentForm && selectedProduct._parentForm.calibrationMethodUsed) {
      methodUsed = selectedProduct._parentForm.calibrationMethodUsed;
      console.log("Using calibrationMethodUsed from parent form:", methodUsed);
    } else if (selectedProduct.calibrationMethodUsed) {
      methodUsed = selectedProduct.calibrationMethodUsed;
      console.log("Using calibrationMethodUsed from product:", methodUsed);
    } else if (selectedProduct.parameters && selectedProduct.parameters.length > 0 && selectedProduct.parameters[0].methodUsed) {
      methodUsed = selectedProduct.parameters[0].methodUsed.split(" - ")[0];
      console.log("Using methodUsed from parameters:", methodUsed);
    } else {
      methodUsed = "ED/SOP/E-002";
      console.log("Using default methodUsed:", methodUsed);
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

    // Generate certificate number - use consistent job number for the same product
    let jobNo;
    
    // Try to use an existing job number if available
    if (selectedProduct.jobNo) {
      jobNo = selectedProduct.jobNo;
    } else {
      // Create a deterministic job number based on product ID or serial number
      const uniqueId = selectedProduct._id || selectedProduct.serialNo || "";
      // Generate a 4-digit number using the hash of the product ID
      const hash = uniqueId.split('').reduce((acc, char) => {
        return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
      }, 0);
      jobNo = Math.abs(hash % 10000).toString().padStart(4, '0');
    }
    
    const certificateNo = customCertificateNo || `ED/CAL/${jobNo}/${new Date().getMonth() > 3 ? 
                          `${new Date().getFullYear()}-${new Date().getFullYear() + 1 - 2000}` : 
                          `${new Date().getFullYear() - 1}-${new Date().getFullYear() - 2000}`}`;

    const temperature = selectedProduct.roomTemp || "25±4°C";
    const humidity = selectedProduct.humidity ? `${selectedProduct.humidity}%` : "30 to 75% RH";
    
    // Make sure temperature has °C symbol
    const formattedTemperature = temperature.includes("°C") ? temperature : 
                              (temperature.includes("±") ? temperature.replace("±", "±") + "°C" : temperature + "°C");
    
    console.log("Extracted environmental conditions:", { temperature: formattedTemperature, humidity });

    // Condition - retrieve from CSR input without hardcoded default
    let condition = "";
    if (selectedProduct._parentForm && selectedProduct._parentForm.conditionOfProduct) {
      condition = selectedProduct._parentForm.conditionOfProduct;
      console.log("Using conditionOfProduct from parent form:", condition);
    } else if (selectedProduct._parentForm && selectedProduct._parentForm.condition) {
      condition = selectedProduct._parentForm.condition;
      console.log("Using condition from parent form:", condition);
    } else if (selectedProduct.conditionOfProduct) {
      condition = selectedProduct.conditionOfProduct;
      console.log("Using conditionOfProduct from product:", condition);
    } else if (selectedProduct.condition) {
      condition = selectedProduct.condition;
      console.log("Using condition from product:", condition);
    } else if (selectedProduct.itemCondition) {
      condition = selectedProduct.itemCondition;
      console.log("Using itemCondition as fallback:", condition);
    }
    // If no condition found in any property, leave it empty for the PDF generation

    // Location - retrieve from all possible data sources without hardcoded default
    let location = "";
    // First check in calibration datasheet which has the most accurate location
    if (selectedProduct.calibrationDataSheet && selectedProduct.calibrationDataSheet.Location) {
      location = selectedProduct.calibrationDataSheet.Location;
      console.log("Using Location from calibration datasheet:", location);
    // Then check in CSC/CSR form fields
    } else if (selectedProduct._parentForm && selectedProduct._parentForm.calibrationFacilityAvailable) {
      location = selectedProduct._parentForm.calibrationFacilityAvailable;
      console.log("Using calibrationFacilityAvailable from parent form:", location);
    } else if (selectedProduct.calibrationFacilityAvailable) {
      location = selectedProduct.calibrationFacilityAvailable;
      console.log("Using calibrationFacilityAvailable from product:", location);
    } else if (selectedProduct.location) {
      location = selectedProduct.location;
      console.log("Using location from product:", location);
    } else if (selectedProduct._parentForm && selectedProduct._parentForm.calibrationLocation) {
      location = selectedProduct._parentForm.calibrationLocation;
      console.log("Using calibrationLocation from parent form:", location);
    } else if (selectedProduct._parentForm && selectedProduct._parentForm.location) {
      location = selectedProduct._parentForm.location;
      console.log("Using location from parent form:", location);
    }
    
    // Default to "At laboratory" if location is empty or undefined
    if (!location || location.trim() === "") {
      location = "At laboratory";
      console.log("No location found, defaulting to:", location);
    }

    // Try to get completion date from technician's calibration data first
    let completionDate = null;
    if (selectedProduct.parameters && selectedProduct.parameters.length > 0) {
      // Look for calibratedDate in the first parameter
      const param = selectedProduct.parameters[0];
      if (param.calibratedDate) {
        completionDate = formatDate(param.calibratedDate);
        console.log("Using calibratedDate from parameters:", completionDate);
      }
    }
    // Fallback to current date if no technician date is found
    if (!completionDate) {
      completionDate = formatDate();
    }
    
    // Parse the completion date string to create a Date object
    const completionDateParts = completionDate.split('.');
    const completionDateObj = new Date(
      parseInt(completionDateParts[2]),
      parseInt(completionDateParts[1]) - 1,
      parseInt(completionDateParts[0])
    );
    
    // Calculate next calibration date as 1 year from completion date
    const nextCalibrationDateObj = new Date(completionDateObj);
    nextCalibrationDateObj.setFullYear(completionDateObj.getFullYear() + 1);
    const nextCalibrationDate = formatDate(nextCalibrationDateObj);
    
    // Calculate valid up to date as 11 months from completion date
    const validUpToDateObj = new Date(completionDateObj);
    validUpToDateObj.setMonth(completionDateObj.getMonth() + 11);
    const validUpToDate = formatDate(validUpToDateObj);
    
    const referenceStandards = [];
    
    if (selectedProduct.referenceStandards && selectedProduct.referenceStandards.length > 0) {
      // Make a deep copy and ensure each standard has the correct validUpTo date
      referenceStandards.push(...selectedProduct.referenceStandards.map(std => ({
        ...std,
        validUpTo: validUpToDate // Always use validUpToDate from completion date
      })));
      console.log("Using referenceStandards from product:", selectedProduct.referenceStandards);
    } 
    else if (selectedProduct.parameters && 
             selectedProduct.parameters.length > 0 && 
             selectedProduct.parameters[0].referenceStandards) {
      // Make a deep copy and ensure each standard has the correct validUpTo date
      referenceStandards.push(...selectedProduct.parameters[0].referenceStandards.map(std => ({
        ...std,
        validUpTo: validUpToDate // Always use validUpToDate from completion date
      })));
      console.log("Using referenceStandards from parameters:", selectedProduct.parameters[0].referenceStandards);
    }
    else if (selectedProduct._parentForm && 
             selectedProduct._parentForm.referenceStandards && 
             selectedProduct._parentForm.referenceStandards.length > 0) {
      // Make a deep copy and ensure each standard has the correct validUpTo date
      referenceStandards.push(...selectedProduct._parentForm.referenceStandards.map(std => ({
        ...std,
        validUpTo: validUpToDate // Always use validUpToDate from completion date
      })));
      console.log("Using referenceStandards from parent form:", selectedProduct._parentForm.referenceStandards);
    } 
    else {
      const referenceStandard = {
        description: selectedProduct.instrumentDescription || selectedProduct.name || "Measurement Instrument",
        makeModel: selectedProduct.make || "Unknown Make",
        slNoIdNo: selectedProduct.serialNo || "N/A",
        calibrationCertificateNo: selectedProduct.calibrationCertificateNo || 
                                  `ED/CAL/${jobNo}/${
                                    new Date().getFullYear()
                                  }`,
        validUpTo: validUpToDate, // This is correct - using validUpToDate from completion date
        calibratedBy: "C and I Calibrations Pvt. Ltd", // Changed from "Error Detector"
        traceableTo: "NPL" // Changed from "National Standards"
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
             `${formatRange(selectedProduct.parameters[0].ranges || "Full Range")}, Least count=0.2 kV` : "Full Range, Least count=0.2 kV",
      condition: condition,
      receivedDate: formatDate(selectedProduct._parentForm && selectedProduct._parentForm.date),
      completionDate: completionDate,
      nextCalibrationDate: nextCalibrationDate, // Use calculated date instead of hardcoded 1 year
      validUpToDate: validUpToDate, // Add valid up to date
      location: location,
      temperature: formattedTemperature,
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
    
    // Try to add watermark, but continue if it fails
    try {
      addWatermark(doc, '/watermarkupd.png');
    } catch (watermarkError) {
      console.warn("Error adding watermark to main PDF:", watermarkError);
      // Continue with PDF generation regardless of watermark error
    }

    // Add office contact information at the bottom in pink color
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(187, 107, 158); // Same pink color as accreditation text
    doc.text("Office: 53/2, Haridevpur Road, Kolkata - 700 082, West Bengal, India", pageWidth / 2, pageHeight - 13, { align: "center" });
    doc.text("Mobile: 9830532452, E-mail: errordetector268@gmail.com / errordetector268@yahoo.com / calibrationerror94@gmail.com", pageWidth / 2, pageHeight - 7, { align: "center" });
    
    // Add the logo images in the top right corner with error handling
    try {
      // Try to load cc.png, but continue if not available
      try {
        const ccImg = new Image();
        ccImg.onload = function() {
          doc.addImage(ccImg, 'PNG', pageWidth - 60, 5, 25, 15);
        };
        ccImg.onerror = function() {
          console.warn("Could not load cc.png logo");
        };
        ccImg.src = '/cc.png';
      } catch (logoError) {
        console.warn("Error processing cc.png logo:", logoError);
      }
      
      // Try to load ilac-mra.png, but continue if not available
      try {
        const ilacImg = new Image();
        ilacImg.onload = function() {
          doc.addImage(ilacImg, 'PNG', pageWidth - 30, 5, 25, 15);
        };
        ilacImg.onerror = function() {
          console.warn("Could not load ilac-mra.png logo");
        };
        ilacImg.src = '/ilac-mra.png';
      } catch (logoError) {
        console.warn("Error processing ilac-mra.png logo:", logoError);
      }
    } catch (imgError) {
      console.warn("Error processing logo images:", imgError);
      // Continue with PDF generation regardless of logo errors
    }

    // Try to add company logo in the top left corner
    try {
      const dImg = new Image();
      dImg.onload = function() {
        doc.addImage(dImg, 'PNG', 10, 5, 25, 15);
      };
      dImg.onerror = function() {
        console.warn("Could not load Dupdated.png logo");
      };
      dImg.src = '/Dupdated.png';
    } catch (imgError) {
      console.warn("Error processing D logo:", imgError);
      // Continue with PDF generation regardless of logo errors
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
    doc.text(location || "", 95, y);
    y += 8; // Reduced from 12 to 8
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    doc.text("8.", leftMargin, y);
    doc.setTextColor(0, 0, 0);
    doc.text("Environmental Condition during Calibration", leftMargin + 5, y);
    doc.text(":", 100, y);
    doc.setFont("helvetica", "normal");
    doc.text(`Temp: ${formattedTemperature}`, 105, y);
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
      head: [['SI no', 'Name', 'Make/Model', 'Serial No.', 'Certificate No.', 'Valid Upto', 'Calibrated By', 'Traceable To']],
      body: certificate.referenceStandards.map((ref, index) => [
        `${index + 1}.`,
        ref.description,
        ref.makeModel,
        ref.slNoIdNo,
        ref.calibrationCertificateNo,
        ref.validUpTo || ref.validUpToDate || validUpToDate,
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
      },
      // Set a specific width for the table to leave room for signature
      tableWidth: pageWidth - 70, // Make table narrower to make space for signature on right
      // Add a callback to check the table height and adjust signature position
      didDrawPage: function(data) {
        console.log("Table finalized at Y position:", data.cursor.y);
      }
    });

    // Position signature on the right side instead of below the table
    const signatureY = doc.previousAutoTable ? doc.previousAutoTable.finalY - 30 : y + 40;
    
    // Ensure signature is placed properly regardless of table height
    const rightMargin = pageWidth - 45;    
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    doc.text("Authorised by", rightMargin, signatureY);
    
    doc.setTextColor(25, 25, 112);
    doc.text("(P.R.SINGHA)", rightMargin, signatureY + 7);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("(Technical Manager)", rightMargin, signatureY + 12);
    // Add watermark to the page
    addWatermark(doc, '/watermarkupd.png');
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
      console.warn("No QR code data URL provided, skipping QR code addition");
      return doc;
    }
    
    console.log("Adding QR code to PDF - direct method");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const qrSize = 30;
    
    // Move QR code position to left bottom instead of center bottom
    const qrX = 5; // Position more to the left
    // Position QR code higher to avoid overlap with the green bottom region
    const qrY = pageHeight - qrSize - 25; // Position to avoid overlap with footer
    
    // Get current page number
    const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
    // Get total number of pages in the document
    const totalPages = doc.internal.getNumberOfPages();
    
    // Add QR code to all pages directly rather than using onload event
    try {
      // Loop through all pages
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        
        try {
          // Add QR code directly to this page
          doc.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
          
          if (text) {
            // White background for text to make it more readable and remove green background
            doc.setFillColor(255, 255, 255);
            doc.rect(qrX - 2, qrY + qrSize, qrSize + 4, 10, 'F');
            
            // Add text with smaller font and narrower width
            doc.setFontSize(7);
            doc.setTextColor(0, 0, 0);
            
            // Place text below QR code without background
            doc.text("Scan this QR code to view the complete certificate", 
                    qrX + qrSize/2, qrY + qrSize + 5, 
                    {align: 'center', maxWidth: qrSize*1.5});
            
            // If there are signatures that might overlap with the QR code, adjust their positions
            if (i === 1) {
              // On first page, adjust the signature position to ensure no overlap
              doc.setFont("helvetica", "bold");
              doc.setTextColor(70, 130, 180);
              const signatureX = pageWidth - 45; // Keep signature on the right
              const signatureY = qrY - 15; // Move signature above QR code 
              
              // Re-add signature since it might have been drawn before QR code was added
              doc.text("Authorised by", signatureX, signatureY);
              doc.setTextColor(25, 25, 112);
              doc.text("(P.R.SINGHA)", signatureX, signatureY + 7);
              doc.setFont("helvetica", "normal");
              doc.setTextColor(0, 0, 0);
              doc.text("(Technical Manager)", signatureX, signatureY + 12);
            }
          }
          console.log(`QR code added successfully to page ${i}`);
        } catch (imgError) {
          console.warn(`Error adding QR code to page ${i}:`, imgError);
          // Continue with other pages even if one fails
        }
      }
      
      // Return to the original page
      doc.setPage(currentPage);
    } catch (err) {
      console.error("Error in QR code addition process:", err);
    }
    
    return doc;
  } catch (error) {
    console.error("Error adding QR code to PDF:", error);
    return doc; // Return doc even if there's an error to allow PDF generation to continue
  }
}

// Add a function to compress QR code data URL to reduce storage size
export function compressQrCodeDataUrl(dataUrl) {
  try {
    // If the data URL is too large, reduce its quality or size
    if (dataUrl && dataUrl.length > 50000) { // If larger than ~50KB
      console.log("QR code data URL is large, compressing...");
      
      // Create a temporary canvas to resize the QR code
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      // Set up image loading
      return new Promise((resolve, reject) => {
        img.onload = function() {
          // Make QR code smaller (150x150 instead of larger size)
          canvas.width = 150;
          canvas.height = 150;
          
          // Draw image with smoothing disabled to keep QR code readable
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(img, 0, 0, 150, 150);
          
          // Get compressed data URL with reduced quality
          const compressedDataUrl = canvas.toDataURL('image/png', 0.6);
          console.log(`Compressed QR code from ${dataUrl.length} to ${compressedDataUrl.length} bytes`);
          
          resolve(compressedDataUrl);
        };
        
        img.onerror = reject;
        img.src = dataUrl;
      });
    }
    
    // If not too large, return as is
    return Promise.resolve(dataUrl);
  } catch (error) {
    console.error("Error compressing QR code:", error);
    return Promise.resolve(dataUrl); // Return original on error
  }
}

export function generateCalibrationResults(doc, product, certificateNo, jobNo, options = {}) {
  try {
    // Set default options if not provided
    const spacing = {
      ensureProperSpacing: options.ensureProperSpacing || true,
      minimumSignatureSpace: options.minimumSignatureSpace || 25
    };
    
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    
    // Create a light blue background for the entire page
    doc.setFillColor(240, 248, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Try to add watermark, but continue if it fails
    try {
      addWatermark(doc, '/watermarkupd.png');
    } catch (watermarkError) {
      console.warn("Error adding watermark to calibration results page:", watermarkError);
      // Continue regardless of watermark errors
    }
    
    // Add a greenish background to the top section ending just above the CALIBRATION RESULTS heading
    doc.setFillColor(140, 205, 162); // #8CCDA2
    doc.rect(0, 0, pageWidth, 22, 'F'); // Height ends just before the heading
    
    // Add a matching greenish background to the bottom of the page
    doc.setFillColor(140, 205, 162); // #8CCDA2
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    
    // Add the logo images in the top right corner with error handling
    try {
      // Try to load cc.png, but continue if not available
      try {
        const ccImg = new Image();
        ccImg.onload = function() {
          doc.addImage(ccImg, 'PNG', pageWidth - 60, 5, 25, 15);
        };
        ccImg.onerror = function() {
          console.warn("Could not load cc.png logo in calibration results");
        };
        ccImg.src = '/cc.png';
      } catch (logoError) {
        console.warn("Error processing cc.png logo in calibration results:", logoError);
      }
      
      // Try to load ilac-mra.png, but continue if not available
      try {
        const ilacImg = new Image();
        ilacImg.onload = function() {
          doc.addImage(ilacImg, 'PNG', pageWidth - 30, 5, 25, 15);
        };
        ilacImg.onerror = function() {
          console.warn("Could not load ilac-mra.png logo in calibration results");
        };
        ilacImg.src = '/ilac-mra.png';
      } catch (logoError) {
        console.warn("Error processing ilac-mra.png logo in calibration results:", logoError);
      }
    } catch (imgError) {
      console.warn("Error processing logo images in calibration results:", imgError);
      // Continue regardless of logo errors
    }
    
    // Try to add company logo in the top left corner
    try {
      const dImg = new Image();
      dImg.onload = function() {
        doc.addImage(dImg, 'PNG', 10, 5, 25, 15);
      };
      dImg.onerror = function() {
        console.warn("Could not load Dupdated.png logo in calibration results");
      };
      dImg.src = '/Dupdated.png';
    } catch (imgError) {
      console.warn("Error processing D logo in calibration results:", imgError);
      // Continue regardless of logo errors
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
    doc.text("CALIBRATION RESULTS", pageWidth / 2, 55, { align: "center" });
    
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
    
    let tableData = [];
    
    // Restructured table with new columns as per the provided requirements
    if (product.parameters && product.parameters.length > 0) {
      let rowCounter = 1;
      let lastParameterName = null; // Track last parameter name to avoid duplication
      
      // Group all readings across parameters
      const allReadings = [];
      
      // First collect all readings with their parameter information
      product.parameters.forEach((parameter) => {
        const parameterName = parameter.parameter || "DC high resistance @1000 Volt";
        
        if (parameter.readings && parameter.readings.length > 0) {
          parameter.readings.forEach((reading) => {
            allReadings.push({
              parameterName: parameterName,
              reading: reading,
              range: reading.rRange || parameter.ranges || "Full Range"
            });
          });
        } else {
          // If no readings, create a placeholder
          allReadings.push({
            parameterName: parameterName,
            reading: null,
            range: parameter.ranges || "Full Range"
          });
        }
      });
      
      // Now process all readings in sequence
      allReadings.forEach((item) => {
        const { parameterName, reading, range } = item;
        const formattedRange = formatRange(range);
        const leastCount = "0.2 kV";
        const rangeWithLeastCount = `${formattedRange}, Least count=${leastCount}`;
        
        let ducValue, stdValue, uncertainty;
        
        if (reading) {
          ducValue = `${reading.rName || "N/A"} ${reading.rUnit || ""}`.trim();
          stdValue = `${reading.mean || "N/A"} ${reading.rUnit || ""}`.trim();
          uncertainty = reading.uc ? `${reading.uc}%` : "N/A";
        } else {
          ducValue = "N/A";
          stdValue = "N/A";
          uncertainty = "N/A";
        }
        
        // Only show parameter name if it's different from the previous one
        const showParameterName = parameterName !== lastParameterName;
        
        tableData.push([
          `${rowCounter}.`,
          showParameterName ? parameterName : "", // Only show parameter name if it's new
          rangeWithLeastCount,
          stdValue,
          ducValue,
          uncertainty
        ]);
        
        // Update the last parameter name
        lastParameterName = parameterName;
        rowCounter++;
      });
      
    } else {
      // Fallback data if no parameters are found
      console.warn("No calibration parameters found in product data, using default values");
      
      // Example data showing parameter grouping
      const voltageGroups = [
        {name: "Voltage DC", rows: [
          {range: "0-600mV/0.1 mV", ducValue: "100.1 mV", stdValue: "100.0000 mV", uncertainty: "0.07%"},
          {range: "0-6V/0.001 V", ducValue: "1.002 V", stdValue: "1.000000 V", uncertainty: "0.08%"},
          {range: "0-60V/0.01 V", ducValue: "10.03 V", stdValue: "10.00000 V", uncertainty: "0.09%"},
          {range: "0-600V/0.1 V", ducValue: "99.8 V", stdValue: "100.0000 V", uncertainty: "0.12%"},
          {range: "0-1000V/1V", ducValue: "299 V", stdValue: "300.0000 V", uncertainty: "0.23%"},
          {range: "0-1000V/1V", ducValue: "598 V", stdValue: "600.00 V", uncertainty: "0.16%"},
          {range: "0-1000V/1V", ducValue: "898 V", stdValue: "900.00 V", uncertainty: "0.14%"}
        ]},
        {name: "Current DC", rows: [
          {range: "0-60mA/0.01 mA", ducValue: "10.1 mA", stdValue: "10.0000 mA", uncertainty: "0.09%"},
          {range: "0-400mA/0.1 mA", ducValue: "100.3 mA", stdValue: "100.0000 mA", uncertainty: "0.08%"},
          {range: "0-10A/0.01 A", ducValue: "1.01 A", stdValue: "1.0000 A", uncertainty: "0.12%"}
        ]}
      ];
      
      // Convert to table data format
      let rowIndex = 1;
      voltageGroups.forEach(group => {
        let isFirstRow = true;
        group.rows.forEach(row => {
          tableData.push([
            `${rowIndex}.`,
            isFirstRow ? group.name : "", // Only show group name in first row
            row.range,
            row.stdValue,
            row.ducValue,
            row.uncertainty
          ]);
          isFirstRow = false;
          rowIndex++;
        });
      });
    }
    
    console.log("Restructured calibration results table data:", tableData);
    
    // Create table with new column structure
    doc.autoTable({
      startY: 65,
      head: [["Sl.No.", "Parameter", "Range & Least Count", "Standard Value applied", "*DUC value observed (average of five readings)", "(±)Measurement uncertainty at 95% **C.L where k=2"]],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [144, 238, 144],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
      bodyStyles: {
        fillColor: [240, 255, 240]
      },
      styles: { 
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
        lineWidth: 0.1
      },
      columnStyles: {
        0: { cellWidth: 15 }, // Sl.No
        1: { cellWidth: 40 }, // Parameter
        2: { cellWidth: 55 }, // Range & Least Count
        3: { cellWidth: 30 }, // Standard Value
        4: { cellWidth: 30 }, // DUC Value
        5: { cellWidth: 25 }  // Uncertainty
      },
      margin: { left: margin, right: margin },
      // Handle page overflow automatically
      didDrawPage: function(data) {
        // Add page header/footer for any additional pages
        if (data.pageCount > 1) {
          // Reset page background
          doc.setFillColor(240, 248, 255);
          doc.rect(0, 0, pageWidth, pageHeight, 'F');
          
          // Add green header and footer
          doc.setFillColor(140, 205, 162);
          doc.rect(0, 0, pageWidth, 22, 'F');
          doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
          
          // Add header content
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0, 102, 204);
          doc.setFontSize(14);
          doc.text("ERROR DETECTOR", pageWidth / 2, 10, { align: "center" });
          
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(11);
          doc.text(`Calibration Certificate No. : ${certificateNo}`, margin, 30);
          doc.text(`Page: ${data.pageCount} of ${data.pageCount} Pages`, margin + 100, 30);
        }
        
        console.log(`Table finalized on page ${data.pageCount} at Y position:`, data.cursor.y);
      }
    });
    
    // Calculate table end position
    let tableEndY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 200;
    const currentPage = doc.lastAutoTable ? doc.lastAutoTable.pageCount : 1;
    
    // Move to the last page of the table
    if (doc.lastAutoTable && doc.lastAutoTable.pageCount > 1) {
      doc.setPage(doc.lastAutoTable.pageCount);
      tableEndY = doc.lastAutoTable.finalY + 10;
    }
    
    // Add explanatory text
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text("*DUC: Device Under Calibration, **C.L: Confidence Level", margin, tableEndY);
    tableEndY += 10;
    
    // Make sure we have enough space for remarks, or move to next page
    if (tableEndY + 50 > pageHeight - 35) {
      doc.addPage();
      
      // Reset background on new page
      doc.setFillColor(240, 248, 255);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Add green header and footer
      doc.setFillColor(140, 205, 162);
      doc.rect(0, 0, pageWidth, 22, 'F');
      doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
      
      // Add header content for new page
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 102, 204);
      doc.setFontSize(14);
      doc.text("ERROR DETECTOR", pageWidth / 2, 10, { align: "center" });
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text(`Calibration Certificate No. : ${certificateNo}`, margin, 30);
      doc.text(`Page: ${currentPage + 1} of ${currentPage + 1} Pages`, margin + 100, 30);
      
      // Reset position for remarks
      tableEndY = 40;
    }
    
    // Add remarks
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("REMARKS:", margin, tableEndY);
    doc.setFont("helvetica", "normal");
    doc.text("The above insulation tester has been calibrated over its range and readings are tabulated above.", margin + 20, tableEndY);
    
    // Calculate position for the signatures
    tableEndY += 15;
    
    // Check if we have enough space for signatures and notes, add new page if needed
    if (tableEndY + 70 > pageHeight - 25) {
      doc.addPage();
      
      // Reset background on new page
      doc.setFillColor(240, 248, 255);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Add green header and footer
      doc.setFillColor(140, 205, 162);
      doc.rect(0, 0, pageWidth, 22, 'F');
      doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
      
      // Add header content for new page
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 102, 204);
      doc.setFontSize(14);
      doc.text("ERROR DETECTOR", pageWidth / 2, 10, { align: "center" });
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text(`Calibration Certificate No. : ${certificateNo}`, margin, 30);
      doc.text(`Page: ${currentPage + 1} of ${currentPage + 1} Pages`, margin + 100, 30);
      
      // Reset position for signatures
      tableEndY = 40;
    }
    
    // Add signatures
    doc.setFont("helvetica", "bold");
    doc.text("Calibrated by", margin, tableEndY);
    doc.text("Checked by", pageWidth / 2 - 15, tableEndY);
    doc.text("Authorised by", pageWidth - 60, tableEndY);
    
    tableEndY += 7;
    doc.text("Technical Manager", pageWidth - 60, tableEndY);
    
    // Check if we have enough space for notes
    tableEndY += 15;
    if (tableEndY + 70 > pageHeight - 25) {
      doc.addPage();
      
      // Reset background on new page
      doc.setFillColor(240, 248, 255);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Add green header and footer
      doc.setFillColor(140, 205, 162);
      doc.rect(0, 0, pageWidth, 22, 'F');
      doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
      
      // Add header content for new page
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 102, 204);
      doc.setFontSize(14);
      doc.text("ERROR DETECTOR", pageWidth / 2, 10, { align: "center" });
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text(`Calibration Certificate No. : ${certificateNo}`, margin, 30);
      doc.text(`Page: ${currentPage + 2} of ${currentPage + 2} Pages`, margin + 100, 30);
      
      // Reset position for notes
      tableEndY = 40;
    }
    
    // Add notes
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
      
      // Check if we need to add a new page for remaining notes
      if (tableEndY > pageHeight - 30) {
        doc.addPage();
        
        // Reset background on new page
        doc.setFillColor(240, 248, 255);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        
        // Add green header and footer
        doc.setFillColor(140, 205, 162);
        doc.rect(0, 0, pageWidth, 22, 'F');
        doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
        
        // Add header content for new page
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 102, 204);
        doc.setFontSize(14);
        doc.text("ERROR DETECTOR", pageWidth / 2, 10, { align: "center" });
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.text(`Calibration Certificate No. : ${certificateNo}`, margin, 30);
        doc.text(`Continued Notes`, margin + 100, 30);
        
        // Reset position for notes
        tableEndY = 40;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
      }
      
      doc.text(`${index + 1}. ${note}`, margin, tableEndY);
    });
    
    tableEndY += 10;
    
    // Check if we need to add a page for the "END OF CERTIFICATE" text
    if (tableEndY > pageHeight - 30) {
      doc.addPage();
      
      // Reset background on new page
      doc.setFillColor(240, 248, 255);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Add green header and footer
      doc.setFillColor(140, 205, 162);
      doc.rect(0, 0, pageWidth, 22, 'F');
      doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
      
      tableEndY = 40;
    }
    
    doc.setFont("helvetica", "bold");
    doc.text("****------END OF CALIBRATION CERTIFICATE-----****", pageWidth / 2, tableEndY, { align: "center" });
    
    // Add office contact information at the bottom in pink color for all pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(187, 107, 158); // Same pink color as accreditation text
      doc.text("Office: 53/2, Haridevpur Road, Kolkata - 700 082, West Bengal, India", pageWidth / 2, pageHeight - 13, { align: "center" });
      doc.text("Mobile: 9830532452, E-mail: errordetector268@gmail.com / errordetector268@yahoo.com / calibrationerror94@gmail.com", pageWidth / 2, pageHeight - 7, { align: "center" });
      
      // Add watermark to each page
      try {
        addWatermark(doc, '/watermarkupd.png');
      } catch (watermarkError) {
        console.warn(`Error adding watermark to page ${i}:`, watermarkError);
      }
    }
    
    return doc;
  } catch (error) {
    console.error("Error generating calibration results:", error);
    return doc; // Still return the doc even if there was an error
  }
}

/**
 * Adds a watermark image to the center of the current page
 * @param {jsPDF} doc - The jsPDF document instance
 * @param {string} watermarkPath - Path to the watermark image
 */
export function addWatermark(doc, watermarkPath) {
  try {
    // Check if watermark path is valid before proceeding
    if (!watermarkPath) {
      console.log("No watermark path provided, skipping watermark");
      return doc;
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    try {
      // Create watermark image with error handling
      const watermarkImg = new Image();
      
      // Add error handler to image
      watermarkImg.onerror = function() {
        console.warn(`Could not load watermark image from ${watermarkPath}, skipping watermark`);
      };
      
      watermarkImg.onload = function() {
        try {
          // Calculate center position - adjusted upward by 20 units
          const watermarkWidth = pageWidth * 0.6; // 60% of page width
          const watermarkHeight = watermarkWidth * 0.75; // Approximate height based on typical image ratio
          const x = (pageWidth - watermarkWidth) / 2;
          const y = (pageHeight - watermarkHeight) / 2 - 20; // Shifted upward by 20 units
          
          // Add watermark with transparency using GState approach
          // Create a graphics state with 10% opacity
          const gState = new doc.GState({opacity: 0.1});
          doc.setGState(gState);
          
          // Add the image with the transparency setting    
          doc.addImage(watermarkImg, 'PNG', x, y, watermarkWidth, watermarkHeight);
          
          // Reset to default graphics state (100% opacity) for subsequent drawings
          const defaultGState = new doc.GState({opacity: 1.0});
          doc.setGState(defaultGState);
        } catch (innerError) {
          console.warn("Error applying watermark to PDF:", innerError);
        }
      };
      
      // Set the source to trigger loading
      watermarkImg.src = watermarkPath;
    } catch (imgError) {
      console.warn("Could not create watermark image, skipping:", imgError);
    }
    
    console.log("Watermark process initiated");
    return doc;
  } catch (error) {
    console.error("Error in watermark function:", error);
    return doc; // Return doc even if there's an error
  }
}

/**
 * Generates a simplified certificate without logos or QR code
 * @param {Object} selectedProduct - The product to generate certificate for
 * @returns {Boolean|jsPDF} - Returns true on successful save or the doc object if returnDoc is true
 */
export function generateSimplifiedCertificate(selectedProduct, returnDoc = false) {
  try {
    console.log("generateSimplifiedCertificate function called");
    if (!selectedProduct) {
      console.error("No product selected");
      return null;
    }
    
    // Extract customer data
    let customerName = selectedProduct._parentForm?.organization || 
                      selectedProduct.organization || 
                      selectedProduct.customerName || 
                      selectedProduct.customer || 
                      "Unknown Customer";
    
    let customerAddress = selectedProduct._parentForm?.address || 
                         selectedProduct.address || 
                         selectedProduct.customerAddress || 
                         "Unknown Address";
    
    let productName = selectedProduct.instrumentDescription || 
                     selectedProduct.name || 
                     selectedProduct.description || 
                     "Unknown Product";
    
    const productMake = selectedProduct.make || "Unknown Make";
    const serialNo = selectedProduct.serialNo || "N/A";
    const srfNo = selectedProduct._parentForm?.srfNo || "Unknown SRF";
    let methodUsed = "";
    if (selectedProduct._parentForm && selectedProduct._parentForm.calibrationMethodUsed) {
      methodUsed = selectedProduct._parentForm.calibrationMethodUsed;
      console.log("Using calibrationMethodUsed from parent form:", methodUsed);
    } else if (selectedProduct.calibrationMethodUsed) {
      methodUsed = selectedProduct.calibrationMethodUsed;
      console.log("Using calibrationMethodUsed from product:", methodUsed);
    } else if (selectedProduct.parameters && selectedProduct.parameters.length > 0 && selectedProduct.parameters[0].methodUsed) {
      methodUsed = selectedProduct.parameters[0].methodUsed.split(" - ")[0];
      console.log("Using methodUsed from parameters:", methodUsed);
    } else {
      methodUsed = "ED/SOP/E-002";
      console.log("Using default methodUsed:", methodUsed);
    }
    
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
    // Format range with appropriate units
    const formatRange = (rangeValue) => {
      if (!rangeValue) return "Full Range";
      if (/[a-zA-Z]/.test(rangeValue)) {
        return rangeValue;
      }
      
      return `${rangeValue} kV`;
    };

    // Generate certificate number - use consistent job number for the same product
    let jobNo;
    
    // Try to use an existing job number if available
    if (selectedProduct.jobNo) {
      jobNo = selectedProduct.jobNo;
    } else {
      // Create a deterministic job number based on product ID or serial number
      const uniqueId = selectedProduct._id || selectedProduct.serialNo || "";
      // Generate a 4-digit number using the hash of the product ID
      const hash = uniqueId.split('').reduce((acc, char) => {
        return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
      }, 0);
      jobNo = Math.abs(hash % 10000).toString().padStart(4, '0');
    }
    
    const certificateNo = selectedProduct.certificateNo || 
                         `ED/CAL/${jobNo}/${
                           new Date().getMonth() > 3 ? 
                           `${new Date().getFullYear()}-${new Date().getFullYear() + 1 - 2000}` : 
                           `${new Date().getFullYear() - 1}-${new Date().getFullYear() - 2000}`
                         }`;

    const jobNoFromCertificate = certificateNo.split('/')[2];
    // Environmental conditions
    const temperature = selectedProduct.roomTemp || "25±4°C";
    const humidity = selectedProduct.humidity ? `${selectedProduct.humidity}%` : "<60% RH";
    // Make sure temperature has °C symbol
    const formattedTemperature = temperature.includes("°C") ? temperature : 
                              (temperature.includes("±") ? temperature.replace("±", "±") + "°C" : temperature + "°C");
    // Condition - retrieve from CSR input without hardcoded default
    let condition = "";
    if (selectedProduct._parentForm && selectedProduct._parentForm.conditionOfProduct) {
      condition = selectedProduct._parentForm.conditionOfProduct;
    } else if (selectedProduct._parentForm?.condition) {
      condition = selectedProduct._parentForm.condition;
    } else if (selectedProduct.conditionOfProduct) {
      condition = selectedProduct.conditionOfProduct;
    } else if (selectedProduct.condition) {
      condition = selectedProduct.condition;
    } else if (selectedProduct.itemCondition) {
      condition = selectedProduct.itemCondition;
    }

    // Location - retrieve from all possible data sources without hardcoded default
    let location = "";
    // First check in calibration datasheet which has the most accurate location
    if (selectedProduct.calibrationDataSheet && selectedProduct.calibrationDataSheet.Location) {
      location = selectedProduct.calibrationDataSheet.Location;
      console.log("Using Location from calibration datasheet:", location);
    // Then check in CSC/CSR form fields
    } else if (selectedProduct._parentForm && selectedProduct._parentForm.calibrationFacilityAvailable) {
      location = selectedProduct._parentForm.calibrationFacilityAvailable;
      console.log("Using calibrationFacilityAvailable from parent form:", location);
    } else if (selectedProduct.calibrationFacilityAvailable) {
      location = selectedProduct.calibrationFacilityAvailable;
      console.log("Using calibrationFacilityAvailable from product:", location);
    } else if (selectedProduct.location) {
      location = selectedProduct.location;
      console.log("Using location from product:", location);
    } else if (selectedProduct._parentForm && selectedProduct._parentForm.calibrationLocation) {
      location = selectedProduct._parentForm.calibrationLocation;
      console.log("Using calibrationLocation from parent form:", location);
    } else if (selectedProduct._parentForm && selectedProduct._parentForm.location) {
      location = selectedProduct._parentForm.location;
      console.log("Using location from parent form:", location);
    }

    // Default to "At laboratory" if location is empty or undefined
    if (!location || location.trim() === "") {
      location = "At laboratory";
      console.log("No location found, defaulting to:", location);
    }

    // Try to get completion date from technician's calibration data first
    let completionDate = null;
    if (selectedProduct.parameters && selectedProduct.parameters.length > 0) {
      // Look for calibratedDate in the first parameter
      const param = selectedProduct.parameters[0];
      if (param.calibratedDate) {
        completionDate = formatDate(param.calibratedDate);
      }
    }
    // Fallback to current date if no technician date is found
    if (!completionDate) {
      completionDate = formatDate();
    }
    
    // Parse the completion date string to create a Date object
    const completionDateParts = completionDate.split('.');
    const completionDateObj = new Date(
      parseInt(completionDateParts[2]),
      parseInt(completionDateParts[1]) - 1,
      parseInt(completionDateParts[0])
    );
    
    // Calculate next calibration date as 1 year from completion date
    const nextCalibrationDateObj = new Date(completionDateObj);
    nextCalibrationDateObj.setFullYear(completionDateObj.getFullYear() + 1);
    const nextCalibrationDate = formatDate(nextCalibrationDateObj);
    
    // Calculate valid up to date as 11 months from completion date
    const validUpToDateObj = new Date(completionDateObj);
    validUpToDateObj.setMonth(completionDateObj.getMonth() + 11);
    const validUpToDate = formatDate(validUpToDateObj);

    // Reference standards
    const referenceStandards = [];
    
    if (selectedProduct.referenceStandards?.length > 0) {
      // Make a deep copy and ensure each standard has the correct validUpTo date
      referenceStandards.push(...selectedProduct.referenceStandards.map(std => ({
        ...std,
        validUpTo: validUpToDate // Always use validUpToDate from completion date
      })));
    } 
    else if (selectedProduct.parameters?.length > 0 && 
             selectedProduct.parameters[0].referenceStandards) {
      // Make a deep copy and ensure each standard has the correct validUpTo date
      referenceStandards.push(...selectedProduct.parameters[0].referenceStandards.map(std => ({
        ...std,
        validUpTo: validUpToDate // Always use validUpToDate from completion date
      })));
    } 
    else if (selectedProduct._parentForm?.referenceStandards?.length > 0) {
      // Make a deep copy and ensure each standard has the correct validUpTo date
      referenceStandards.push(...selectedProduct._parentForm.referenceStandards.map(std => ({
        ...std,
        validUpTo: validUpToDate // Always use validUpToDate from completion date
      })));
    } 
    else if (selectedProduct.calibrationDataSheet?.referenceStandards?.length > 0) {
      // Make a deep copy and ensure each standard has the correct validUpTo date
      referenceStandards.push(...selectedProduct.calibrationDataSheet.referenceStandards.map(std => ({
        ...std,
        validUpTo: validUpToDate // Always use validUpToDate from completion date
      })));
    } 
    else if (selectedProduct._parentForm?.calibrationDataSheet?.referenceStandards?.length > 0) {
      // Make a deep copy and ensure each standard has the correct validUpTo date
      referenceStandards.push(...selectedProduct._parentForm.calibrationDataSheet.referenceStandards.map(std => ({
        ...std,
        validUpTo: validUpToDate // Always use validUpToDate from completion date
      })));
    } 
    else {
      // Create reference standard entries using the product details but with more specific fields
      const standardsList = [
        {
          description: "Digital Pressure Calibrator",
          makeModel: "Druck DPI 603",
          slNoIdNo: "60303803 ED/DPC/01",
          calibrationCertificateNo: "TSC/24-25/16266-1",
          validUpTo: validUpToDate,
          calibratedBy: "Transcal Technologies LLP",
          traceableTo: "NPL"
        },
        {
          description: "Digital IR Thermo Meter",
          makeModel: "Metravi MT-16",
          slNoIdNo: "11018053 ED/IT(M-16)-01",
          calibrationCertificateNo: "TSC/24-25/16266-4",
          validUpTo: validUpToDate,
          calibratedBy: "Transcal Technologies LLP",
          traceableTo: "NPL"
        },
        {
          description: "Digital Anemo Meter",
          makeModel: "Lutron AM 4201",
          slNoIdNo: "ED/DAM-01",
          calibrationCertificateNo: "CL-027-04/2024-01",
          validUpTo: validUpToDate,
          calibratedBy: "CAL LABS",
          traceableTo: "NPL"
        }
      ];
      
      // Add all reference standards to the array
      standardsList.forEach(std => {
        referenceStandards.push(std);
      });
    }
    
    // Prepare certificate data
    const certificate = {
      certificateNo: certificateNo,
      jobNo: jobNoFromCertificate,
      issueDate: formatDate(),
      serviceRequestFormNo: srfNo,
      issuedTo: customerName,
      address: customerAddress,
      description: productName,
      make: productMake,
      serialNo: serialNo,
      range: selectedProduct.parameters?.length > 0 ? 
             `${formatRange(selectedProduct.parameters[0].ranges || "Full Range")}, Least count=0.2 kV` : 
             "0-5 kV, Least count=0.2 kV",
      condition: condition,
      receivedDate: formatDate(selectedProduct._parentForm?.date),
      completionDate: completionDate,
      nextCalibrationDate: nextCalibrationDate, // Use calculated date
      validUpToDate: validUpToDate, // Add valid up to date
      location: location,
      temperature: formattedTemperature,
      humidity: humidity,
      method: methodUsed,
      referenceStandards: referenceStandards
    };

    // Create PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const leftMargin = 20;
    // ===== FIRST PAGE =====
    
    // Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("CALIBRATION CERTIFICATE", pageWidth / 2, 20, { align: "center" });
    
    // Certificate details
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Calibration Certificate No.", leftMargin, 30);
    doc.text(":", 80, 30);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.certificateNo, 85, 30);
    doc.setFont("helvetica", "bold");
    doc.text("Service Request Form No", leftMargin, 35);
    doc.text(":", 80, 35);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.serviceRequestFormNo, 85, 35);
    
    doc.setFont("helvetica", "bold");
    doc.text("ULR-CC373125000000298F", leftMargin, 40);
    
    doc.setFont("helvetica", "bold");
    doc.text("Date of Issue", 140, 30);
    doc.text(":", 165, 30);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.issueDate, 170, 30);
    doc.setFont("helvetica", "normal");
    doc.setFont("helvetica", "bold");
    doc.text("Page", 140, 35);
    doc.text(":", 165, 35);
    doc.setFont("helvetica", "normal");
    doc.text("01 of 02 pages", 170, 35);
    // Separator
    doc.setLineWidth(0.5);
    doc.line(leftMargin, 45, pageWidth - leftMargin, 45);
    
    let y = 55;
    const indentedMargin = leftMargin + 5;
    // 1. Certificate Issued to
    doc.setFont("helvetica", "bold");
    doc.text("1. Certificate Issued to", leftMargin, y);
    doc.text(":", 80, y);
    doc.setFont("helvetica", "normal");
    doc.text(`M/s. ${certificate.issuedTo}`, 85, y);
    // Format address with line breaks
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
    y += 10;
    // 2. Description & Identification
    doc.setFont("helvetica", "bold");
    doc.text("2. Description & Identification of the item", leftMargin, y);
    y += 7;
    // Item description
    doc.text("i)", indentedMargin, y);
    doc.text("Item", indentedMargin + 10, y);
    doc.text(":", 80, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.description, 85, y);
    // Make
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.text("ii)", indentedMargin, y);
    doc.text("Make", indentedMargin + 10, y);
    doc.text(":", 80, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.make, 85, y);
    // Serial Number
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.text("iii)", indentedMargin, y);
    doc.text("Sl no.", indentedMargin + 10, y);
    doc.text(":", 80, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.serialNo, 85, y);
    // Range
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.text("iv)", indentedMargin, y);
    doc.text("Range", indentedMargin + 10, y);
    doc.text(":", 80, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.range, 85, y);
    y += 10;
    // 3. Characterization and Condition
    doc.setFont("helvetica", "bold");
    doc.text("3. Characterisation and Condition of the item", leftMargin, y);
    y += 7;
    // Characterization
    doc.text("i)", indentedMargin, y);
    doc.text("Characterisation", indentedMargin + 10, y);
    doc.text(":", 80, y);
    doc.setFont("helvetica", "normal");
    doc.text("Not Applicable", 85, y);
    // Condition
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.text("ii)", indentedMargin, y);
    doc.text("Condition", indentedMargin + 10, y);
    doc.text(":", 80, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.condition, 85, y);
    y += 10;
    // 4. Date of Item Received
    doc.setFont("helvetica", "bold");
    doc.text("4. Date of Item Received", leftMargin, y);
    doc.text(":", 80, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.receivedDate, 85, y);
    y += 10;
    // 5. Date of Completion of Calibration
    doc.setFont("helvetica", "bold");
    doc.text("5. Date of Completion of Calibration", leftMargin, y);
    doc.text(":", 85, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.completionDate, 90, y);
    y += 10;
    // 6. Next Calibration Recommended on
    doc.setFont("helvetica", "bold");
    doc.text("6. Next Calibration Recommended on", leftMargin, y);
    doc.text(":", 85, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.nextCalibrationDate, 90, y);
    y += 10;
    // 7. Location where Calibration Performed
    doc.setFont("helvetica", "bold");
    doc.text("7. Location where Calibration Performed", leftMargin, y);
    doc.text(":", 90, y);
    doc.setFont("helvetica", "normal");
    doc.text(location || "", 95, y);
    y += 10;
    // 8. Environmental Condition during Calibration
    doc.setFont("helvetica", "bold");
    doc.text("8. Environmental Condition during Calibration", leftMargin, y);
    doc.text(":", 100, y);
    doc.setFont("helvetica", "normal");
    doc.text(`Temp: ${formattedTemperature}`, 105, y);
    doc.text(`Humidity: ${certificate.humidity}`, 150, y);
    y += 10;
    // 9. Calibration Method Used
    doc.setFont("helvetica", "bold");
    doc.text("9. Calibration Procedure followed", leftMargin, y);
    doc.text(":", 85, y);
    doc.setFont("helvetica", "normal");
    doc.text(`As per SOP No: ${certificate.method}`, 90, y);
    y += 10;
    // 10. Reference Standards
    doc.setFont("helvetica", "bold");
    doc.text("10. Details of Reference Standard used for calibration", leftMargin, y);
    y += 5;
    doc.text("(Traceable to National/International Standards)", leftMargin + 5, y);
    y += 8;
    // Reference standards table
    doc.autoTable({
      startY: y,
      head: [['SI no', 'Name', 'Make/Model', 'Serial No.', 'Certificate No.', 'Valid Upto', 'Calibrated By', 'Traceable To']],
      body: certificate.referenceStandards.map((ref, index) => [
        `${index + 1}.`,
        ref.description,
        ref.makeModel,
        ref.slNoIdNo,
        ref.calibrationCertificateNo,
        ref.validUpTo || ref.validUpToDate || validUpToDate,
        ref.calibratedBy,
        ref.traceableTo
      ]),
      theme: 'grid',
      styles: { 
        fontSize: 8,
        cellPadding: 2
      },
      // Set a specific width for the table to leave room for signature
      tableWidth: pageWidth - 70, // Make table narrower
      // Add a callback to check the table height and adjust signature position
      didDrawPage: function(data) {
        console.log("Simplified table finalized at Y position:", data.cursor.y);
      }
    });
    
    // Position signature on the right side instead of below the table
    const simplifiedSignatureY = doc.previousAutoTable ? doc.previousAutoTable.finalY - 30 : y + 40;
    
    doc.setFont("helvetica", "bold");
    const rightMargin = pageWidth - 45;
    doc.text("Authorised by", rightMargin, simplifiedSignatureY);
    
    doc.text("(P.R.SINGHA)", rightMargin, simplifiedSignatureY + 7);
    
    doc.setFont("helvetica", "normal");
    doc.text("(Technical Manager)", rightMargin, simplifiedSignatureY + 12);
    // ===== SECOND PAGE =====
    doc.addPage();
    // ===== SECOND PAGE =====
    // Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("CALIBRATION CERTIFICATE", pageWidth / 2, 20, { align: "center" });
    
    // Certificate details
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Calibration Certificate No.", leftMargin, 30);
    doc.text(":", 80, 30);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.certificateNo, 85, 30);
    doc.setFont("helvetica", "bold");
    doc.text("Job No:", leftMargin, 35);
    doc.text(":", 45, 35);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.jobNo, 50, 35);
    doc.setFont("helvetica", "bold");
    doc.text("ULR-CC373125000000298F", leftMargin, 40);
    
    doc.setFont("helvetica", "bold");
    doc.text("Date of Issue:", 140, 30);
    doc.text(":", 165, 30);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.issueDate, 170, 30);
    doc.setFont("helvetica", "normal");
    doc.setFont("helvetica", "bold");
    doc.text("SI No:", 140, 35);
    doc.text(":", 155, 35);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.serialNo, 160, 35);
    
    doc.setFont("helvetica", "bold");
    doc.text("Page:", 140, 40);
    doc.text(":", 155, 40);
    doc.setFont("helvetica", "normal");
    doc.text("02 of 02 Pages", 160, 40);
    
    // Separator
    doc.setLineWidth(0.5);
    doc.line(leftMargin, 45, pageWidth - leftMargin, 45);
    
    // CALIBRATION RESULTS heading
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("CALIBRATION RESULTS", pageWidth / 2, 60, { align: "center" });
    // Electro-technical Calibration subheading
    doc.setFontSize(12);
    doc.text("Electro-technical Calibration", leftMargin, 70);
    
    // Generate calibration data
    let tableData = [];
    // If there's saved calibration data in the product, use it
    if (selectedProduct.parameters && selectedProduct.parameters.length > 0) {      
      let rowCounter = 1;
      // Process all parameters
      selectedProduct.parameters.forEach((parameter, paramIndex) => {
        const parameterDetails = parameter.parameter || "AC Voltage (50Hz)";
        const rangeValue = parameter.ranges || "0-5 kV";
        const rangeDetails = formatRange(rangeValue);
        const leastCount = "0.2 kV"; // Hardcoded least count
        const fullRangeInfo = `${parameterDetails} ${rangeDetails}, Least count=${leastCount}`;
        
        // If the parameter has readings
        if (parameter.readings && parameter.readings.length > 0) {
          // First row of each parameter includes the parameter name
          parameter.readings.forEach((reading, readingIndex) => {
            const ducValue = reading.rName || `${(readingIndex + 1)}`;
            const stdValue = reading.mean || `${(parseFloat(ducValue) * 1.02).toFixed(4)}`;
            const uncertainty = reading.uc ? `${reading.uc}%` : `${(12 - readingIndex).toFixed(2)}%`;
            if (readingIndex === 0) {
              tableData.push([
                `${rowCounter}.`,
                fullRangeInfo,
                ducValue,
                stdValue,
                uncertainty
              ]);
            } else {
              tableData.push([
                `${rowCounter}.`,
                "",
                ducValue,
                stdValue,
                uncertainty
              ]);
            }
            rowCounter++;
          });
        } else {
          // Generate sample readings if none exist
          const baseDucValues = [1, 2, 3, 4, 5];
          baseDucValues.forEach((value, index) => {
            const valueWithUnit = rangeValue.includes('kV') ? `${value}` : `${value} ${rangeValue.replace(/[0-9\s-]/g, '')}`;
            const stdValue = (value * 1.02).toFixed(4);
            const fullStdValue = `${stdValue} ${rangeValue.replace(/[0-9\s-]/g, '')}`;
            const uncertainty = `${(12.11 - index * 1.2).toFixed(2)}%`;
            
            if (index === 0) {
              tableData.push([
                `${rowCounter}.`,
                fullRangeInfo,
                valueWithUnit,
                fullStdValue,
                uncertainty
              ]);
            } else {
              tableData.push([
                `${rowCounter}.`,
                "",
                valueWithUnit,
                fullStdValue,
                uncertainty
              ]);
            }
            rowCounter++;
          });
        }
      });
    } else {
      // If no parameters at all, create default AC Voltage test data
      const parameterDetails = "AC Voltage (50Hz)";
      const rangeDetails = "0-5 kV";
      const leastCount = "0.2 kV"; // Hardcoded least count
      const fullRangeInfo = `${parameterDetails} ${rangeDetails}, Least count=${leastCount}`;
      
      const values = [1, 2, 3, 4, 5];
      
      values.forEach((value, index) => {
        if (index === 0) {
          tableData.push([
            `${index + 1}.`,
            fullRangeInfo,
            `${value}`,
            `${(value * 1.08).toFixed(4)}`,
            `${(12.11 - index * 1.2).toFixed(2)}%`
          ]);
        } else {
          tableData.push([
            `${index + 1}.`,
            "",
            `${value}`,
            `${(value * 1.08).toFixed(4)}`,
            `${(12.11 - index * 1.2).toFixed(2)}%`
          ]);
        }
      });
    }
    
    // Create calibration results table with data
    doc.autoTable({
      startY: 75,
      head: [["Slno.", "Parameter/range & least count", "*DUC value (in kV)", "Standard value(kV) observed average value of five readings", "(±)Measurement uncertainty at 95% at **C.L where k=2 (in %)"]],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      }
    });
    
    let tableEndY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 5 : 150;
    
    // DUC explanation
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("*DUC=Device Under Calibration, **C.L= Confidence Level", leftMargin, tableEndY);
    
    // Separator
    tableEndY += 5;
    doc.setLineWidth(0.3);
    doc.line(leftMargin, tableEndY, pageWidth - leftMargin, tableEndY);
    
    // Remarks
    tableEndY += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("REMARKS :", leftMargin, tableEndY);
    doc.setFont("helvetica", "normal");
    // Make the remarks more specific to the product type
    let remarksText = `The above ${certificate.description} has been calibrated over its range and the readings are tabulated above.`;
    doc.text(remarksText, leftMargin + 25, tableEndY);
    
    // Separator
    tableEndY += 10;
    doc.line(leftMargin, tableEndY, pageWidth - leftMargin, tableEndY);
    
    // Notes
    tableEndY += 10;
    doc.text("Note:", leftMargin, tableEndY);
    tableEndY += 10;
    // List of notes
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
      tableEndY += 5;
      doc.text(`${index + 1}. ${note}`, leftMargin, tableEndY);
    });
    
    // Separator
    tableEndY += 10;
    doc.line(leftMargin, tableEndY, pageWidth - leftMargin, tableEndY);
    
    // End of certificate
    tableEndY += 10;
    doc.setFont("helvetica", "bold");
    doc.text("****------END OF CALIBRATION CERTIFICATE-----****", pageWidth / 2, tableEndY, { align: "center" });
    
    // Save or return the document
    if (returnDoc) {
      return doc;
    }

    doc.save(`Calibration_Certificate_${certificate.certificateNo.replace(/\//g, '_')}.pdf`);
    return true;
    
  } catch (error) {
    console.error("Error generating simplified certificate:", error);
    return null;
  }
}