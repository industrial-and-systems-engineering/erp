import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PDFModal = ({ isOpen, onClose, title, pdfUrl }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 md:p-8'
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl h-[95vh] flex flex-col overflow-hidden'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='flex justify-between items-center p-4 sm:p-6 border-b dark:border-gray-700'>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white'>
              {title}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className='bg-gray-200 dark:bg-gray-700 rounded-full p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
              onClick={onClose}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </motion.button>
          </div>
          <div className='flex-grow p-4 overflow-hidden'>
            <iframe
              src={pdfUrl}
              className='w-full h-full rounded-md border dark:border-gray-700'
              title={title}
              loading='lazy'
            />
          </div>
          <div className='p-4 border-t dark:border-gray-700 flex justify-between items-center'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
              onClick={onClose}
            >
              Close
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={pdfUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 mr-2'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
              Download
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PDFModal;
