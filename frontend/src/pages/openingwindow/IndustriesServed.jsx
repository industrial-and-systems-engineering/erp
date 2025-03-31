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
      src: "data:image/png;base64,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",
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
