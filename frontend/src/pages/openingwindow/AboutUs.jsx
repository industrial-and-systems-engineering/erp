import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Jane Doe",
      title: "CEO & Founder",
      bio: "With over 15 years of industry experience, Jane leads our vision and strategy.",
      email: "jane@example.com",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
    },
    {
      name: "Mike Ross",
      title: "Technical Director",
      bio: "Mike oversees all technical operations and ensures we deliver cutting-edge solutions.",
      email: "mike@example.com",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop",
    },
    {
      name: "Sarah Johnson",
      title: "Design Lead",
      bio: "Sarah brings creativity and user-centered design principles to every project we undertake.",
      email: "sarah@example.com",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
    },
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  return (
    <div className='bg-white'>
      {/* Hero Section */}
      <motion.div
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        className='text-white py-40 px-4 text-center bg-blue-950'
      >
        <h1 className='text-4xl md:text-5xl font-bold mb-4'>About Us</h1>
        <p className='text-xl max-w-3xl mx-auto'>
          We're on a mission to transform how businesses connect with their customers through
          innovative solutions and exceptional service.
        </p>
      </motion.div>

      {/* Our Story */}
      <motion.section
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        className='py-16 px-4 max-w-7xl mx-auto'
      >
        <div className='grid md:grid-cols-2 gap-12 items-center'>
          <motion.div variants={fadeIn}>
            <h2 className='text-3xl font-bold mb-6'>Our Story</h2>
            <p className='text-gray-600 mb-4'>
              Founded in 2020, our company began with a simple idea: to create solutions that truly
              address our clients' needs while providing exceptional value and service.
            </p>
            <p className='text-gray-600 mb-4'>
              What started as a small team of passionate innovators has grown into a thriving
              company serving clients across multiple industries. Throughout our journey, we've
              remained committed to our core values of integrity, innovation, and customer
              satisfaction.
            </p>
            <p className='text-gray-600'>
              Today, we're proud to be recognized as industry leaders, but we're even more proud of
              the relationships we've built and the positive impact we've made for our clients.
            </p>
          </motion.div>
          <motion.div
            variants={fadeIn}
            className='rounded-lg overflow-hidden shadow-xl'
          >
            <img
              src='https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop'
              alt='Our team collaborating'
              className='w-full h-auto'
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Our Mission & Values */}
      <motion.section
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        className='py-16 px-4 bg-gray-50'
      >
        <div className='max-w-7xl mx-auto'>
          <h2 className='text-3xl font-bold mb-12 text-center'>Our Mission & Values</h2>
          <div className='grid md:grid-cols-3 gap-8'>
            {[
              {
                icon: (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6 text-blue-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 10V3L4 14h7v7l9-11h-7z'
                    />
                  </svg>
                ),
                title: "Innovation",
                description:
                  "We constantly explore new ideas and technologies to deliver cutting-edge solutions that help our clients stay ahead.",
              },
              {
                icon: (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6 text-blue-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                    />
                  </svg>
                ),
                title: "Collaboration",
                description:
                  "We believe in the power of teamwork and partnership, working closely with our clients to achieve shared goals.",
              },
              {
                icon: (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6 text-blue-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                    />
                  </svg>
                ),
                title: "Integrity",
                description:
                  "We conduct our business with honesty, transparency, and a commitment to doing what's right for our clients and employees.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className='bg-white p-8 rounded-lg shadow-md'
              >
                <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                  {item.icon}
                </div>
                <h3 className='text-xl font-semibold mb-3'>{item.title}</h3>
                <p className='text-gray-600'>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        initial='hidden'
        animate='visible'
        variants={staggerContainer}
        className='py-16 px-4 max-w-7xl mx-auto'
      >
        <h2 className='text-3xl font-bold mb-12 text-center'>Meet Our Team</h2>
        <div className='grid md:grid-cols-3 gap-8'>
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className='bg-white rounded-lg shadow-md overflow-hidden'
            >
              <img
                src={member.image}
                alt={member.name}
                className='w-full h-64 object-cover'
              />
              <div className='p-6'>
                <h3 className='text-xl font-semibold mb-1'>{member.name}</h3>
                <p className='text-blue-600 mb-3'>{member.title}</p>
                <p className='text-gray-600 mb-4'>{member.bio}</p>
                <a
                  href={`mailto:${member.email}`}
                  className='text-blue-600 hover:underline'
                >
                  {member.email}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        className='py-16 px-4 bg-blue-600 text-white'
      >
        <div className='max-w-7xl mx-auto'>
          <h2 className='text-3xl font-bold mb-12 text-center'>Our Impact</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
            {[
              { stat: "500+", label: "Projects Completed" },
              { stat: "50+", label: "Team Members" },
              { stat: "100%", label: "Client Satisfaction" },
              { stat: "12", label: "Industry Awards" },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
              >
                <div className='text-4xl font-bold mb-2'>{item.stat}</div>
                <p>{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        className='py-16 px-4 text-center'
      >
        <div className='max-w-3xl mx-auto'>
          <h2 className='text-3xl font-bold mb-4'>Ready to work with us?</h2>
          <p className='text-gray-600 mb-8'>
            We're always looking for new challenges and opportunities to make an impact.
          </p>
          <div className='flex flex-wrap justify-center gap-4'>
            <Link
              to='/contact'
              className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors'
            >
              Contact Us
            </Link>
            <Link
              to='/services'
              className='bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md font-medium transition-colors'
            >
              Our Services
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutUs;
