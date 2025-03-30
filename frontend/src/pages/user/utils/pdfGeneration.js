import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function generatePdf(selectedProduct) {
    try {
        console.log("generatePdf function called");

        if (!selectedProduct) {
            console.error("No product selected");
            return;
        }

        console.log("Full selected product object:", JSON.stringify(selectedProduct, null, 2));

        // Extract customer data using actual field names from the provided structure
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

        // Get address from parent form as seen in the structure
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

        // Extract product details - use instrumentDescription from actual data structure
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

        // Extract make and serial number from the actual fields in the structure
        const productMake = selectedProduct.make || "Unknown Make";
        const serialNo = selectedProduct.serialNo || "N/A";

        // Get SRF number from parent form
        const srfNo = selectedProduct._parentForm && selectedProduct._parentForm.srfNo ?
            selectedProduct._parentForm.srfNo :
            "Unknown SRF";

        // Get method from parameters if available
        let methodUsed = "ED/SOP/E-002";
        if (selectedProduct.parameters && selectedProduct.parameters.length > 0 && selectedProduct.parameters[0].methodUsed) {
            methodUsed = selectedProduct.parameters[0].methodUsed.split(" - ")[0]; // Get just the method number
        }

        // Format dates in DD.MM.YYYY format
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

        // Generate certificate number in required format
        const certificateNo = `ED/CAL/${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}/${new Date().getMonth() > 3 ? 
                          `${new Date().getFullYear()}-${new Date().getFullYear() + 1 - 2000}` : 
                          `${new Date().getFullYear() - 1}-${new Date().getFullYear() - 2000}`}`;

        // Extract temperature and humidity from the product
        const temperature = selectedProduct.roomTemp || "25±4°C";
        const humidity = selectedProduct.humidity ? `$ { selectedProduct.humidity } %` : "30 to 75% RH";

        console.log("Extracted environmental conditions:", { temperature, humidity });

        // Use selectedProduct data for certificate fields
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
            condition: "Satisfactory",
            receivedDate: formatDate(selectedProduct._parentForm && selectedProduct._parentForm.date),
            completionDate: formatDate(),
            nextCalibrationDate: formatDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1))),
            location: "At Laboratory",
            temperature: temperature, // Use extracted temperature
            humidity: humidity, // Use extracted humidity
            method: methodUsed,
            referenceStandard: [{
                description: "Decade Resistance Box",
                makeModel: "Zeal Services ZSDRB",
                slNoIdNo: "201008205 ED/RB-02",
                calibrationCertificateNo: "CAL/24-25/CC/0270-1",
                validUpTo: "06.07.2025",
                calibratedBy: "Nashik Engineering Cluster",
                traceableTo: "NPL"
            }]
        };

        console.log("Certificate data prepared:", certificate);

        // Create new jsPDF instance
        console.log("Creating jsPDF instance");
        const doc = new jsPDF();
        console.log("jsPDF instance created successfully");

        // Add a light blue background to the entire page
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        doc.setFillColor(240, 248, 255); // Very light blue background
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        // Header Section - Blue title text
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 102, 204); // Blue text for the title
        doc.setFontSize(16);
        doc.text("CALIBRATION CERTIFICATE", 105, 15, { align: "center" });

        // Reset text color to black for standard text
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);

        // Certificate number and Date - with colored labels
        doc.setFont("helvetica", "bold");
        doc.setTextColor(25, 118, 210); // Blue for labels
        doc.text("Calibration Certificate No.", 20, 25);
        doc.setTextColor(0, 0, 0);
        doc.text(":", 80, 25);
        doc.setFont("helvetica", "normal");
        doc.text(certificate.certificateNo, 85, 25);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(25, 118, 210); // Blue for labels
        doc.text("Date of Issue", 140, 25);
        doc.setTextColor(0, 0, 0);
        doc.text(":", 165, 25);
        doc.setFont("helvetica", "normal");
        doc.text(certificate.issueDate, 170, 25);

        // SRF No and Page - with colored labels
        doc.setFont("helvetica", "bold");
        doc.setTextColor(25, 118, 210); // Blue for labels
        doc.text("Service Request Form No", 20, 30);
        doc.setTextColor(0, 0, 0);
        doc.text(":", 80, 30);
        doc.setFont("helvetica", "normal");
        doc.text(certificate.serviceRequestFormNo, 85, 30);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(25, 118, 210); // Blue for labels
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

        // Section 1 - Certificate Issued to - colored section number
        doc.setFont("helvetica", "bold");
        doc.setTextColor(70, 130, 180); // Steel blue for section numbers
        doc.text("1.", leftMargin, y);
        doc.setTextColor(0, 0, 0);
        doc.text("Certificate Issued to", leftMargin + 5, y);
        doc.text(":", 80, y);
        doc.setFont("helvetica", "normal");
        doc.text(`M / s.$ { certificate.issuedTo }`, 85, y);

        // Split address lines for better formatting
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

        // Section 2 - Description & Identification - colored section number
        y += 10;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(70, 130, 180); // Steel blue for section numbers
        doc.text("2.", leftMargin, y);
        doc.setTextColor(0, 0, 0);
        doc.text("Description &", leftMargin + 5, y);
        y += 5;
        doc.text("Identification of the item", leftMargin + 5, y);
        y += 5;
        doc.text("to be calibrated", leftMargin + 5, y);

        // Product details with item labels in color
        y += 7;
        doc.setTextColor(0, 128, 128); // Teal for item labels
        doc.text("i)", indentedMargin, y);
        doc.text("Item", indentedMargin + 10, y);
        doc.setTextColor(0, 0, 0);
        doc.text(":", 80, y);
        doc.setFont("helvetica", "normal");
        doc.text(certificate.description, 85, y);

        y += 5;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 128, 128); // Teal for item labels
        doc.text("ii)", indentedMargin, y);
        doc.text("Make", indentedMargin + 10, y);
        doc.setTextColor(0, 0, 0);
        doc.text(":", 80, y);
        doc.setFont("helvetica", "normal");
        doc.text(certificate.make, 85, y);

        y += 5;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 128, 128); // Teal for item labels
        doc.text("iii)", indentedMargin, y);
        doc.text("Sl no.", indentedMargin + 10, y);
        doc.setTextColor(0, 0, 0);
        doc.text(":", 80, y);
        doc.setFont("helvetica", "normal");
        doc.text(certificate.serialNo, 85, y);

        y += 5;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 128, 128); // Teal for item labels
        doc.text("iv)", indentedMargin, y);
        doc.text("Range", indentedMargin + 10, y);
        doc.setTextColor(0, 0, 0);
        doc.text(":", 80, y);
        doc.setFont("helvetica", "normal");
        doc.text(certificate.range, 85, y);

        // Sections 3-9 with colored section numbers
        // Section 3 - Condition
        y += 10;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(70, 130, 180); // Steel blue for section numbers
        doc.text("3.", leftMargin, y);
        doc.setTextColor(0, 0, 0);
        doc.text("Condition of the item", leftMargin + 5, y);
        doc.text(":", 80, y);
        doc.setFont("helvetica", "normal");
        doc.text(certificate.condition, 85, y);

        // Section 4 - Date of Item Received
        y += 10;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(70, 130, 180); // Steel blue for section numbers
        doc.text("4.", leftMargin, y);
        doc.setTextColor(0, 0, 0);
        doc.text("Date of Item Received", leftMargin + 5, y);
        doc.text(":", 80, y);
        doc.setFont("helvetica", "normal");
        doc.text(certificate.receivedDate, 85, y);

        // Section 5 - Completion Date
        y += 10;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(70, 130, 180); // Steel blue for section numbers
        doc.text("5.", leftMargin, y);
        doc.setTextColor(0, 0, 0);
        doc.text("Date of Completion of Calibration", leftMargin + 5, y);
        doc.text(":", 85, y); // Moved colon from 80 to 85 to avoid overlap
        doc.setFont("helvetica", "normal");
        doc.text(certificate.completionDate, 90, y); // Moved text from 85 to 90

        // Section 6 - Next Calibration
        y += 10;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(70, 130, 180); // Steel blue for section numbers
        doc.text("6.", leftMargin, y);
        doc.setTextColor(0, 0, 0);
        doc.text("Next Calibration Recommended on", leftMargin + 5, y);
        doc.text(":", 85, y); // Moved colon from 80 to 85 to avoid overlap
        doc.setFont("helvetica", "normal");
        doc.text(certificate.nextCalibrationDate, 90, y); // Moved text from 85 to 90

        // Section 7 - Location
        y += 10;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(70, 130, 180); // Steel blue for section numbers
        doc.text("7.", leftMargin, y);
        doc.setTextColor(0, 0, 0);
        doc.text("Location where Calibration Performed", leftMargin + 5, y);
        doc.text(":", 90, y); // Moved colon from 80 to 85 to avoid overlap
        doc.setFont("helvetica", "normal");
        doc.text(certificate.location, 95, y); // Moved text from 85 to 90

        // Section 8 - Environmental Condition
        y += 10;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(70, 130, 180); // Steel blue for section numbers
        doc.text("8.", leftMargin, y);
        doc.setTextColor(0, 0, 0);
        doc.text("Environmental Condition during Calibration", leftMargin + 5, y);
        doc.text(":", 100, y); // Moved colon from 80 to 85 to avoid overlap
        doc.setFont("helvetica", "normal");
        // Reduced spacing between Temp and Humidity
        doc.text(`Temp: $ { certificate.temperature }`, 105, y); // Moved from 85 to 90
        doc.text(`Humidity: $ { certificate.humidity }`, 135, y); // Changed from 130 to 120 to reduce spacing

        // Section 9 - Method
        y += 10;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(70, 130, 180); // Steel blue for section numbers
        doc.text("9.", leftMargin, y);
        doc.setTextColor(0, 0, 0);
        doc.text("Calibration Method Used", leftMargin + 5, y);
        doc.text(":", 85, y); // Moved colon from 80 to 85 to avoid overlap
        doc.setFont("helvetica", "normal");
        doc.text(`As per our SOP No: $ { certificate.method }`, 90, y); // Moved from 85 to 90

        // Section 10 - Reference Standards with colored section number
        y += 10; // Changed from 70 to 10 to remove excess space
        doc.setFont("helvetica", "bold");
        doc.setTextColor(70, 130, 180); // Steel blue for section numbers
        doc.text("10.", leftMargin, y);
        doc.setTextColor(0, 0, 0);
        doc.text("Details of Reference Standard used for calibration", leftMargin + 5, y);
        y += 5;
        doc.text("(Traceable to National/International Standards)", leftMargin + 5, y);
        y += 8;

        // Reference Standard Table with light green background
        doc.autoTable({
            startY: y,
            head: [
                ['SI no', 'Description', 'Make/Model', 'Slno/Idno', 'Calibration Certificate No', 'Valid up to', 'Calibrated By', 'Traceable to']
            ],
            body: certificate.referenceStandard.map((ref, index) => [
                `$ { index + 1 }.`,
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
                fillColor: [144, 238, 144], // Light green for table header
                textColor: [0, 0, 0],
                fontStyle: 'bold'
            },
            bodyStyles: {
                fillColor: [240, 255, 240] // Very light green for table body
            }
        });

        // Footer with signature in color
        let finalY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 15 : y + 50;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(70, 130, 180); // Steel blue for "Authorised by"
        doc.text("Authorised by", leftMargin, finalY);

        finalY += 15;
        doc.setTextColor(25, 25, 112); // Dark blue for signature name
        doc.text("(P.R.SINGHA)", leftMargin, finalY);

        finalY += 7;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0); // Back to black for title
        doc.text("(Technical Manager)", leftMargin, finalY);

        // Save the PDF
        console.log("Attempting to save PDF");
        doc.save(`Calibration_Certificate_$ { certificate.certificateNo.replace(/\//g, '_') }.pdf`);
        console.log("PDF saved successfully");

    } catch (error) {
        console.error("Error generating PDF:", error);
    }
}