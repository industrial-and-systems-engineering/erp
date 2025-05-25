import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const PdfDownloadHandler = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  
  useEffect(() => {
    const key = searchParams.get('key');
    
    if (!key) {
      setStatus('error');
      return;
    }
    
    try {
      // Check if the PDF data exists in localStorage
      const pdfData = localStorage.getItem(key);
      const expiration = localStorage.getItem(`${key}_expiration`);
      
      if (!pdfData || !expiration) {
        setStatus('expired');
        return;
      }
      
      // Check if the PDF has expired
      if (Date.now() > parseInt(expiration, 10)) {
        // Clean up expired data
        localStorage.removeItem(key);
        localStorage.removeItem(`${key}_expiration`);
        setStatus('expired');
        return;
      }
      
      // Create a download link and trigger it
      const link = document.createElement('a');
      link.href = pdfData;
      link.download = `Calibration_Certificate_${key.replace('pdf_', '')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setStatus('success');
      
      // Optional: Remove the data after download to save space
      // localStorage.removeItem(key);
      // localStorage.removeItem(`${key}_expiration`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setStatus('error');
    }
  }, [searchParams]);
  
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {status === 'loading' && <p>Preparing your document for download...</p>}
      {status === 'success' && <p>Your document download has started. If it doesn't download automatically, please try again.</p>}
      {status === 'expired' && <p>This document link has expired or is no longer available.</p>}
      {status === 'error' && <p>There was an error downloading your document. Please try again later.</p>}
    </div>
  );
};

export default PdfDownloadHandler;