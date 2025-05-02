import React from "react";
import logo from "../assets/logo.svg"; // Adjust the path as necessary

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-white'>
      <div className='max-w-7xl mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-10'>
          <div className='space-y-4'>
            <img
              src={logo}
              alt='Error Detector Logo'
              className='h-12'
            />
            <p className='text-sm text-gray-400 leading-relaxed'>
              Error Detector is a NABL Accredited Laboratory providing calibration and testing
              services.
            </p>
            <div className='flex space-x-4 pt-2'>
              <a
                href='#'
                className='text-gray-400 hover:text-white transition-colors'
              >
                <span className='sr-only'>LinkedIn</span>
                <svg
                  className='h-6 w-6'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                >
                  <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
                </svg>
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-white transition-colors'
              >
                <span className='sr-only'>Twitter</span>
                <svg
                  className='h-6 w-6'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                >
                  <path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h2 className='text-base font-semibold mb-4 text-gray-300'>USEFUL LINKS</h2>
            <ul className='space-y-2 text-sm text-gray-400'>
              <li>
                <a
                  href='/about'
                  className='hover:text-white transition-colors'
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href='/services'
                  className='hover:text-white transition-colors'
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href='/industries'
                  className='hover:text-white transition-colors'
                >
                  Industries We Serve
                </a>
              </li>
              <li>
                <a
                  href='/certifications'
                  className='hover:text-white transition-colors'
                >
                  Certifications
                </a>
              </li>
              <li>
                <a
                  href='https://www.youtube.com/watch?v=CuT0bF03mGg'
                  className='hover:text-white transition-colors'
                >
                  Demo Video
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className='text-base font-semibold mb-4 text-gray-300'>LOGINS</h2>
            <ul className='space-y-2 text-sm text-gray-400'>
              <li>
                <a
                  href='/user'
                  className='hover:text-white transition-colors'
                >
                  User Log in
                </a>
              </li>
              <li>
                <a
                  href='/technician'
                  className='hover:text-white transition-colors'
                >
                  Technician Log in
                </a>
              </li>
              <li>
                <a
                  href='/csc'
                  className='hover:text-white transition-colors'
                >
                  Customer Service Cell Log in
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className='text-base font-semibold mb-4 text-gray-300'>CONTACT</h2>
            <ul className='space-y-3 text-sm text-gray-400'>
              <li className='flex items-start'>
                <svg
                  className='h-5 w-5 mr-2 flex-shrink-0 mt-0.5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                    clipRule='evenodd'
                  ></path>
                </svg>
                <span>53/2, Haridevpur Road 1891 Street NW Kolkata-700082</span>
              </li>

              <li className='flex items-center'>
                <svg
                  className='h-5 w-5 mr-2 flex-shrink-0'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z'></path>
                </svg>
                <span>Mobile: 09830532452</span>
              </li>

              <li className='flex items-start'>
                <svg
                  className='h-5 w-5 mr-2 flex-shrink-0 mt-0.5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z'></path>
                  <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z'></path>
                </svg>
                <div className='flex flex-col'>
                  <a
                    href='mailto:errordetector268@gmail.com'
                    className='hover:text-white transition-colors'
                  >
                    errordetector268@gmail.com
                  </a>
                  <a
                    href='mailto:errordetector268@yahoo.com'
                    className='hover:text-white transition-colors'
                  >
                    errordetector268@yahoo.com
                  </a>
                  <a
                    href='mailto:calibrationerror94@gmail.com'
                    className='hover:text-white transition-colors'
                  >
                    calibrationerror94@gmail.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
