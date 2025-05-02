import React from "react";
import { motion } from "framer-motion";

const IndustriesServed = () => {
  const industries = [
    {
      name: "Manufacturing",
      description: "Precision calibration for manufacturing equipment and quality control systems",
      icon: "🏭",
      clients: ["Dabur", "USHA", "IFB Industries Limited", "HAL"],
    },
    {
      name: "Technology & IT",
      description: "Calibration services for testing equipment and measurement devices",
      icon: "💻",
      clients: ["IBM", "CMS IT Services", "Siemens", "Schneider Electric"],
    },
    {
      name: "Defense & Aerospace",
      description: "High-precision calibration for critical defense and aerospace applications",
      icon: "🛡️",
      clients: ["Indian Coast Guard", "HAL", "NSIC"],
    },
    {
      name: "Energy & Utilities",
      description: "Calibration for measurement and control equipment in energy production",
      icon: "⚡",
      clients: ["ONGC", "Marathon", "Yokogawa"],
    },
    {
      name: "Infrastructure",
      description: "Calibration services for construction and infrastructure development",
      icon: "🏗️",
      clients: ["Bengal Aerotropolis", "Berger Paints", "PwC"],
    },
  ];

  const clientLogos = [
    {
      name: "Bengal Aerotropolis",
      src: "https://bengalaero.com/wp-content/uploads/2023/11/Logo-1-1.png",
    },
    {
      name: "IBM",
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAWCAMAAACi/q9qAAAAYFBMVEX///8AWLmgut/V3/CxxuQEab8AWroAWbmzx+X09/sLa7/l6/bF1OoAVrjg6PREgMcAZb2rweLM2e0AT7YAS7Xt8fhXi8sAXruVstuNrNkASLTA0Okpc8Jsl9CGqNcAYrx2yjtWAAABVUlEQVQ4jZ2U65KDIAyFY0Vpq+CV6i52ff+3bBIC0h+76/SbTjm50B4EhCqxwbof0f2hANkkXBpglliHywGMl5yVZqao5Hl2Tc0fU0RMD19T8cY0wG5Ez/SXbk41UEpdCRyglECpIJSHq5SviibaGCh+ADciOkiahEvlkHWHJHqjTSd6mLSeLbV/a42GkM5oYh7BzqxwUYEWGUU3qD3/oo/ZsWW85SITmxEXnVJgCRo55ZqABSuqiVaLOrNaJ8wTgtW62Dbs+TG13imqpLlErGhXZoSUJdlIytqjcGoixFQ+8YTVHjaDGb1AbvXMw5FH5CSS7fCtT9vhs+0I2RHLbdgen6J/DoCRA0BbTsM9RcHer0fulon3AUAl8JAP6h0+5KGGZtRAK5DS39fqIteKzT2njo3LtfqYk68Oal15aTFxj9DLqhdJnwetCF9WUqPl0dejCj0vB6sar5AEc4gAAAAASUVORK5CYII=",
    },
    {
      name: "CMS IT Services",
      src: "https://www.cmsitservices.com/wp-content/uploads/2020/10/cms-logo-gray.svg",
    },
    {
      name: "Dabur",
      src: "data:image/png;base64,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",
    },
    {
      name: "ONGC",
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAclBMVEWkHSP///+eAACfAACkHCKbAACiFBujGB+iERmXAADQn6CiDxegAA738PDy5ubt3Nzdu7vkycr79/egAAnn0dHAeXq9cXO3YWPGiInZsrOnLDDJkJGrPUC6aWvNmJmzVVewTE+pNTmuREfTp6elJCnDgIJEUKeYAAAC0UlEQVQ4jX2V6barKgyASZgqMirOtdbavv8rXtB2r5693Dc/xBU+Q0IGCdmF0ZqRf6VELPMqKOqPjrGn9fgvWbbWtokUi7P9QTK8IF6rhv8IIucF3G6Q3gvrZxAyc9KAjwAwwEdieL80nzU7IeZQQGNvgQNvbLF0Cyw49k0IfpAThxE6w/ejdWFgNiog3J0LFhx0uDpwCXyAT/bmCjN3aYcCjFWBQrdxaG0DyxBHuO3gdBUfUK5gzKvaYlElfjHJke6ePFYxeArW3GGGHSSi7JCMz1HSdV1LpOUoS73ic3w+hbheyUpG+b5GwZhkLMUvpaD1cl/ulCbdoUpbkvwWhl10Q6+8Cw/6O1VfIusQRuRTnxIQf6fqmxO2Q8nI4CmR2Li/bDK0j5SByzy4Z0LqLuI5WA+vnHytBpergVA1lacGpdszRcPglD5OODWpb6/dAMYhDvWuUc2ZSRp1dp6xBPojZ9dQn4DoaF5SLD4OD3l8S08t0uO8ycepL/8G8dDSOPvY+fr/LKYWQCzM1cfRFvmdhbOwtbIuS/UMkYPNUr3OomaibZq2nbvWx3me2ySdPuFyg27bdgOz+ahMNSmlOnEKkovWPKpC+fyIXOs/uOznNpSpzcKtKrft/NxD6piCniC1lClOs/Ij9Kpk7nh2u55dIck9sy+pyMduWZZRS/beYV/lW6aqF5j7S9cEqRAaZarxFEsackz/VHq5jxi76hck/2CqL3OVVnMXuM+j8CERjFIDeGxy31ewogWlNnB4B6dUgPZIECOw8TSAIm9g4thCy8FzWrym9OVC62doLzson7Al14xL4HK5dDuY+MpmhSCCv280W0TNd4vdB+R3b0wGqSbDLD4+2r6/7T6+QVP1fQ8RFwh97+FTRLrPsVUPvYMzNOncLMsF99Hrfn4EGq+PEQWTeVanBytxfayYQqB5nH3NljzHjsy8n1nBvnYI+Q+dly/WbV6DQgAAAABJRU5ErkJggg==",
    },
    {
      name: "USHA",
      src: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIACgAKAMBEQACEQEDEQH/xAAaAAEAAgMBAAAAAAAAAAAAAAAABgcDBAUC/8QAKRAAAQMEAAUCBwAAAAAAAAAAAQIDBAAFERIGEyExUSJhFBUWMkFxof/EABoBAQACAwEAAAAAAAAAAAAAAAABAgMEBQb/xAApEQABAwIFAwMFAAAAAAAAAAABAAIDBBESEyFBUSJhcQWRwRQVMULR/9oADAMBAAIRAxEAPwC8aIlESiJREoiURKIlESiJRFV863RrlxXdhJUklu4xwsKk8rDBR68eoZ7Dt18VpOaHSOvyPZerinfBRxYd2u2v1X02P8XBsbUaXcWGJe7rHIe5aefqNuYrU/enYewUCaxMAJsV0atz44nOZobtvpfYX2NvNlmYixPqP5e4+FW/4/QlEhWmuij0XnP9/FSAMeHa6o+ST6XOA68PAv8AkbLVuzUWKy0LbLdebdt6FuOklJUsvAZKSTqcAdKq4ADpO3ystM6SRxMzQCHGw7YebC/lSX4O1ROI7ObQ4jYXJbLgbkuOZSEgjbc9+p7dKzYWh7cPK5WbUSUsueP0BGgG+1vnVTqVw9ZZkhciVaobzyzlTi2Ukq/ZraMTCbkLgR11VG0MZIQB3Kxq4XsKkpSqzwSEDCQWE9BnPj3qMpnCsPUasEkSu9yn0xYeXy/k8HTO2vITjPntTKj4T7jV3vmuv5KJ4XsKQoJs8EBYwoBhPUZB8eQKZUfCH1GrNiZXadyvcbhyyRH0PxrVDaebOULQykFJ9jUiJgNwFElfVSNLXyEg9yupV1qJREoiURKIv//Z",
    },
    {
      name: "Siemens",
      src: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Siemens-logo.svg",
    },
    {
      name: "Indian Coast Guard",
      src: "https://upload.wikimedia.org/wikipedia/en/0/0c/Indian_Coast_Guard_Logo.png",
    },
    {
      name: "HAL",
      src: "https://hal-india.co.in/assets/images/logo.png",
    },
    {
      name: "Berger Paints",
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAfCAMAAACF8f6iAAABO1BMVEX///8AAADExdH07pv89qr89qT99rP89rn7+cD8+cX8+sjr6+vj4+P4+PjOzs7GxsZiYmLZ2dn38ai0s77scqYAAEnV1Nq7u7qbm5uhoaGTk5PAv8lpZYU/Pz9VVVVqamqrq6uLi4szMzN1dXXvytP67fCrp4rFv4i0sZ/u6KC8uJa7tofAu5LNyJja1JfQy5KjnYWMiaPk3rCLhX6ko7TGwqRRTHEAAFGKaIz6o8X2lsL4v77/8r5wbHhFQGwhGFwjIV+DTX3xg7CRYJKTr8WaP3fuTo3xYZlTI2Xx8NUAULXa49APJmDFHlrbGljjOXeXKWzPzrvD0eUAWbODIFviDlCJAFAAADlmAFLI1s6817/S3+o2AEqfsqtnp3oAeSExj1Wbwad5dpEdHR00LmHijaTWYoPoqLnsusfd2Ee8AAACzklEQVQ4jZWSCVfTQBDHZ2pbtLubNIRme6QhSRMERbE1BkGl9UI5FUVRwaulTb//J3C3LZiDh8//y9t2duY3Ozs7AFK5/xHEtHQjq8JkKWT2b5sxcLmQ0sqdu6v37q+tLS2tpV2rcdAu5JOaX5kXX35eKOXJP2jHwWJWnU5+bq6Yz6e28w+DGKgX51J6FK4/3tjc3Nx48rSTcBSf6XHwZlpb3d7zBaEXGy8rnYQnNGJgo3QroVclp9t7vb29/WbhbcUWztJlQKlHY2BupxTX3u5evbt/cHj47v0+3+G8dLTsHF04KywGGvEsAB8+nva7x58OP2/pqtnrM1a1oT7zsZN4JDUSINul68cHX8IgMPWv3wC4pqpyW55FuolINQHCaXB2Zgb98PuPn7/2AGqsWlO5zWuyuK1EZEMuKFWdbgQUKg34LShQlDpVazatK9LXMBOgfBuGTSAuMkiKcso459rMDNoZkGILwEJxjVazBbxJFutQc0U2sK2mojl1RfigHWRAFR1iIwcNlTIyCx3klgsim1VWsEWxjhLs6xnQlle0NBiUoVyG5qAJHFWCNY6EIFUQJx0McxnQQU3cEzVslR3ZKSLrFuwi2i4VaVuTyHMjA5ZFKLjIscWAAVoCdgVLXVRmaaVOWAZ0kdIqWhQdUFsEbQFaokAm+2WRRZxGJgZn8o5k8oziNEusolOaPGUg4gUsjIE1CSSVFBgvgLDpeDGggGXxKyeZTH3GeRI0CGSl2qI3yfFPD056yqeS76Ok9vR+0iYz0Bt6Y8/zfH9SunYxZ543HnmTf0FycIDN7MgfRdHIHw6H48j3fOYzz4vG0vSmXTCTgyMuGYb9wLhokcf8KILhaCi+KBp7viyqEZjrlVCDjEguMEOz3bhsB2PM92WFmt4OK71Y4qtk6P0wbOuzOzMjMHuVv/a/RBttUbo4pmsGuate6lox47rS/gA4T1oJU9lgugAAAABJRU5ErkJggg==",
    },
    {
      name: "PwC",
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAArCAMAAAAaGrsZAAAAzFBMVEX///8AAADYVgTzvibZ2dnunDTjchzbXQytGwLUnpupAACmAAD8+PjbThjo6Oh9fX3XUADpkBXnihPyuwb76sbxyr3OTgTAQgPCIwPbsK/zvRz0xCfeYBriv73vurCsrKyhoaGHh4f10cDiawD2zWzSOg3iYX3maqXZQwDjsa/Dw8OZmZlERESQkJAXFxctLS353sXtkwD0wIzyuYDsnED87tPLQAC9MwDmd4fqg7O+BgDQKwDhV3byv8n0wti3SkHMh4S0PzZWVlZoaGgjFocTAAABmklEQVRIie2U21LCMBBAE4miUFLwjqgpIoK9UC+IIora/v8/ubtNBS3UtuoMD54HMmX3bDabaRn7nqvGuuY6Q/ZviGedDU3n5na1xb16WbM2HJ4jd1nFNU29sX0E7OwWEEvACoujfaSAeH+A/ExslFqtVlbxpLKJHAK10TFQfhiPc4rdbg3oX/R6hcT6n4vVCvIITCZ95ClNbG590CQugdOI5+l0ufhS0VRfs7Q1460ak1M0ZuQT/0GkE0imzLbAB8O2cBWWBbP0XJvioRuqhNbmgIc/XDFaLfjX51wyCQ8GJVic+19Fz4RA6AWoSNtySbR4LErwBozpep8QlMQcWNqMmZhh8FgMJHViLBPxWLC4JCoW8oEWDScq67lm4pCx6NM5UBRckai4DTVIXMScqHf0XdxeSmw91NEUEYdLog9boDiAOjQmL1VUUU84Y5OqBBzfChwO1ZWJmyTRQA9vG8Voe90hBui6wkUi4lIiTZVER8dVFA4TJ0XRlkK/rVJQghBzecK2F81HLJ9bOkVFGosq8Flxo7Pn9t4BMV8vmuTBjwsAAAAASUVORK5CYII=",
    },
    {
      name: "Yokogawa",
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAwCAMAAABzC0lBAAAAtFBMVEX//////wAAAAD//+r//+fm5ef//9///+H//9H//8///8v///3Gx8SxsrDt7e4/PkH5+fr//9X//+7//8L//67//6f//2X//xv//0H//6D//2r//zD//1T///j//4j//3T//5VNT0p0dXIVFxLY2NdeX1wgIxmHiIWanJc5PTJ/gHszNi28vbqgn6JkY2ZXWFQOCRNHR0dvbnEuLDNSUVI8PTkmJScbGh0PDg81NTaWk5e5t7w4tueQAAABpElEQVRIie3U23LaMBQF0K1TRJpUltWkubWlKbZUqUSYhhIS7P//r0owk5ZLjK2XvHTPGDNj1jlIsgT8T1KGwzQ3YGyQ6Bg76e/esXU+JjrG3ie6nvIfx9hpomPsLNF1lnuuozzfd53kgX4xF4mOsU+JjrHLNjd43bXLqzZ4fd4ihzevumPTc3uYff5wxIWmh9yROd1k9GXPdd2VX3dc93NgW/Y5eW4SHUbXL67zbtzk5R267eeAi4276uuAb2t4fN33E5ezx0H1NyeM3aU44DsbpUG07t03CicJjH1BZYZCQ4yloR8CsEQO8D8xEcgs+Az3fltOx3DVrIb6pR+0IFU2kMTdHPjtMct9VmBBcFbkjzs9F5Y4hbsvjCWll7FY/STjI/XMHyVhmUuj5zrX21CR4PHXojKrPNMm1ggV8PxkfSVJLn0xzQik7WSnZageB2qnCx2KUHjVjH8Iw5xOqsJWri49L41e1TXtQOJoyBVLrAQE1aUzOTQ5R4bW/yd0p2yeAVW2DbUCZBNacBUv2cSxqKZRmsdpV+FTIn5Vst+KvX3+AEC1HoxZjXVhAAAAAElFTkSuQmCC",
    },
    {
      name: "Schneider Electric",
      src: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIABAAOAMBEQACEQEDEQH/xAAaAAACAgMAAAAAAAAAAAAAAAABBAMHAAIF/8QAKxAAAQMCBAQFBQAAAAAAAAAAAQIDEQQhAAUSMSJBcYETFFGR8SNSYcHR/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAIBA//EAB8RAQACAgICAwAAAAAAAAAAAAEAAgMREkExMhMUIf/aAAwDAQACEQMRAD8AutyoabnWsCFab+tv6MTsIUJnmGeKHAdIkgX+d8NkbIG6lp1J8NYKgJ0mxHb2wEYEYrWZvS0VY1S1JKC42XPEUUpQAJm5Ik22AMc8FB1OV81aWKsCM8y5S1IVUBtaV6dLlifz0sfbDkTfnp43NF5/lqQooqEuhIB+mQqZnYTPKZ2gjGciT9jH0xmmzOhq3A3TVTTqyNQCDNvXpjdjLrlpb1dyZdOy4VFaArVvJw0StEHlmPsG0doj9YaI4kKWW0JVoSASDcmSZ+BjdTQCRVWX0dYpKqphDpSIGq458u598EGTbHS/sTkuZI8uufc1NJZ0qDQ1qVMgDiSRG+ozcmR3nj+zg4FsvUYTkjIJHg0ugWRwkEJGyelzba49MbxlGAOiNUFAiiWfDQylJQE8AIiNh0EmBywDUumMp4n/2Q==",
    },
    {
      name: "IFB Industries Limited",
      src: "https://upload.wikimedia.org/wikipedia/en/1/1a/IFB_Industries_logo.svg",
    },
    {
      name: "Marathon",
      src: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Marathon_Petroleum_Logo.svg",
    },
    {
      name: "NSIC",
      src: "https://upload.wikimedia.org/wikipedia/en/0/0a/National_Small_Industries_Corporation_logo.png",
    },
  ];

  return (
    <div className='bg-gradient-to-b from-white to-blue-50 py-20 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-3xl font-extrabold text-gray-900 sm:text-4xl'>Industries We Serve</h2>
          <p className='mt-4 text-xl text-gray-600 max-w-3xl mx-auto'>
            Delivering precision calibration services across diverse sectors
          </p>
        </motion.div>

        <motion.div
          className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              className='bg-white rounded-lg shadow-md overflow-hidden'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className='bg-blue-600 text-white p-4'>
                <div className='flex items-center'>
                  <span className='text-2xl mr-3'>{industry.icon}</span>
                  <h3 className='text-xl font-semibold'>{industry.name}</h3>
                </div>
              </div>
              <div className='p-4'>
                <p className='text-gray-600 mb-4'>{industry.description}</p>
                <div className='text-sm text-gray-500'>
                  <p className='font-medium mb-2'>Trusted by:</p>
                  <div className='flex flex-wrap gap-2'>
                    {industry.clients.map((client, idx) => (
                      <span
                        key={idx}
                        className='bg-gray-100 px-2 py-1 rounded'
                      >
                        {client}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className='mb-12'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className='text-2xl font-bold text-gray-900 text-center mb-8'>Our Trusted Clients</h3>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 items-center'>
            {clientLogos.map((client, index) => (
              <motion.div
                key={index}
                className='bg-white p-3 rounded-lg shadow-sm flex items-center justify-center h-20'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                whileHover={{ y: -3, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
              >
                <img
                  src={client.src}
                  alt={client.name}
                  className='max-h-14 max-w-full object-contain'
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className='bg-white rounded-lg shadow-lg p-8'
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className='text-2xl font-bold text-gray-900 text-center mb-8'>
            Why Leading Companies Choose Our Calibration Services
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-blue-50 p-5 rounded-lg'>
              <div className='text-blue-600 text-4xl mb-4'>🏆</div>
              <h4 className='text-lg font-semibold mb-2'>Industry-Specific Expertise</h4>
              <p className='text-gray-600'>
                Tailored calibration solutions designed for the unique requirements and standards of
                each industry
              </p>
            </div>
            <div className='bg-blue-50 p-5 rounded-lg'>
              <div className='text-blue-600 text-4xl mb-4'>⚙️</div>
              <h4 className='text-lg font-semibold mb-2'>Comprehensive Service Range</h4>
              <p className='text-gray-600'>
                From electrical and dimensional to pressure and thermal calibration, covering all
                measurement needs
              </p>
            </div>
            <div className='bg-blue-50 p-5 rounded-lg'>
              <div className='text-blue-600 text-4xl mb-4'>🔄</div>
              <h4 className='text-lg font-semibold mb-2'>Reliable Support</h4>
              <p className='text-gray-600'>
                Consistent, accurate calibration services with quick turnaround times to minimize
                equipment downtime
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default IndustriesServed;
