import React, { useState } from "react";
import { motion } from "framer-motion";

const Services = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const serviceCategories = [
    {
      id: "electro-technical",
      title: "Electro–Technical Calibration",
      icon: "⚡",
      services: [
        { name: "Calibration of Volt meters(AC/DC)", category: "Electrical Measurement" },
        { name: "Universal calibrator", category: "Electrical Measurement" },
        { name: "Calibration of Watt meters", category: "Electrical Measurement" },
        { name: "Calibration of Current transformer Dimmer", category: "Electrical Measurement" },
        { name: "Frequency Meter", category: "Electrical Measurement" },
        { name: "mA meter", category: "Electrical Measurement" },
        { name: "Insulation tester (Dig./Analogue)", category: "Electrical Measurement" },
        { name: "Earth tester", category: "Electrical Measurement" },
        { name: "Calibration of ammeter", category: "Electrical Measurement" },
        { name: "AC power source", category: "Power Sources" },
        { name: "Frequency meters", category: "Electrical Measurement" },
        { name: "DC power source", category: "Power Sources" },
        { name: "Resistance decade box", category: "Resistance Measurement" },
        { name: "Resistance meter", category: "Resistance Measurement" },
        {
          name: "Calibration of Multimeter(Digital, Analogue)",
          category: "Electrical Measurement",
        },
        { name: "Calibration of Clamp meter", category: "Electrical Measurement" },
        { name: "Leakage current meter", category: "Electrical Measurement" },
        { name: "Megger", category: "Electrical Measurement" },
        { name: "Digital Insulation tester", category: "Electrical Measurement" },
        { name: "Capacitance meter", category: "Electrical Measurement" },
        { name: "Earth resistance tester", category: "Electrical Measurement" },
        { name: "Multifunction calibrators(5.5 digit)", category: "Calibration Equipment" },
        { name: "Calibration of pH meter", category: "Analytical Instruments" },
        { name: "Calibration of Conductivity meter", category: "Analytical Instruments" },
        { name: "Energy meter", category: "Electrical Measurement" },
        { name: "Power meter", category: "Electrical Measurement" },
        { name: "Power factor meter", category: "Electrical Measurement" },
        { name: "Temperature simulation", category: "Temperature" },
        { name: "Oscilloscope", category: "Electrical Measurement" },
        { name: "kV meter", category: "Electrical Measurement" },
        { name: "V–A–W meter", category: "Electrical Measurement" },
        { name: "Handy calibrator", category: "Calibration Equipment" },
        { name: "Micro ohm meter", category: "Resistance Measurement" },
        { name: "Milli ohm meter", category: "Resistance Measurement" },
        { name: "Process source", category: "Calibration Equipment" },
        { name: "Temperature Calibrator", category: "Temperature" },
        { name: "Temperature Controller/Temperature Indicator", category: "Temperature" },
        { name: "HIGH VOLTAGE TEST SET", category: "Electrical Measurement" },
        { name: "LCR meter", category: "Electrical Measurement" },
        { name: "INDUCTANCE METER", category: "Electrical Measurement" },
      ],
    },
    {
      id: "pressure",
      title: "Pressure Calibration",
      icon: "🔧",
      services: [
        { name: "Pressure gauges", category: "Pressure Measurement" },
        { name: "Differential pressure gauge", category: "Pressure Measurement" },
        { name: "Calibration of Manometer", category: "Pressure Measurement" },
        { name: "Pressure recorders", category: "Pressure Measurement" },
        { name: "Safety valve", category: "Pressure Measurement" },
        { name: "Compound gauge", category: "Pressure Measurement" },
        { name: "Pressure transmitters", category: "Pressure Measurement" },
        { name: "Safety switches", category: "Pressure Measurement" },
        { name: "Dead weight tester", category: "Pressure Measurement" },
        { name: "Calibration of Pressure transducers", category: "Pressure Measurement" },
        { name: "Vacuum gauges", category: "Pressure Measurement" },
        { name: "Calibration of Magnahilic gauge", category: "Pressure Measurement" },
        { name: "Pressure switches", category: "Pressure Measurement" },
        { name: "Digital pressure gauge", category: "Pressure Measurement" },
        { name: "Vacuum transducer", category: "Pressure Measurement" },
      ],
    },
    {
      id: "dimension",
      title: "Dimension Calibration",
      icon: "📏",
      services: [
        { name: "Outside micrometers", category: "Length Measurement" },
        { name: "'V' block", category: "Dimensional Tools" },
        { name: "Standard wire gauge", category: "Dimensional Tools" },
        { name: "Digital outside micrometers", category: "Length Measurement" },
        { name: "Measuring Pins", category: "Dimensional Tools" },
        { name: "Thread ring gauge", category: "Dimensional Tools" },
        { name: "Inside micrometers", category: "Length Measurement" },
        { name: "Calibration of Radius gauges", category: "Dimensional Tools" },
        { name: "Calibration of Feeler gauges", category: "Dimensional Tools" },
        { name: "Vernier calipers", category: "Length Measurement" },
        { name: "Coating thickness gauges", category: "Dimensional Tools" },
        { name: "Key way gauge", category: "Dimensional Tools" },
        { name: "Calibration of Dial vernier caliper", category: "Length Measurement" },
        { name: "DFT gauges", category: "Dimensional Tools" },
        { name: "Bench Center", category: "Dimensional Tools" },
        { name: "Digital vernier caliper", category: "Length Measurement" },
        { name: "Plain plug gauges Go & No Go end", category: "Dimensional Tools" },
        { name: "Linear probe / LVDT", category: "Dimensional Tools" },
        { name: "Vernier Depth gauge", category: "Length Measurement" },
        { name: "Thread plug gauges Go & No Go end", category: "Dimensional Tools" },
        { name: "Sine bar", category: "Dimensional Tools" },
        { name: "Vernier height gauges", category: "Length Measurement" },
        { name: "Paddle gauges Go & No Go end", category: "Dimensional Tools" },
        { name: "Slip gauge set", category: "Dimensional Tools" },
        { name: "Dial height gauge", category: "Length Measurement" },
        { name: "Thread pitch gauges", category: "Dimensional Tools" },
        { name: "Engineer's Spirit level", category: "Dimensional Tools" },
        { name: "Digital height gauge", category: "Length Measurement" },
        { name: "Snap gauges", category: "Dimensional Tools" },
        { name: "Micrometer Head", category: "Dimensional Tools" },
        { name: "Calibration of Dial indicators", category: "Length Measurement" },
        { name: "Grove gauges", category: "Dimensional Tools" },
        { name: "Inside dial caliper gauge", category: "Length Measurement" },
        { name: "Calibration of Dial gauges", category: "Length Measurement" },
        { name: "Length gauges", category: "Length Measurement" },
        { name: "Digital Extensometer", category: "Length Measurement" },
        { name: "Welding gauges", category: "Dimensional Tools" },
        { name: "Taper plain plug gauges Go & No end", category: "Dimensional Tools" },
        { name: "Engineering Square", category: "Dimensional Tools" },
        { name: "Test sieve", category: "Dimensional Tools" },
        { name: "Pistol Caliper", category: "Length Measurement" },
        { name: "Bore gauge", category: "Dimensional Tools" },
      ],
    },
    {
      id: "force-mass",
      title: "Force / Mass Calibration",
      icon: "⚖️",
      services: [
        { name: "Weighing balances", category: "Mass Measurement" },
        { name: "Tablet hardness tester", category: "Force Measurement" },
        { name: "testing machine", category: "Force Measurement" },
        { name: "Weighing scale", category: "Mass Measurement" },
        { name: "Shore A hardness tester", category: "Force Measurement" },
        { name: "Weights - E2 class Calibrated weights Burettes", category: "Mass Measurement" },
        { name: "Load cell", category: "Force Measurement" },
        { name: "Shore D hardness tester", category: "Force Measurement" },
        { name: "Universal tensile testing machine", category: "Force Measurement" },
        { name: "Load indicator", category: "Force Measurement" },
        { name: "Weight Calibration", category: "Mass Measurement" },
        { name: "Screw drivers", category: "Force Measurement" },
        { name: "Tension meter Spring balance", category: "Force Measurement" },
        { name: "Glass wares", category: "Mass Measurement" },
        { name: "Duro meter", category: "Force Measurement" },
        { name: "Torque wrench", category: "Force Measurement" },
        { name: "Micropipette", category: "Volume Measurement" },
        { name: "Hardness tester", category: "Force Measurement" },
        { name: "Volume", category: "Volume Measurement" },
      ],
    },
    {
      id: "timer",
      title: "Timer",
      icon: "⏱️",
      services: [
        { name: "Hour meter", category: "Time Measurement" },
        { name: "Stop watch", category: "Time Measurement" },
      ],
    },
    {
      id: "thermal",
      title: "Thermal Calibration",
      icon: "🌡️",
      services: [
        { name: "Glass Thermometer", category: "Temperature Measurement" },
        { name: '"J" Type thermocouple', category: "Temperature Measurement" },
        { name: "Digital Temperature controller with RTD sensor", category: "Temperature Control" },
        { name: "Digital Thermometer", category: "Temperature Measurement" },
        { name: '"K" Type thermocouple', category: "Temperature Measurement" },
        { name: "Digital Temperature indicator with RTD sensor", category: "Temperature Control" },
        { name: "Digital Temperature controller with sensor", category: "Temperature Control" },
        { name: "Pt-100 sensor", category: "Temperature Measurement" },
        { name: "Liquid temperature bath", category: "Temperature Control" },
        { name: "Temperature Recorder", category: "Temperature Measurement" },
        { name: "Muffle Furnace", category: "Temperature Control" },
        { name: "Furnace", category: "Temperature Control" },
        { name: "Temperature Data Logger", category: "Temperature Measurement" },
        { name: "Oven", category: "Temperature Control" },
        { name: "BOD", category: "Temperature Control" },
        { name: "Temperature Gauge", category: "Temperature Measurement" },
        { name: "Incubator", category: "Temperature Control" },
        { name: "Freeze", category: "Temperature Control" },
        { name: "Digital Temperature Gauge", category: "Temperature Measurement" },
        { name: "Temperature bath", category: "Temperature Control" },
        { name: "COD", category: "Temperature Control" },
        { name: "Dry & Wet bulb thermometer", category: "Temperature Measurement" },
        { name: "Deep Freezer", category: "Temperature Control" },
        { name: "RTD sensor", category: "Temperature Measurement" },
        { name: "Temperature transmitter", category: "Temperature Measurement" },
      ],
    },
  ];

  const toggleCategory = (categoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };

  return (
    <div className='bg-gradient-to-b from-blue-100 to-purple-100 min-h-screen py-20 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <motion.h2
          className='text-4xl font-extrabold text-center text-gray-900 mb-12'
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Comprehensive Calibration Services
        </motion.h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
          {serviceCategories.map((category, index) => (
            <motion.div
              key={category.id}
              className='bg-white rounded-lg shadow-lg overflow-hidden'
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                className='bg-blue-600 text-white p-4 flex items-center justify-between cursor-pointer'
                onClick={() => toggleCategory(category.id)}
                whileHover={{ backgroundColor: "#2563EB" }}
              >
                <div className='flex items-center'>
                  <span className='text-2xl mr-3'>{category.icon}</span>
                  <h3 className='text-xl font-semibold'>{category.title}</h3>
                </div>
                <span className='text-xl'>{expandedCategory === category.id ? "−" : "+"}</span>
              </motion.div>

              {expandedCategory === category.id && (
                <motion.div
                  className='p-4'
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                    {category.services.map((service, idx) => (
                      <motion.div
                        key={idx}
                        className='text-gray-700 text-sm bg-gray-50 p-2 rounded border border-gray-200'
                        whileHover={{
                          scale: 1.02,
                          backgroundColor: "#f0f9ff",
                          borderColor: "#93c5fd",
                        }}
                      >
                        {service.name}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {expandedCategory !== category.id && (
                <div className='p-4'>
                  <div className='grid grid-cols-2 gap-2'>
                    {category.services.slice(0, 6).map((service, idx) => (
                      <motion.div
                        key={idx}
                        className='text-gray-700 text-sm bg-gray-50 p-2 rounded border border-gray-200'
                        whileHover={{
                          scale: 1.02,
                          backgroundColor: "#f0f9ff",
                          borderColor: "#93c5fd",
                        }}
                      >
                        {service.name}
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    className='mt-3 text-blue-600 font-medium text-center cursor-pointer'
                    whileHover={{ scale: 1.05 }}
                    onClick={() => toggleCategory(category.id)}
                  >
                    + {category.services.length - 6} more services
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          className='mt-12 bg-white rounded-lg shadow-lg p-8'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h3 className='text-2xl font-semibold mb-6 text-center'>
            Why Choose Our Calibration Services?
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-blue-50 p-4 rounded-lg'>
              <h4 className='font-bold mb-2'>Comprehensive Range</h4>
              <p>
                From electrical and dimensional to pressure and thermal calibration, we offer a
                complete suite of services for all your calibration needs.
              </p>
            </div>
            <div className='bg-blue-50 p-4 rounded-lg'>
              <h4 className='font-bold mb-2'>Precision & Accuracy</h4>
              <p>
                Our state-of-the-art laboratory ensures the highest standards of precision for all
                calibration services.
              </p>
            </div>
            <div className='bg-blue-50 p-4 rounded-lg'>
              <h4 className='font-bold mb-2'>Expert Technicians</h4>
              <p>
                Our team of skilled professionals brings years of experience and technical expertise
                to every calibration task.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className='mt-8 text-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <p className='text-xl text-gray-700 italic'>
            "Precision is not just our goal, it's our standard."
          </p>
          <p className='mt-2 text-gray-500'>- Our Commitment to Excellence</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
