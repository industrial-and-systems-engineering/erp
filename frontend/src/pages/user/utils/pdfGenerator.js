import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
const image = '/doc.jpg';

// This function stores PDF data in localStorage
function storePdfInLocalStorage(pdfData, certificateNo) {
  const storageKey = `pdf_${certificateNo.replace(/\//g, '_')}`;
  try {
    localStorage.setItem(storageKey, pdfData);
    // Set expiration time (e.g., 24 hours)
    const expiration = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem(`${storageKey}_expiration`, expiration.toString());
    return storageKey;
  } catch (error) {
    console.error('Error storing PDF in localStorage:', error);
    return null;
  }
}

// Generate a unique URL for accessing the PDF
function generatePdfAccessUrl(storageKey) {
  // Create a URL that points to your application with the storage key as parameter
  return `${window.location.origin}/pdf-download?key=${storageKey}`;
}

// Modified function to support preview mode
export async function generateReport(data, form, draft = true, withQR = false, previewMode = false) {
  // If not in preview mode, generate the full PDF
  if (!previewMode) {
    return generateFullReport(data, form, draft, withQR);
  } else {
    // Generate the preview PDF with QR code
    return await generatePreviewReport(data, form, draft);
  }
}

// Function to generate just a preview PDF with QR code
async function generatePreviewReport(data, form, draft = true) {
  const certificateNo = data.certificateNo ||
    `ED/CAL/${data.jobNo}/${new Date().getMonth() > 3 ?
      `${new Date().getFullYear()}-${new Date().getFullYear() + 1 - 2000}` :
      `${new Date().getFullYear() - 1}-${new Date().getFullYear() - 2000}`
    }`;

  // First, generate the full report and get it as base64
  const fullPdfData = generateFullReport(data, form, draft, false, true);

  // Store the full PDF in localStorage
  const storageKey = storePdfInLocalStorage(fullPdfData, certificateNo);

  // Create the access URL
  const pdfAccessUrl = generatePdfAccessUrl(storageKey);

  // Generate QR code as data URL
  const qrCodeDataUrl = await QRCode.toDataURL(pdfAccessUrl, {
    width: 150,
    margin: 2,
    errorCorrectionLevel: 'H'
  });

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
  });
  const pageWidth = doc.internal.pageSize.getWidth();   // 210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm     

  doc.addImage(image, 'PNG', 0, 0, pageWidth, pageHeight);
  const marginLeft = 20;
  const marginRight = 20;
  const marginTop = 80;    // header height
  const marginBottom = 60; // footer height


  const rowHeight = 7; // approx height of one row of content

  let y = marginTop + 5; // start content below header, 5 mm padding
  let currentPage = 1;
  // Add this right after your variable declarations

  // Setup a page preprocessing hook to ensure background is added first
  const originalAddPage = doc.addPage;
  doc.addPage = function () {
    // Call the original method
    originalAddPage.apply(this, arguments);
    // Add background to the newly created page
    doc.addImage(image, 'PNG', 0, 0, pageWidth, pageHeight);
    return this;
  };
  // Helper function to check and add new page if needed
  function checkAndAddPage(yPosition, heightNeeded = rowHeight) {
    // Check if adding content would exceed page bounds
    if (yPosition + heightNeeded > pageHeight - marginBottom) {
      // Add a new page
      doc.addPage();
      // Add background image to the new page
      doc.addImage(image, 'PNG', 0, 0, pageWidth, pageHeight);
      // Reset Y position to top of content area
      currentPage++;
      // Return new Y position at top of content area
      return marginTop + 5;
    }
    // If there's enough space, return the current Y position
    return yPosition;
  }

  function addHeader(doc, pageNum, totalPages) {
    let y = marginTop - 30;
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("CALIBRATION CERTIFICATE", pageWidth / 2, y, { align: "center" });
    y += rowHeight;
    // Left side header content
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Calibration Certificate No. :", marginLeft, y);
    doc.text(certificateNo, marginLeft + 54, y);
    y += rowHeight;
    doc.text("Service Request Form No. :", marginLeft, y);
    doc.text(form.srfNo, marginLeft + 54, y);
    y += rowHeight;
    doc.text("ULR-CC373125000000298F", marginLeft, y);
    y = marginTop - 30;
    // Right side header content
    y += rowHeight;
    doc.text("Date of Issue:", pageWidth - marginRight - 70, y);
    doc.text(new Date().toLocaleDateString(), pageWidth - marginRight - 20, y);
    y += rowHeight;
    doc.text("Page", pageWidth - marginRight - 70, y);
    doc.text(`: ${pageNum} of ${totalPages}`, pageWidth - marginRight - 20, y);
  }

  function addFooter(doc, pageNum, totalPages) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");

    // Footer text centered horizontally (you can also align left or right)
    const footerText = `Confidential - Page ${pageNum} of ${totalPages}`;
    const textWidth = doc.getTextWidth(footerText);
    doc.text(footerText, (pageWidth - textWidth) / 2, pageHeight - 15);
  }

  // 1. Certificate Issued to
  doc.setFontSize(12);
  doc.text("1. Certificate Issued to", marginLeft, y);
  doc.text(":", 80, y);
  doc.setFont("helvetica", "normal");
  doc.text(`M/s. ${form.contactPersonName}`, 85, y);

  // Format address with line breaks
  const addressLines = form.address.split(',');
  if (addressLines.length > 1) {
    y += rowHeight;
    y = checkAndAddPage(y);
    doc.text(addressLines[0], 85, y);

    for (let i = 1; i < addressLines.length; i++) {
      y += rowHeight;
      y = checkAndAddPage(y);
      doc.text(addressLines[i].trim(), 85, y);
    }
  } else {
    y += rowHeight;
    y = checkAndAddPage(y);
    doc.text(form.address, 85, y);
  }

  y += rowHeight;
  y = checkAndAddPage(y);

  // 2. Description & Identification
  doc.text("2. Description & Identification of the item", marginLeft, y);
  y += rowHeight;
  y = checkAndAddPage(y);

  // Item description
  doc.text("i)", marginLeft + 5, y);
  doc.text("Item", marginLeft + 10, y);
  doc.text(":", 80, y);
  doc.text(data.instrumentDescription, 85, y);

  // Make
  y += rowHeight;
  y = checkAndAddPage(y);
  doc.text("ii)", marginLeft + 5, y);
  doc.text("Make", marginLeft + 10, y);
  doc.text(":", 80, y);
  doc.text(data.make, 85, y);

  // Serial Number
  y += rowHeight;
  y = checkAndAddPage(y);
  doc.text("iii)", marginLeft + 5, y);
  doc.text("Sl no.", marginLeft + 10, y);
  doc.text(":", 80, y);
  doc.text(data.serialNo, 85, y);

  // Model (instead of Range)
  y += rowHeight;
  y = checkAndAddPage(y);
  doc.text("iv)", marginLeft + 5, y);
  doc.text("Model", marginLeft + 10, y);
  doc.text(":", 80, y);
  const modelValue = data.model || "Not Applicable";
  doc.text(modelValue, 85, y);

  y += rowHeight;
  y = checkAndAddPage(y);

  // 3. Characterization and Condition
  doc.text("3. Characterisation and Condition of the item", marginLeft, y);
  y += rowHeight;
  y = checkAndAddPage(y);

  // Characterization
  doc.text("i)", marginLeft + 5, y);
  doc.text("Characterisation", marginLeft + 10, y);
  doc.text(":", 80, y);
  doc.text("Not Applicable", 85, y);

  // Condition
  y += rowHeight;
  y = checkAndAddPage(y);
  doc.text("ii)", marginLeft + 5, y);
  doc.text("Condition", marginLeft + 10, y);
  doc.text(":", 80, y);
  doc.text(form.conditionOfProduct, 85, y);

  y += rowHeight;
  y = checkAndAddPage(y);

  // 4. Date of Item Received
  doc.text("4. Date of Item Received", marginLeft, y);
  doc.text(":", 80, y);
  const receivedDate = data.updatedAt instanceof Date ? data.date : new Date(data.date);
  doc.text(receivedDate.toLocaleDateString(), 85, y);

  y += rowHeight;
  y = checkAndAddPage(y);

  // 5. Date of Completion of Calibration
  doc.text("5. Date of Completion of Calibration", marginLeft, y);
  doc.text(":", 85, y);
  doc.setFont("helvetica", "normal");
  const updatedAtDate = data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt);
  doc.text(updatedAtDate.toLocaleDateString(), 90, y);

  y += rowHeight;
  y = checkAndAddPage(y);

  // 6. Next Calibration Recommended on
  doc.text("6. Next Calibration Recommended on: ", marginLeft, y);
  const nextCalibrationDate = data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt);
  doc.text(nextCalibrationDate.toLocaleDateString(), 95, y);

  y += rowHeight;
  y = checkAndAddPage(y);

  // 7. Location where Calibration Performed
  doc.text("7. Location where Calibration Performed: ", marginLeft, y);
  doc.text(data.Location, 98, y);

  y += rowHeight;
  y = checkAndAddPage(y);

  // 8. Environmental Condition during Calibration
  doc.text("8. Environmental Condition during Calibration: ", marginLeft, y);
  doc.text(`Temp: ${data.roomTemp} °C`, 108, y);
  doc.text(`Humidity: ${data.humidity}`, 150, y);

  y += rowHeight;
  y = checkAndAddPage(y);

  // 9. Calibration Method Used
  doc.text("9. Calibration Procedure followed", marginLeft, y);
  doc.text(":", 85, y);
  doc.text(`As per SOP No: ${form.calibrationMethodUsed}`, 90, y);

  y += rowHeight;
  y = checkAndAddPage(y);

  // 10. Reference Standards
  doc.text("10. Details of Reference Standard used for calibration", marginLeft, y);
  y += rowHeight;
  y = checkAndAddPage(y);
  doc.text("(Traceable to National/International Standards)", marginLeft + 5, y);

  y += rowHeight;
  y = checkAndAddPage(y);

  // Reference standards table
  autoTable(doc, {
    startY: y,
    head: [['SI no', 'Name', 'Make/Model', 'Serial No.', 'Certificate No.', 'Valid Upto', 'Calibrated By', 'Traceable To']],
    body: data.detailsOfMasterUsed.map((ref, index) => [
      `${index + 1}.`,
      ref.name,
      ref.MakeModel,
      ref.serialNo,
      ref.CertificateNo,
      ref.ValidUpto,
      ref.CalibratedBy,
      ref.TraceableTo
    ]),
    theme: 'grid',
    margin: { left: marginLeft, right: marginRight, top: marginTop, bottom: marginBottom },
    tableWidth: 'auto',
    headStyles: {
      fillColor: false, // Makes header background transparent
      textColor: [0, 0, 0], // Black text
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
    },
    styles: {
      fillColor: false, // Makes table background transparent
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      border: { horizontal: true, vertical: true },
      fontSize: 8,
      cellPadding: 2,
      overflow: 'linebreak',
      halign: 'left',
      valign: 'middle',
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 10 },  // SI no - narrow
      1: { cellWidth: 'auto' }, // Name
      2: { cellWidth: 'auto' }, // Make/Model
      3: { cellWidth: 'auto' }, // Serial No.
      4: { cellWidth: 'auto' }, // Certificate No.
      5: { cellWidth: 'auto' }, // Valid Upto
      6: { cellWidth: 'auto' }, // Calibrated By
      7: { cellWidth: 'auto' }  // Traceable To
    },
  });

  y = doc.lastAutoTable.finalY + 10; // move Y position below the table
  y = checkAndAddPage(y);

  // QR Code instructions;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Scan QR Code to Download Complete Certificate", pageWidth / 2, y, { align: "center" });

  // Add QR code
  doc.addImage(qrCodeDataUrl, 'PNG', (pageWidth - 50) / 2, y + 10, 50, 50);

  // Legal notice
  y = y + 70;
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text("This preview is for verification purposes only. The complete calibration", pageWidth / 2, y, { align: "center" });
  doc.text("certificate contains full details required for compliance and audit.", pageWidth / 2, y + 5, { align: "center" });

  // Update the total page count
  const totalPages = doc.getNumberOfPages();

  // Add header/footer to all pages after content generation with correct page numbers
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addHeader(doc, i, totalPages);
    // addFooter(doc, i, totalPages);
  }

  // Save the preview PDF
  doc.save(`Preview_Calibration_Certificate_${certificateNo.replace(/\//g, '_')}.pdf`);

  return true;
}

// Modified original function to optionally return base64 data instead of saving
function generateFullReport(data, form, draft = true, withQR = false, returnData = false) {
  const certificateNo = data.certificateNo ||
    `ED/CAL/${data.jobNo}/${new Date().getMonth() > 3 ?
      `${new Date().getFullYear()}-${new Date().getFullYear() + 1 - 2000}` :
      `${new Date().getFullYear() - 1}-${new Date().getFullYear() - 2000}`
    }`;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
  });
  const pageWidth = doc.internal.pageSize.getWidth();   // 210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm     

  if (!draft) doc.addImage(image, 'PNG', 0, 0, pageWidth, pageHeight);
  const marginLeft = 20;
  const marginRight = 20;
  const marginTop = 84;    // header height
  const marginBottom = 50; // footer height


  const rowHeight = 7; // approx height of one row of content

  let y = marginTop + 5; // start content below header, 5 mm padding
  let currentPage = 1;
  // Add this right after your variable declarations

  // Setup a page preprocessing hook to ensure background is added first
  const originalAddPage = doc.addPage;
  doc.addPage = function () {
    // Call the original method
    originalAddPage.apply(this, arguments);
    // Add background to the newly created page
    if (!draft) doc.addImage(image, 'PNG', 0, 0, pageWidth, pageHeight);
    return this;
  };
  // Helper function to check and add new page if needed
  function checkAndAddPage(yPosition, heightNeeded = rowHeight) {
    // Check if adding content would exceed page bounds
    if (yPosition + heightNeeded > pageHeight - marginBottom) {
      // Add a new page
      doc.addPage();
      // Add background image to the new page
      if (!draft) doc.addImage(image, 'PNG', 0, 0, pageWidth, pageHeight);
      // Reset Y position to top of content area
      currentPage++;
      // Return new Y position at top of content area
      return marginTop + 5;
    }
    // If there's enough space, return the current Y position
    return yPosition;
  }

  function addHeader(doc, pageNum, totalPages) {
    let y = marginTop - 30;
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("CALIBRATION CERTIFICATE", pageWidth / 2, y, { align: "center" });
    y += rowHeight;
    // Left side header content
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Calibration Certificate No. :", marginLeft, y);
    doc.text(certificateNo, marginLeft + 54, y);
    y += rowHeight;
    doc.text("Service Request Form No. :", marginLeft, y);
    doc.text(form.srfNo, marginLeft + 54, y);
    y += rowHeight;
    doc.text("ULR-CC373125000000298F", marginLeft, y);
    y = marginTop - 30;
    // Right side header content
    y += rowHeight;
    doc.text("Date of Issue:", pageWidth - marginRight - 70, y);
    doc.text(new Date().toLocaleDateString(), pageWidth - marginRight - 20, y);
    y += rowHeight;
    doc.text("Page", pageWidth - marginRight - 70, y);
    doc.text(`: ${pageNum} of ${totalPages}`, pageWidth - marginRight - 20, y);
  }

  function addFooter(doc, pageNum, totalPages) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");

    // Footer text centered horizontally (you can also align left or right)
    const footerText = `Confidential - Page ${pageNum} of ${totalPages}`;
    const textWidth = doc.getTextWidth(footerText);
    doc.text(footerText, (pageWidth - textWidth) / 2, pageHeight - 15);
  }

  // 1. Certificate Issued to
  doc.setFontSize(12);
  doc.text("1. Certificate Issued to", marginLeft, y);
  doc.text(":", 80, y);
  doc.setFont("helvetica", "normal");
  doc.text(`M/s. ${form.contactPersonName}`, 85, y);

  // Format address with line breaks
  const addressLines = form.address.split(',');
  if (addressLines.length > 1) {
    y += rowHeight;
    y = checkAndAddPage(y);
    doc.text(addressLines[0], 85, y);

    for (let i = 1; i < addressLines.length; i++) {
      y += rowHeight;
      y = checkAndAddPage(y);
      doc.text(addressLines[i].trim(), 85, y);
    }
  } else {
    y += rowHeight;
    y = checkAndAddPage(y);
    doc.text(form.address, 85, y);
  }

  y += rowHeight;
  y = checkAndAddPage(y);

  // 2. Description & Identification
  doc.text("2. Description & Identification of the item", marginLeft, y);
  y += rowHeight;
  y = checkAndAddPage(y);

  // Item description
  doc.text("i)", marginLeft + 5, y);
  doc.text("Item", marginLeft + 10, y);
  doc.text(":", 80, y);
  doc.text(data.instrumentDescription, 85, y);

  // Make
  y += rowHeight;
  y = checkAndAddPage(y);
  doc.text("ii)", marginLeft + 5, y);
  doc.text("Make", marginLeft + 10, y);
  doc.text(":", 80, y);
  doc.text(data.make, 85, y);

  // Serial Number
  y += rowHeight;
  y = checkAndAddPage(y);
  doc.text("iii)", marginLeft + 5, y);
  doc.text("Sl no.", marginLeft + 10, y);
  doc.text(":", 80, y);
  doc.text(data.serialNo, 85, y);

  // Model (instead of Range)
  y += rowHeight;
  y = checkAndAddPage(y);
  doc.text("iv)", marginLeft + 5, y);
  doc.text("Model", marginLeft + 10, y);
  doc.text(":", 80, y);
  const modelValue = data.model || "Not Applicable";
  doc.text(modelValue, 85, y);

  y += rowHeight;
  y = checkAndAddPage(y);

  // 3. Characterization and Condition
  doc.text("3. Characterisation and Condition of the item", marginLeft, y);
  y += rowHeight;
  y = checkAndAddPage(y);

  // Characterization
  doc.text("i)", marginLeft + 5, y);
  doc.text("Characterisation", marginLeft + 10, y);
  doc.text(":", 80, y);
  doc.text("Not Applicable", 85, y);

  // Condition
  y += rowHeight;
  y = checkAndAddPage(y);
  doc.text("ii)", marginLeft + 5, y);
  doc.text("Condition", marginLeft + 10, y);
  doc.text(":", 80, y);
  doc.text(form.conditionOfProduct, 85, y);

  y += rowHeight;
  y = checkAndAddPage(y);

  // 4. Date of Item Received
  doc.text("4. Date of Item Received", marginLeft, y);
  doc.text(":", 80, y);
  const receivedDate = data.updatedAt instanceof Date ? data.date : new Date(data.date);
  doc.text(receivedDate.toLocaleDateString(), 85, y);

  y += rowHeight;
  y = checkAndAddPage(y);

  // 5. Date of Completion of Calibration
  doc.text("5. Date of Completion of Calibration", marginLeft, y);
  doc.text(":", 85, y);
  doc.setFont("helvetica", "normal");
  const updatedAtDate = data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt);
  doc.text(updatedAtDate.toLocaleDateString(), 90, y);

  y += rowHeight;
  y = checkAndAddPage(y);

  // 6. Next Calibration Recommended on
  doc.text("6. Next Calibration Recommended on: ", marginLeft, y);
  const nextCalibrationDate = data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt);
  doc.text(nextCalibrationDate.toLocaleDateString(), 95, y);

  y += rowHeight;
  y = checkAndAddPage(y);

  // 7. Location where Calibration Performed
  doc.text("7. Location where Calibration Performed: ", marginLeft, y);
  doc.text(data.Location, 98, y);

  y += rowHeight;
  y = checkAndAddPage(y);

  // 8. Environmental Condition during Calibration
  doc.text("8. Environmental Condition during Calibration: ", marginLeft, y);
  doc.text(`Temp: ${data.roomTemp} °C`, 108, y);
  doc.text(`Humidity: ${data.humidity}`, 150, y);

  y += rowHeight;
  y = checkAndAddPage(y);

  // 9. Calibration Method Used
  doc.text("9. Calibration Procedure followed", marginLeft, y);
  doc.text(":", 85, y);
  doc.text(`As per SOP No: ${form.calibrationMethodUsed}`, 90, y);

  y += rowHeight;
  y = checkAndAddPage(y);

  // 10. Reference Standards
  doc.text("10. Details of Reference Standard used for calibration", marginLeft, y);
  y += rowHeight;
  y = checkAndAddPage(y);
  doc.text("(Traceable to National/International Standards)", marginLeft + 5, y);

  y += rowHeight;
  y = checkAndAddPage(y);

  // Reference standards table
  autoTable(doc, {
    startY: y,
    head: [['SI no', 'Name', 'Make/Model', 'Serial No.', 'Certificate No.', 'Valid Upto', 'Calibrated By', 'Traceable To']],
    body: data.detailsOfMasterUsed.map((ref, index) => [
      `${index + 1}.`,
      ref.name,
      ref.MakeModel,
      ref.serialNo,
      ref.CertificateNo,
      ref.ValidUpto,
      ref.CalibratedBy,
      ref.TraceableTo
    ]),
    theme: 'grid',
    margin: { left: marginLeft, right: marginRight, top: marginTop, bottom: marginBottom },
    tableWidth: 'auto',
    headStyles: {
      fillColor: false, // Makes header background transparent
      textColor: [0, 0, 0], // Black text
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
    },
    styles: {
      fillColor: false, // Makes table background transparent
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      border: { horizontal: true, vertical: true },
      fontSize: 8,
      cellPadding: 2,
      overflow: 'linebreak',
      halign: 'left',
      valign: 'middle',
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 10 },  // SI no - narrow
      1: { cellWidth: 'auto' }, // Name
      2: { cellWidth: 'auto' }, // Make/Model
      3: { cellWidth: 'auto' }, // Serial No.
      4: { cellWidth: 'auto' }, // Certificate No.
      5: { cellWidth: 'auto' }, // Valid Upto
      6: { cellWidth: 'auto' }, // Calibrated By
      7: { cellWidth: 'auto' }  // Traceable To
    },
  });

  y = doc.lastAutoTable.finalY + 10; // move Y position below the table
  y = checkAndAddPage(y);

  doc.setFont("helvetica", "bold");
  doc.text("CALIBRATION RESULTS", pageWidth / 2, y, { align: "center" });

  y += rowHeight;
  y = checkAndAddPage(y);

  doc.setFont("helvetica", "normal");
  doc.text("Electro-technical Calibration", marginLeft, y);

  y += rowHeight;
  y = checkAndAddPage(y);

  // Calibration results table
  let tableData = [];
  if (data.parameters && data.parameters.length > 0) {
    let rowCounter = 1;
    // Process all parameters
    data.parameters.forEach((parameter, paramIndex) => {
      if (parameter.readings && parameter.readings.length > 0) {
        parameter.readings.forEach((reading, readingIndex) => {
          if (readingIndex === 0) {
            tableData.push([
              `${rowCounter}.`,
              parameter.parameter,
              `${parameter.ranges} & ${parameter.leastCount}`,
              reading.rName,
              reading.mean,
              reading.uc
            ]);
          } else {
            tableData.push([
              `${rowCounter}.`,
              "",
              `${parameter.ranges} & ${parameter.leastCount}`,
              reading.rName,
              reading.mean,
              reading.uc
            ]);
          }
          rowCounter++;
        });
      }
    });
  }

  autoTable(doc, {
    startY: y,
    head: [['SI no', 'Parameter', 'Range & Least Count', 'Standard Value Applied', '*DUC value observed (average of five readings)', '(±) Measument uncertainty at 95% **C.L where k = 2']],
    body: tableData,
    theme: 'grid',
    margin: { left: marginLeft, right: marginRight, top: marginTop, bottom: marginBottom },
    tableWidth: 'auto',
    headStyles: {
      fillColor: false, // Makes header background transparent
      textColor: [0, 0, 0], // Black text
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
    },
    styles: {
      fillColor: false, // Makes table background transparent
      fontSize: 8,
      fontStyle: 'bold',
      cellWidth: 'wrap',
      cellPadding: 2,
      overflow: 'linebreak',
      halign: 'left',
      valign: 'middle',
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      border: { horizontal: true, vertical: true },
    },
    columnStyles: {
      // SI no - narrow
      1: { cellWidth: 'auto' }, // Parameter
      2: { cellWidth: 'auto' }, // Range & Least Count
      3: { cellWidth: 25 },     // Standard Value Applied - smaller
      4: { cellWidth: 25 },     // DUC value observed - smaller
      5: { cellWidth: 25 }      // Measurement uncertainty - smaller            
    },
  });

  y = doc.lastAutoTable.finalY + 10; // move Y position below the table
  y = checkAndAddPage(y);

  // DUC explanation
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("*DUC=Device Under Calibration, **C.L= Confidence Level", marginLeft, y);

  // Separator
  y += 5;
  y = checkAndAddPage(y);
  doc.setLineWidth(0.3);
  doc.line(marginLeft, y, pageWidth - marginRight, y);

  // Remarks
  y += rowHeight;
  y = checkAndAddPage(y);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("REMARKS :", marginLeft, y);
  doc.setFont("helvetica", "normal");
  y += rowHeight;
  y = checkAndAddPage(y);
  // Make the remarks more specific to the product type
  let remarksText = `The above ${data.instrumentDescription} has been calibrated over its range and the readings are tabulated above.`;

  // Estimate if the remarks will fit
  const maxWidth = pageWidth - (marginLeft + 35);
  const textLines = doc.splitTextToSize(remarksText, maxWidth);
  const textHeight = textLines.length * 5;

  // Check if we need a page break for remarks
  y = checkAndAddPage(y, textHeight);

  // Add text wrapping by using the pre-split lines
  doc.text(textLines, marginLeft, y);

  // Always adjust y position based on the number of lines
  y += (textLines.length - 1) * 5;

  // Separator
  y += 10;
  y = checkAndAddPage(y);
  doc.line(marginLeft, y, pageWidth - marginRight, y);
  // Add signatures section
  y += rowHeight * 2;
  y = checkAndAddPage(y, rowHeight * 6); // Reserve space for signatures and titles

  // Calculate column widths for 3 signatures
  const signatureWidth = (pageWidth - (marginLeft + marginRight)) / 3;

  // Define positions for three signature columns
  const sigPositions = [
    marginLeft + signatureWidth / 2,                // First signature center
    marginLeft + signatureWidth + signatureWidth / 2, // Second signature center
    marginLeft + 2 * signatureWidth + signatureWidth / 2  // Third signature center
  ];
  // Add titles below signature lines
  y += rowHeight;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");

  doc.text("Calibrated by", sigPositions[0], y, { align: "center" });
  doc.text("Checked by", sigPositions[1], y, { align: "center" });
  doc.text("Authorized by", sigPositions[2], y, { align: "center" });

  y += rowHeight * 2; // Add space after signatures
  // Notes
  y += rowHeight;
  y = checkAndAddPage(y);
  doc.text("Note:", marginLeft, y);
  y += rowHeight;
  y = checkAndAddPage(y);
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
  doc.setFontSize(9);
  notes.forEach((note, index) => {
    y += 5;
    // Estimate if the note will fit
    const noteText = `${index + 1}. ${note}`;
    const noteLines = doc.splitTextToSize(noteText, pageWidth - 2 * marginLeft);
    const noteHeight = noteLines.length * 5;

    // Check if we need a page break for this specific note
    y = checkAndAddPage(y, noteHeight);

    doc.text(noteText, marginLeft, y, {
      maxWidth: pageWidth - 2 * marginLeft
    });

    // Adjust y position based on actual text height
    if (noteLines.length > 1) {
      y += (noteLines.length - 1) * 5;
    }
  });

  // Separator
  y += 10;
  y = checkAndAddPage(y);
  doc.line(marginLeft, y, pageWidth - marginRight, y);

  // End of certificate
  y += 10;
  y = checkAndAddPage(y);
  doc.setFont("helvetica", "bold");
  doc.text("****------END OF CALIBRATION CERTIFICATE-----****", pageWidth / 2, y, { align: "center" });

  // Update the total page count
  const totalPages = doc.getNumberOfPages();

  // Add header/footer to all pages after content generation with correct page numbers
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addHeader(doc, i, totalPages);
    // addFooter(doc, i, totalPages);
  }
  // Save the PDF
  if (returnData) {
    return doc.output('datauristring');
  } else {
    doc.save(`Calibration_Certificate_${certificateNo.replace(/\//g, '_')}.pdf`);
    return true;
  }
}
