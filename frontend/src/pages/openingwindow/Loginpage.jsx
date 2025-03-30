import React from "react";
import { motion } from "framer-motion";
import {
  StarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  CalendarIcon,
  NewspaperIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const Loginpage = () => {
  // Upcoming calibration events
  const upcomingEvents = [
    {
      title: "Calibration Training Symposium",
      date: "April 14-17, 2025",
      location: "Anaheim, CA",
    },
    {
      title: "NCSL International Workshop",
      date: "July 18-24, 2025",
      location: "Cleveland, OH",
    },
    {
      title: "On-Site Calibration Service Event",
      date: "April 8, 2025",
      location: "Irving, TX",
    },
  ];

  // News items
  const newsItems = [
    {
      title: "New ISO 17025 Standards Update",
      date: "March 15, 2025",
      summary: "Latest changes to calibration standards that affect industry compliance.",
    },
    {
      title: "Expansion of Calibration Services",
      date: "February 27, 2025",
      summary:
        "We've added new capabilities to our electrical and mechanical calibration services.",
    },
  ];

  // Services offered
  const services = [
    {
      title: "Electrical Calibration",
      description:
        "Calibration of electrical measurement instruments including multimeters, oscilloscopes, and power supplies.",
      image: "https://images.unsplash.com/photo-1627704671340-0969d7dbac25",
    },
    {
      title: "Mechanical Calibration",
      description: "Precision calibration for torque wrenches, pressure gauges, and micrometers.",
      image: "https://images.unsplash.com/photo-1627704671340-0969d7dbac25",
    },
    {
      title: "Temperature Calibration",
      description: "Calibration of thermometers, thermal cameras, and temperature controllers.",
      image: "https://images.unsplash.com/photo-1627704671340-0969d7dbac25",
    },
    {
      title: "Dimensional Calibration",
      description: "Calibration of rulers, calipers, micrometers and other measuring tools.",
      image: "https://images.unsplash.com/photo-1627704671340-0969d7dbac25",
    },
  ];

  // Industries served
  const industries = [
    "Manufacturing",
    "Aerospace",
    "Automotive",
    "Healthcare",
    "Electronics",
    "Energy",
    "Food & Beverage",
    "Research",
  ];

  // Testimonials
  const testimonials = [
    {
      text: "Their continued excellence in calibration includes quality of customer service, timeliness, and cost-effectiveness.",
      author: "KLM Manufacturing",
      rating: 5,
    },
    {
      text: "The service we have received thus far is nothing short of superior. I do not doubt the instrument's return condition or the calibration data.",
      author: "S.N., Electronic Component Manufacturer",
      rating: 5,
    },
    {
      text: "We have never failed an ISO inspection because of their precise calibration efforts and teamwork.",
      author: "D.L., Chocolate Manufacturer",
      rating: 5,
    },
  ];

  // FAQs
  const faqs = [
    {
      question: "How often should equipment be calibrated?",
      answer:
        "Most equipment should be calibrated annually, but high-precision instruments or those used in critical applications may require more frequent calibration.",
    },
    {
      question: "Do you offer on-site calibration?",
      answer:
        "Yes, we provide on-site calibration services for equipment that cannot be moved or when minimal downtime is required.",
    },
    {
      question: "Are your calibrations traceable to national standards?",
      answer:
        "Yes, all our calibrations are traceable to NIST or other national metrology institutions, ensuring compliance with international standards.",
    },
  ];

  // Animation variants for fade-in
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <>
      <div className='relative isolate pt-14'>
        {/* Hero Section */}
        <motion.section
          initial='hidden'
          animate='visible'
          variants={fadeIn}
          className='relative w-full h-[500px] object-cover bg-center bg-cover flex items-center justify-center'
        >
          <img
            src='https://images.unsplash.com/photo-1582551716463-c0ba72d6e1d0?q=80&w=2062&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            alt='Hero Background'
            className='absolute inset-0 w-full h-full object-cover blur-xs '
          />
          <div className='absolute inset-0' />
          <div className='absolute inset-0' />
          <div className='relative text-center text-white px-4 max-w-4xl'>
            <h1 className='text-4xl md:text-5xl font-bold mb-4'>
              Precision Calibration for Peak Performance
            </h1>
            <p className='text-xl md:text-2xl mb-8'>
              NABL Accredited Calibration Services You Can Trust
            </p>
            <div className='flex flex-wrap justify-center gap-4'>
              <Link
                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors'
                to='/user'
              >
                Get Started
              </Link>

              <Link
                to='/services'
                className='bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 text-white px-6 py-3 rounded-md font-medium transition-colors'
              >
                Learn More
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Services Section */}
        <motion.section
          initial='hidden'
          animate='visible'
          variants={fadeIn}
          className='py-16 bg-gray-100'
        >
          <div className='container mx-auto px-4'>
            <h2 className='text-3xl font-bold text-center mb-8'>Our Services</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  className='bg-white shadow-md rounded-lg overflow-hidden'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className='w-full h-48 object-cover'
                  />
                  <div className='p-4'>
                    <h3 className='text-xl font-bold mb-2'>{service.title}</h3>
                    <p className='text-gray-600'>{service.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section
          initial='hidden'
          animate='visible'
          variants={fadeIn}
          className='py-16 bg-white'
        >
          <div className='container mx-auto px-4'>
            <h2 className='text-3xl font-bold text-center mb-8'>What Our Clients Say</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className='bg-gray-100 p-6 rounded-lg shadow-md'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <p className='text-gray-700 italic mb-4'>"{testimonial.text}"</p>
                  <p className='font-bold text-gray-900'>- {testimonial.author}</p>
                  <div className='flex items-center mt-2'>
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className='h-5 w-5 text-yellow-500'
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQs Section */}
        <motion.section
          initial='hidden'
          animate='visible'
          variants={fadeIn}
          className='py-16 bg-gray-100'
        >
          <div className='container mx-auto px-4'>
            <h2 className='text-3xl font-bold text-center mb-8'>Frequently Asked Questions</h2>
            <div className='space-y-6'>
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className='bg-white p-6 rounded-lg shadow-md'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <h3 className='text-xl font-bold mb-2'>{faq.question}</h3>
                  <p className='text-gray-600'>{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </>
  );
};

export default Loginpage;
