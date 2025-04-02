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
      
      const range = product.parameters && product.parameters.length > 0 ? 
                   product.parameters[0].ranges || "Full Range" : "Full Range";
      
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
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 102, 204);
      doc.setFontSize(16);
      doc.text("CALIBRATION CERTIFICATE", pageWidth / 2, 15, { align: "center" });
      
      doc.setFontSize(10);
      
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
      
      y += 12; // Changed from 8 to 12
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("2.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Description &", leftMargin + 5, y);
      y += 4;
      doc.text("Identification of the item", leftMargin + 5, y);
      y += 4;
      doc.text("to be calibrated", leftMargin + 5, y);
      
      y += 8; // Changed from 6 to 8
      doc.setTextColor(0, 128, 128);
      doc.text("i)", indentedMargin, y);
      doc.text("Item", indentedMargin + 10, y);
      doc.setTextColor(0, 0, 0);
      doc.text(":", 80, y);
      doc.setFont("helvetica", "normal");
      doc.text(productName, 85, y);
      
      y += 6; // Changed from 4 to 6
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 128, 128);
      doc.text("ii)", indentedMargin, y);
      doc.text("Make", indentedMargin + 10, y);
      doc.setTextColor(0, 0, 0);
      doc.text(":", 80, y);
      doc.setFont("helvetica", "normal");
      doc.text(productMake, 85, y);
      
      y += 6; // Changed from 4 to 6
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 128, 128);
      doc.text("iii)", indentedMargin, y);
      doc.text("Sl no.", indentedMargin + 10, y);
      doc.setTextColor(0, 0, 0);
      doc.text(":", 80, y);
      doc.setFont("helvetica", "normal");
      doc.text(serialNo, 85, y);
      
      y += 6; // Changed from 4 to 6
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
      
      y += 12; // Changed from 8 to 12
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("3.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Condition of the item", leftMargin + 5, y);
      doc.text(":", 80, y);
      doc.setFont("helvetica", "normal");
      doc.text(condition, 85, y);
      
      y += 12; // Changed from 8 to 12
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("4.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Date of Item Received", leftMargin + 5, y);
      doc.text(":", 80, y);
      doc.setFont("helvetica", "normal");
      doc.text(receivedDate, 85, y);
      
      y += 12; // Changed from 8 to 12
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("5.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Date of Completion of Calibration", leftMargin + 5, y);
      doc.text(":", 85, y);
      doc.setFont("helvetica", "normal");
      doc.text(completionDate, 90, y);
      
      y += 12; // Changed from 8 to 12
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("6.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Next Calibration Recommended on", leftMargin + 5, y);
      doc.text(":", 85, y);
      doc.setFont("helvetica", "normal");
      doc.text(nextCalibrationDate, 90, y);
      
      let location = "At Laboratory";
      if (product.calibrationDataSheet && product.calibrationDataSheet.Location) {
        location = product.calibrationDataSheet.Location;
      } else if (product.calibrationFacilityAvailable) {
        location = product.calibrationFacilityAvailable;
      } else if (product.location) {
        location = product.location;
      } else if (product._parentForm && product._parentForm.calibrationLocation) {
        location = product._parentForm.calibrationLocation;
      }
      
      y += 12; // Changed from 8 to 12
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("7.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Location where Calibration Performed", leftMargin + 5, y);
      doc.text(":", 90, y);
      doc.setFont("helvetica", "normal");
      doc.text(location, 95, y);
      
      y += 12; // Changed from 8 to 12
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("8.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Environmental Condition during Calibration", leftMargin + 5, y);
      doc.text(":", 100, y);
      doc.setFont("helvetica", "normal");
      doc.text(`Temp: ${temperature}`, 105, y);
      doc.text(`Humidity: ${humidity}`, 145, y);
      
      y += 12; // Changed from 8 to 12
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("9.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Calibration Method Used", leftMargin + 5, y);
      doc.text(":", 85, y);
      doc.setFont("helvetica", "normal");
      doc.text(`As per our SOP No: ${methodUsed}`, 90, y);
      
      y += 12; // Changed from 8 to 12
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("10.", leftMargin, y);
      doc.setTextColor(0, 0, 0);
      doc.text("Details of Reference Standard used for calibration", leftMargin + 5, y);
      y += 4;
      doc.text("(Traceable to National/International Standards)", leftMargin + 5, y);
      y += 6;
      
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
      
      let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : y + 40;
      
      if (finalY > pageHeight - 30) {
        doc.addPage();
        finalY = 20;
      }
      
      // Position the signature on the right side of the page
      const signatureX = pageWidth - 60; // Positioning signature from right side
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(70, 130, 180);
      doc.text("Authorised by", signatureX, finalY);
      
      finalY += 10;
      doc.setTextColor(25, 25, 112);
      doc.text("(P.R.SINGHA)", signatureX, finalY);
      
      finalY += 5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text("(Technical Manager)", signatureX, finalY);
      
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
