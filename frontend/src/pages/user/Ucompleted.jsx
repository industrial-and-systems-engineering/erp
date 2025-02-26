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
    if (parentForm) {
      const enhancedProduct = {
        ...product,
        _parentForm: parentForm,
        customerName: product.customerName || parentForm.customerName,
        customerAddress: product.customerAddress || parentForm.customerAddress,
      };
      setSelectedProduct(prevProduct => (prevProduct && prevProduct._id === product._id) ? null : enhancedProduct);
    } else {
      setSelectedProduct(prevProduct => (prevProduct && prevProduct._id === product._id) ? null : product);
    }
    setPdfError(null);
  };

  const generatePdf = () => {
    try {
      if (!selectedProduct) {
        setPdfError("No product selected");
        return;
      }

      let customerName = selectedProduct.customer || selectedProduct.customerName || 
        (selectedProduct._parentForm && selectedProduct._parentForm.customerName) || "Unknown Customer";
      let customerAddress = selectedProduct.address || selectedProduct.customerAddress || 
        (selectedProduct._parentForm && selectedProduct._parentForm.customerAddress) || "Unknown Address";

      const certificate = {
        certificateNo: selectedProduct.certificateNo || "CC-" + Math.floor(Math.random() * 10000),
        issueDate: new Date().toLocaleDateString(),
        serviceRequestFormNo: selectedProduct.serviceRequestFormNo || 
                              (selectedProduct._parentForm && selectedProduct._parentForm.formNumber) ||
                              "SRF-" + Math.floor(Math.random() * 10000),
        issuedTo: customerName,
        address: customerAddress,
        description: selectedProduct.name || selectedProduct.productName || selectedProduct.description || "Unknown Product",
        make: selectedProduct.make || selectedProduct.manufacturer || "Unknown Make",
        serialNo: selectedProduct.serialNo || selectedProduct.serialNumber || "N/A",
        range: selectedProduct.range || selectedProduct.measurementRange || "Full Range",
        condition: selectedProduct.condition || "Good",
        receivedDate: selectedProduct.receivedDate || (selectedProduct._parentForm && selectedProduct._parentForm.submissionDate) || new Date().toLocaleDateString(),
        completionDate: selectedProduct.completionDate || selectedProduct.calibratedDate || new Date().toLocaleDateString(),
        nextCalibrationDate: selectedProduct.nextCalibrationDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString(),
        location: selectedProduct.location || selectedProduct.calibrationLocation || "Lab",
        temperature: selectedProduct.temperature || selectedProduct.calibrationTemperature || "23 ± 2",
        humidity: selectedProduct.humidity || selectedProduct.calibrationHumidity || "50 ± 5%",
        method: selectedProduct.method || selectedProduct.calibrationMethod || "SOP-CAL-001",
      };

      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text("CALIBRATION CERTIFICATE", 105, 15, { align: "center" });
      doc.setFontSize(10);
      doc.text(`Calibration Certificate No.: ${certificate.certificateNo}`, 20, 25);
      doc.text(`Date of Issue: ${certificate.issueDate}`, 150, 25);
      doc.text(`Service Request Form No.: ${certificate.serviceRequestFormNo}`, 20, 30);
      doc.text(`Page: 01 of 02 pages`, 150, 30);
      doc.text(`ULR-CC373124000000502F`, 20, 35);
      doc.save(`Calibration_Certificate_${certificate.certificateNo}.pdf`);
      setPdfError(null);
    } catch (error) {
      setPdfError(`PDF Generation Error: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold text-center my-10">Completed Products</h1>
      {pdfError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{pdfError}</div>}
      {calibratedForms.length > 0 ? (
        <div className="space-y-2 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4">
            {calibratedForms.map((form, formIndex) =>
              form.products.map((product) => (
                <div key={product._id} className="bg-white p-4 border border-gray-200 rounded-md mb-3 hover:shadow-md">
                  <p className="text-gray-700 font-medium">Form: {form.formNumber || `#${formIndex + 1}`}</p>
                  <p className="text-gray-700">Product: {product.name || product.description}</p>
                  <div className="flex justify-end mt-2">
                    <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700" onClick={() => toggleProductDetails(product, form)}>Show Details</button>
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
                  <button className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700" onClick={generatePdf}>Download Form</button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : <p className="text-gray-500 text-center">No calibrated products found.</p>}
    </div>
  );
};

export default Ucompleted;
