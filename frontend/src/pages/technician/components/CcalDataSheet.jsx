import React from "react";

const CcalDataSheet = ({ product, form }) => {
  // Compute header data directly from props
  const formData = {
    jobNo: product.jobNo,
    recDate: "2025-03-24",
    srfNo: form.srfNo,
    ulrNo: form.URL_NO,
    calibrationProcedure: "ET/Mech/Thermal",
    name: product.instrumentDescription,
    make: product.make,
    srNo: product.serialNo,
  };

  // Compute newData directly from props
  const newData = {
    Location: product.Location,
    sensorType: product.sensorType,
    resolution: product.resolution,
    roomTemp: product.roomTemp,
    humidity: product.humidity,
  };

  // Compute parameters with additional reading fields inline
  const parameters = product.parameters.map((param) => ({
    ...param,
    readings: param.readings.map((reading) => ({
      ...reading,
      masterCertUncertainty: 0,
      ducResolution: 0,
      masterAccuracy: 0,
      stability: 0,
    })),
  }));

  return (
    <div className='border-2 border-gray-300 rounded-lg p-4'>
      <h1 className='text-2xl font-bold text-center mb-6'>ERROR DETECTOR</h1>
      <form className='space-y-4'>
        {/* Header Information */}
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium'>Job No</label>
            <input
              type='text'
              value={formData.jobNo}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>Rec. Date</label>
            <input
              type='date'
              value={formData.recDate}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>SRF No</label>
            <input
              type='text'
              value={formData.srfNo}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>ULR No</label>
            <input
              type='text'
              value={formData.ulrNo}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />
          </div>
        </div>
        {/* Details of Item to be Calibrated */}
        <h2 className='text-lg font-bold mt-6'>Details of Item to be Calibrated</h2>
        <div className='grid grid-cols-2 gap-4 mt-4'>
          <div>
            <label className='block text-sm font-medium'>Name</label>
            <input
              type='text'
              value={formData.calibrationProcedure}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />

            <label className='block text-sm font-medium'>Make/Model</label>
            <input
              type='text'
              value={formData.make}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />
            <label className='block text-sm font-medium'>Sr. No.</label>
            <input
              type='text'
              value={formData.srNo}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>Location</label>
            <input
              type='text'
              value={newData.Location}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
              placeholder='Enter Location'
            />
            <label className='block text-sm font-medium'>Sensor Type</label>
            <input
              type='text'
              value={newData.sensorType}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
              placeholder='Enter Sensor Type'
            />
            <label className='block text-sm font-medium'>Resolution</label>
            <input
              type='text'
              value={newData.resolution}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
              placeholder='Enter Resolution'
            />
          </div>
        </div>

        {/* Environmental Conditions */}
        <h2 className='text-lg font-bold mt-6'>Environmental Conditions</h2>
        <div className='grid grid-cols-2 gap-4 mt-4'>
          <div>
            <label className='block text-sm font-medium'>Room Temp (°C)</label>
            <input
              type='text'
              value={newData.roomTemp}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />
          </div>
          <div>
            <label className='block text-sm font-medium'>Humidity (%)</label>
            <input
              type='text'
              value={newData.humidity}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />
          </div>
        </div>
        {/* Details of Master Used */}
        <h2 className='text-lg font-bold mt-6'>Details of Master Used</h2>
        <div className='grid grid-cols-4 gap-4 mt-4'>
          <div>
            <input
              type='text'
              value={"Name"}
              readOnly
              className='mt-1 block w-full rounded-md p-2'
            />
            <input
              type='text'
              value={"Equipment ID"}
              readOnly
              className='mt-1 block w-full rounded-md p-2'
            />
          </div>
          <div>
            <input
              type='text'
              value={formData.name}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />
            <input
              type='text'
              value={formData.equipmentId || ""}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />
          </div>
          <div>
            <input
              type='text'
              value={formData.name}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />
            <input
              type='text'
              value={formData.equipmentId || ""}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />
          </div>
          <div>
            <input
              type='text'
              value={formData.name}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />
            <input
              type='text'
              value={formData.equipmentId || ""}
              readOnly
              className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            />
          </div>
        </div>
        {/* Observation */}
        <h2 className='text-lg font-bold mt-6'>Observation</h2>
        <div>
          {/* Parameters Section */}
          {parameters.map((param, paramIndex) => (
            <div
              key={paramIndex}
              className='mt-6 border p-4 rounded-md'
            >
              <div className='grid grid-cols-4 gap-4 mb-4'>
                <div>
                  <label className='block text-sm font-medium'>Sl. NO.</label>
                  <input
                    type='text'
                    value={paramIndex + 1}
                    readOnly
                    className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium'>Parameter</label>
                  <input
                    type='text'
                    value={param.parameter}
                    readOnly
                    className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium'>Range & L.C</label>
                  <input
                    type='text'
                    value={param.ranges}
                    readOnly
                    className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium'>Accuracy</label>
                  <input
                    type='text'
                    value={param.accuracy}
                    readOnly
                    className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                  />
                </div>
              </div>

              {/* STD/DUC Readings */}
              <div className='overflow-x-auto'>
                <table className='w-full border-collapse border border-gray-300'>
                  <thead className='bg-gray-100'>
                    <tr>
                      <th className='border border-gray-300 p-2 text-left'>STD./DUC Reading</th>
                      <th className='border border-gray-300 p-2 text-left'>R1</th>
                      <th className='border border-gray-300 p-2 text-left'>R2</th>
                      <th className='border border-gray-300 p-2 text-left'>R3</th>
                      <th className='border border-gray-300 p-2 text-left'>R4</th>
                      <th className='border border-gray-300 p-2 text-left'>R5</th>
                      <th className='border border-gray-300 p-2 text-left'>MCU</th>
                      <th className='border border-gray-300 p-2 text-left'>DUCR</th>
                      <th className='border border-gray-300 p-2 text-left'>MA</th>
                      <th className='border border-gray-300 p-2 text-left'>St</th>
                      <th className='border border-gray-300 p-2 text-left'>Mean</th>
                      <th className='border border-gray-300 p-2 text-left'>Uc</th>
                    </tr>
                  </thead>
                  <tbody>
                    {param.readings.map((reading, readingIndex) => (
                      <tr
                        key={readingIndex}
                        className='hover:bg-gray-50'
                      >
                        <td className='border border-gray-300 p-2'>
                          <div className='flex space-x-2'>
                            <input
                              type='text'
                              value={reading.rName}
                              readOnly
                              className='w-1/2 border border-gray-300 rounded-md p-2'
                            />
                            <input
                              type='text'
                              value={reading.rUnit}
                              readOnly
                              className='w-1/2 border border-gray-300 rounded-md p-2'
                            />
                          </div>
                        </td>
                        <td className='border border-gray-300 p-2'>
                          <input
                            type='text'
                            value={reading.r1}
                            readOnly
                            className='w-full border border-gray-300 rounded-md p-2'
                          />
                        </td>
                        <td className='border border-gray-300 p-2'>
                          <input
                            type='text'
                            value={reading.r2}
                            readOnly
                            className='w-full border border-gray-300 rounded-md p-2'
                          />
                        </td>
                        <td className='border border-gray-300 p-2'>
                          <input
                            type='text'
                            value={reading.r3}
                            readOnly
                            className='w-full border border-gray-300 rounded-md p-2'
                          />
                        </td>
                        <td className='border border-gray-300 p-2'>
                          <input
                            type='text'
                            value={reading.r4}
                            readOnly
                            className='w-full border border-gray-300 rounded-md p-2'
                          />
                        </td>
                        <td className='border border-gray-300 p-2'>
                          <input
                            type='text'
                            value={reading.r5}
                            readOnly
                            className='w-full border border-gray-300 rounded-md p-2'
                          />
                        </td>
                        <td className='border border-gray-300 p-2'>
                          <input
                            type='text'
                            value={reading.masterCertUncertainty}
                            readOnly
                            className='w-full border border-gray-300 rounded-md p-2'
                          />
                        </td>
                        <td className='border border-gray-300 p-2'>
                          <input
                            type='text'
                            value={reading.ducResolution}
                            readOnly
                            className='w-full border border-gray-300 rounded-md p-2'
                          />
                        </td>
                        <td className='border border-gray-300 p-2'>
                          <input
                            type='text'
                            value={reading.masterAccuracy}
                            readOnly
                            className='w-full border border-gray-300 rounded-md p-2'
                          />
                        </td>
                        <td className='border border-gray-300 p-2'>
                          <input
                            type='text'
                            value={reading.stability}
                            readOnly
                            className='w-full border border-gray-300 rounded-md p-2'
                          />
                        </td>
                        <td className='border border-gray-300 p-2'>
                          <input
                            type='text'
                            value={reading.mean}
                            readOnly
                            className='w-full border border-gray-300 rounded-md p-2 bg-gray-100'
                          />
                        </td>
                        <td className='border border-gray-300 p-2'>
                          <input
                            type='text'
                            value={reading.uc}
                            readOnly
                            className='w-full border border-gray-300 rounded-md p-2 bg-gray-100'
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default CcalDataSheet;
