import React from "react";

const Footer = () => {
  return (
    <>
      <footer className='bg-gray-800 text-white'>
        <div className='max-w-7xl mx-auto px-4 py-8'>
          <div className='grid grid-cols-1 md:grid-cols-5 gap-8'>
            <div>
              <img
                src='https://anab.ansi.org/wp-content/uploads/2022/10/ANAB-logo.png'
                alt='ANAB Logo'
                className='mb-4'
              />
              <p className='text-sm leading-relaxed'>
                The ANSI National Accreditation Board (ANAB) is a wholly owned subsidiary of the
                American National Standards Institute (ANSI), a non-profit organization.
              </p>
            </div>

            <div>
              <h2 className='text-lg font-semibold mb-4'>USEFUL LINKS</h2>
              <ul className='space-y-2'>
                <li>
                  <a
                    href='/about'
                    className='hover:underline'
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href='/services'
                    className='hover:underline'
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href='/industries'
                    className='hover:underline'
                  >
                    Industries We Serve
                  </a>
                </li>
                <li>
                  <a
                    href='/certifications'
                    className='hover:underline'
                  >
                    Certifications
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className='text-lg font-semibold mb-4'>LOGINS</h2>
              <ul className='space-y-2'>
                <li>
                  <a
                    href='/user'
                    className='hover:underline'
                  >
                    User Log in
                  </a>
                </li>
                <li>
                  <a
                    href='/technician'
                    className='hover:underline'
                  >
                    Technician Log in
                  </a>
                </li>
                <li>
                  <a
                    href='/csc'
                    className='hover:underline'
                  >
                    Customer Service Cell Log in
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className='text-lg font-semibold mb-4'>CONTACT</h2>
              <p className='text-sm leading-relaxed mb-2'>
                1891 Street NW
                <br />
                Suite 100A
                <br />
                Washington, DC 20036
              </p>
              <p className='text-sm mb-2'>414-501-5494</p>
              <p className='text-sm'>
                <a
                  href='mailto:anab@anab.org'
                  className='hover:underline'
                >
                  anab@anab.org
                </a>
              </p>
            </div>

            <div>
              <h2 className='text-lg font-semibold mb-4'>Subscribe to ANAB Newsletter</h2>
              <form className='flex flex-col space-y-2'>
                <input
                  type='email'
                  placeholder='Enter your email'
                  className='p-2 text-white'
                  required
                />
                <button
                  type='submit'
                  className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2'
                >
                  Subscribe
                </button>
              </form>
              <p className='text-xs mt-2'>
                By clicking sign up, you agree to our
                <a
                  href='#'
                  className='underline'
                >
                  Privacy Policy
                </a>
                and
                <a
                  href='#'
                  className='underline'
                >
                  Terms of Use
                </a>
                .
              </p>
            </div>
          </div>

          <div className='mt-8 border-t border-gray-700 pt-4 text-center md:text-left'>
            <p className='text-sm text-gray-400'>&copy; 2023 ANAB. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
