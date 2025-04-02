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
    if (selectedProduct.calibrationDataSheet && selectedProduct.calibrationDataSheet.Location) {
      location = selectedProduct.calibrationDataSheet.Location;
      console.log("Using Location from calibration data sheet:", location);
    } else if (selectedProduct.calibrationFacilityAvailable) {
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
             selectedProduct.parameters[0].ranges || "Full Range" : "Full Range",
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
    doc.setFillColor(240, 248, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 102, 204);
    doc.setFontSize(16);
    doc.text("CALIBRATION CERTIFICATE", 105, 15, { align: "center" });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(25, 118, 210);
    doc.text("Calibration Certificate No.", 20, 25);
    doc.setTextColor(0, 0, 0);
    doc.text(":", 80, 25);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.certificateNo, 85, 25);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(25, 118, 210);
    doc.text("Date of Issue", 140, 25);
    doc.setTextColor(0, 0, 0);
    doc.text(":", 165, 25);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.issueDate, 170, 25);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(25, 118, 210);
    doc.text("Service Request Form No", 20, 30);
    doc.setTextColor(0, 0, 0);
    doc.text(":", 80, 30);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.serviceRequestFormNo, 85, 30);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(25, 118, 210);
    doc.text("Page", 140, 30);
    doc.setTextColor(0, 0, 0);
    doc.text(":", 165, 30);
    doc.setFont("helvetica", "normal");
    doc.text("01 of 02 pages", 170, 30);
    
    doc.setTextColor(0, 0, 0);
    const currentYear = new Date().getFullYear().toString().slice(-2);
    doc.text(`ULR-CC3731${currentYear}000000502F`, 20, 35);
    
    let y = 45;
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

    // Increase spacing between sections
    y += 12; // Changed from 10 to 12
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    doc.text("2.", leftMargin, y);
    doc.setTextColor(0, 0, 0);
    doc.text("Description &", leftMargin + 5, y);
    y += 5;
    doc.text("Identification of the item", leftMargin + 5, y);
    y += 5;
    doc.text("to be calibrated", leftMargin + 5, y);
    
    y += 8; // Changed from 6 to 8
    doc.setTextColor(0, 128, 128);
    doc.text("i)", indentedMargin, y);
    doc.text("Item", indentedMargin + 10, y);
    doc.setTextColor(0, 0, 0);
    doc.text(":", 80, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.description, 85, y);
    
    y += 6; // Changed from 5 to 6
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 128, 128);
    doc.text("ii)", indentedMargin, y);
    doc.text("Make", indentedMargin + 10, y);
    doc.setTextColor(0, 0, 0);
    doc.text(":", 80, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.make, 85, y);
    
    y += 6; // Changed from 5 to 6
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 128, 128);
    doc.text("iii)", indentedMargin, y);
    doc.text("Sl no.", indentedMargin + 10, y);
    doc.setTextColor(0, 0, 0);
    doc.text(":", 80, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.serialNo, 85, y);
    
    y += 6; // Changed from 5 to 6
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 128, 128);
    doc.text("iv)", indentedMargin, y);
    doc.text("Range", indentedMargin + 10, y);
    doc.setTextColor(0, 0, 0);
    doc.text(":", 80, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.range, 85, y);

    y += 12; // Changed from 10 to 12
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    doc.text("3.", leftMargin, y);
    doc.setTextColor(0, 0, 0);
    doc.text("Condition of the item", leftMargin + 5, y);
    doc.text(":", 80, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.condition, 85, y);

    y += 12; // Changed from 10 to 12
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    doc.text("4.", leftMargin, y);
    doc.setTextColor(0, 0, 0);
    doc.text("Date of Item Received", leftMargin + 5, y);
    doc.text(":", 80, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.receivedDate, 85, y);

    y += 12; // Changed from 10 to 12
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    doc.text("5.", leftMargin, y);
    doc.setTextColor(0, 0, 0);
    doc.text("Date of Completion of Calibration", leftMargin + 5, y);
    doc.text(":", 85, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.completionDate, 90, y);

    y += 12; // Changed from 10 to 12
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    doc.text("6.", leftMargin, y);
    doc.setTextColor(0, 0, 0);
    doc.text("Next Calibration Recommended on", leftMargin + 5, y);
    doc.text(":", 85, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.nextCalibrationDate, 90, y);

    y += 12; // Changed from 10 to 12
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    doc.text("7.", leftMargin, y);
    doc.setTextColor(0, 0, 0);
    doc.text("Location where Calibration Performed", leftMargin + 5, y);
    doc.text(":", 90, y);
    doc.setFont("helvetica", "normal");
    doc.text(certificate.location, 95, y);

    y += 12; // Changed from 10 to 12
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    doc.text("8.", leftMargin, y);
    doc.setTextColor(0, 0, 0);
    doc.text("Environmental Condition during Calibration", leftMargin + 5, y);
    doc.text(":", 100, y);
    doc.setFont("helvetica", "normal");
    doc.text(`Temp: ${certificate.temperature}`, 105, y);
    doc.text(`Humidity: ${certificate.humidity}`, 135, y);

    y += 12; // Changed from 10 to 12
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    doc.text("9.", leftMargin, y);
    doc.setTextColor(0, 0, 0);
    doc.text("Calibration Method Used", leftMargin + 5, y);
    doc.text(":", 85, y);
    doc.setFont("helvetica", "normal");
    doc.text(`As per our SOP No: ${certificate.method}`, 90, y);

    y += 12; // Changed from 10 to 12
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

    let finalY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 15 : y + 30;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(70, 130, 180);
    
    const rightMargin = pageWidth - 50;
    doc.text("Authorised by", rightMargin, finalY);
    
    finalY += 15;
    doc.setTextColor(25, 25, 112);
    doc.text("(P.R.SINGHA)", rightMargin, finalY);
    
    finalY += 7;
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
    const qrY = pageHeight - qrSize - 10;
    
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
    
    doc.setFillColor(240, 248, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 102, 204);
    doc.setFontSize(16);
    doc.text("CALIBRATION CERTIFICATE", pageWidth / 2, 15, { align: "center" });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`Calibration Certificate No. : ${certificateNo}`, margin, 25);
    doc.text(`Job No: ${jobNo}`, margin, 30);
    const currentYear = new Date().getFullYear().toString().slice(-2);
    doc.text(`ULR-CC3731${currentYear}000000502F`, margin, 35);
    
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`;
    
    doc.text(`Date of Issue: ${formattedDate}`, margin + 100, 25);
    doc.text(`Meter Serial no: ${product.serialNo || "N/A"}`, margin + 100, 30);
    doc.text("Page: 02 of 02 Pages", margin + 100, 35);
    
    doc.setFontSize(14);
    doc.text("CALIBRATION RESULTS", pageWidth / 2, 45, { align: "center" });
    
    let tableData = [];
    
    let parameterDetails = "N/A";
    let rangeDetails = "N/A";
    
    if (product.parameters && product.parameters.length > 0) {
      const parameter = product.parameters[0];
      parameterDetails = parameter.parameter || "DC high resistance @1000 Volt";
      rangeDetails = parameter.ranges || "1000 M.ohm";
      
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
      startY: 50,
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
    
    tableEndY += 20;
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
    
    return doc;
  } catch (error) {
    console.error("Error generating calibration results:", error);
    return null;
  }
}