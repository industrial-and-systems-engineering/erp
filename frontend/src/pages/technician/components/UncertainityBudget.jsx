import React, { useState } from "react";

const UncertaintyBudget = ({ reading }) => {
  // Calculation functions for each reading
  console.log("Reading data:", reading);
  const calculateReadingMean = (readings) => {
    const numericReadings = ["r1", "r2", "r3", "r4", "r5"]
      .map((key) => parseFloat(readings[key]))
      .filter((val) => !isNaN(val) && val !== null);

    if (numericReadings.length === 0) return "";

    const mean = numericReadings.reduce((acc, val) => acc + val, 0) / numericReadings.length;
    return mean;
  };

  const calculateStdDev = (readings) => {
    const numericReadings = ["r1", "r2", "r3", "r4", "r5"]
      .map((key) => parseFloat(readings[key]))
      .filter((val) => !isNaN(val) && val !== null);

    if (numericReadings.length <= 1) return 0;

    const mean = numericReadings.reduce((acc, val) => acc + val, 0) / numericReadings.length;
    const squaredDiffs = numericReadings.map((val) => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / (numericReadings.length - 1);

    return Math.sqrt(variance);
  };

  const calculateStdUncertainty = (readings) => {
    const stdDev = parseFloat(calculateStdDev(readings));
    const numericReadings = ["r1", "r2", "r3", "r4", "r5"]
      .map((key) => parseFloat(readings[key]))
      .filter((val) => !isNaN(val) && val !== null);

    return numericReadings.length > 0 ? stdDev / Math.sqrt(numericReadings.length) : "";
  };

  const calculateUC = (reading) => {
    const u1 = parseFloat(reading.masterCertUncertainty) / 2 || 0;
    const u2 = parseFloat(reading.ducResolution) / (2 * Math.sqrt(3)) || 0;
    const u3 = parseFloat(reading.masterAccuracy) / Math.sqrt(3) || 0;
    const u5 = parseFloat(reading.stability) / Math.sqrt(3) || 0;
    const stdUncertainty = parseFloat(calculateStdUncertainty(reading)) || 0;

    const uc = Math.sqrt(
      Math.pow(stdUncertainty, 2) +
        Math.pow(u1, 2) +
        Math.pow(u2, 2) +
        Math.pow(u3, 2) +
        Math.pow(u5, 2)
    );
    return uc;
  };

  const calculateEDof = (reading) => {
    const stdUncertainty = parseFloat(calculateStdUncertainty(reading)) || 0;
    const combinedUncertainty = parseFloat(calculateUC(reading)) || 0;

    if (stdUncertainty === 0) return "N/A";

    return 4 * (Math.pow(combinedUncertainty, 4) / Math.pow(stdUncertainty, 4));
  };

  const calculateUE = (reading) => {
    const uc = parseFloat(calculateUC(reading)) || 0;
    const edof = parseFloat(calculateEDof(reading)) || 0;
    let kAt95CL = 2;

    if (edof < 30) {
      const tDistribution = {
        1: 12.71,
        2: 4.3,
        3: 3.18,
        4: 2.78,
        5: 2.57,
        6: 2.45,
        7: 2.36,
        8: 2.31,
        9: 2.26,
        10: 2.23,
        11: 2.2,
        12: 2.18,
        13: 2.16,
        14: 2.14,
        15: 2.13,
        16: 2.12,
        17: 2.11,
        18: 2.1,
        19: 2.09,
        20: 2.09,
        21: 2.08,
        22: 2.07,
        23: 2.07,
        24: 2.06,
        25: 2.06,
        26: 2.06,
        27: 2.05,
        28: 2.05,
        29: 2.05,
      };
      kAt95CL = tDistribution[Math.round(edof)] || 2;
    }

    const rNameValue = parseFloat(reading.rName) || 1; // Avoid division by zero
    if (reading.rUnit === "degC") {
      return (uc * kAt95CL).toFixed(4);
    }
    return (uc * kAt95CL).toFixed(4);
  };

  const [uncertaintyData, setUncertaintyData] = useState({
    sources: [
      {
        name: "Standard's- 1 Uncertainty from certificate",
        estimate: "",
        expandedUncertainty: "",
        distribution: "Type B,Normal",
        divisor: 2,
        standardUncertainty: parseFloat(reading.masterCertUncertainty) / 2 || 0,
        code: "U1",
        sensitivity: 1.0,
        contribution: parseFloat(reading.masterCertUncertainty) / 2 || 0,
        dof: "∞",
      },
      {
        name: "Standard's- 2 Uncertainty from certificate",
        estimate: "",
        expandedUncertainty: "",
        distribution: "Type B,Normal",
        divisor: 2,
        standardUncertainty: 0.0,
        code: "",
        sensitivity: 1.0,
        contribution: 0.0,
        dof: "",
      },
      {
        name: "Resolution of DUC",
        estimate: reading.ducResolution,
        expandedUncertainty: "",
        distribution: "Type B,Rectangular",
        divisor: 1.732,
        standardUncertainty: (parseFloat(reading.ducResolution) / (2 * Math.sqrt(3))).toFixed(4),
        code: "U2",
        sensitivity: 1.0,
        contribution: (parseFloat(reading.ducResolution) / (2 * Math.sqrt(3))).toFixed(4),
        dof: "∞",
      },
      {
        name: "",
        estimate: "",
        expandedUncertainty: "",
        distribution: "Type B,Rectangular",
        divisor: 1.732,
        standardUncertainty: 1.5e-1,
        code: "U3",
        sensitivity: 1.0,
        contribution: 1.501e-1,
        dof: "",
      },
      {
        name: "Master 1 Accuracy",
        estimate: reading.masterAccuracy,
        expandedUncertainty: "",
        distribution: "Type B,Rectangular",
        divisor: 1.732,
        standardUncertainty: 0.0,
        code: "",
        sensitivity: 1.0,
        contribution: 0.0,
        dof: "∞",
      },
      ...(reading.repeatibility && reading.repeatibility !== 0
        ? [
            {
              name: "Repeatability",
              estimate: reading.repeatibility,
              expandedUncertainty: "",
              distribution: "Type A",
              divisor: Math.sqrt(5).toFixed(4),
              standardUncertainty: "",
              code: "",
              sensitivity: "",
              contribution: "",
              dof: "",
            },
          ]
        : []),
      {
        name: "",
        estimate: "",
        expandedUncertainty: "",
        distribution: "Type A",
        divisor: "",
        standardUncertainty: parseFloat(calculateStdUncertainty(reading)).toFixed(2) || 0,
        code: "Ur",
        sensitivity: 1.0,
        contribution: parseFloat(calculateStdUncertainty(reading)).toFixed(2) || 0,
        dof:
          parseFloat(calculateEDof(reading)) < 30
            ? "∞"
            : parseFloat(calculateEDof(reading)).toFixed(2),
      },
    ],
    summary: {
      typeAUncertainty: parseFloat(calculateStdUncertainty(reading)).toFixed(2) || 0,
      combinedUncertainty: parseFloat(calculateUC(reading)).toFixed(2) || 0,
      effectiveDegreeOfFreedom: parseFloat(calculateEDof(reading)).toFixed(2) || 0,
      coverageFactor: parseFloat(calculateEDof(reading)) < 30 ? "∞" : 2,
      expandedUncertainty: parseFloat(calculateUE(reading)).toFixed(2) || 0,
      approximatedUncertainty: parseFloat(calculateUC(reading) / 100).toFixed(2) || 0,
    },
  });

  return (
    <div className='w-full overflow-x-auto'>
      <div className='text-center font-bold text-blue-600 border-b-2 border-green-600 py-2'>
        Uncertainty Budget
      </div>

      <table className='w-full border-collapse text-xs'>
        <thead>
          <tr className='bg-green-100'>
            <th className='border border-gray-300 p-1 text-left'>Source of Uncertainty</th>
            <th className='border border-gray-300 p-1'>Estimate</th>
            <th className='border border-gray-300 p-1'>Expended Uncerrtatinty</th>
            <th
              className='border border-gray-300 p-1'
              colSpan={2}
            >
              Probability Distribution
            </th>
            <th
              className='border border-gray-300 p-1'
              colSpan={2}
            >
              Standared Uncertainty
            </th>
            <th className='border border-gray-300 p-1'>Sensitivity coefficient</th>
            <th className='border border-gray-300 p-1'>Uncertainty Contribution</th>
            <th className='border border-gray-300 p-1'>Degre of Freedom</th>
          </tr>
          <tr className='bg-green-100 text-center'>
            <th className='border border-gray-300 p-1'>Xi</th>
            <th className='border border-gray-300 p-1'>xi</th>
            <th className='border border-gray-300 p-1'>± Δxi</th>
            <th className='border border-gray-300 p-1'>n</th>
            <th className='border border-gray-300 p-1'>Divisor</th>
            <th className='border border-gray-300 p-1'>u(xi)</th>
            <th className='border border-gray-300 p-1'></th>
            <th className='border border-gray-300 p-1'>ci</th>
            <th className='border border-gray-300 p-1'>ui(Y)</th>
            <th className='border border-gray-300 p-1'>V</th>
          </tr>
        </thead>
        <tbody>
          {uncertaintyData.sources.map((source, index) => (
            <tr
              key={index}
              className='bg-green-50'
            >
              <td className='border border-gray-300 p-1'>{source.name}</td>
              <td className='border border-gray-300 p-1 text-center'>{source.estimate}</td>
              <td className='border border-gray-300 p-1 text-center'>
                {source.expandedUncertainty}
              </td>
              <td className='border border-gray-300 p-1'>{source.distribution}</td>
              <td className='border border-gray-300 p-1 text-center'>{source.divisor}</td>
              <td className='border border-gray-300 p-1 text-center bg-cyan-200'>
                {source.standardUncertainty}
              </td>
              <td className='border border-gray-300 p-1 text-center'>{source.code}</td>
              <td className='border border-gray-300 p-1 text-center'>{source.sensitivity}</td>
              <td className='border border-gray-300 p-1 text-center bg-cyan-200'>
                {source.contribution}
              </td>
              <td className='border border-gray-300 p-1 text-center'>{source.dof}</td>
            </tr>
          ))}
          <tr>
            <td
              colSpan='4'
              className='border border-gray-300 p-1 font-bold'
            >
              Actual Mesured value
            </td>
            <td
              colSpan='6'
              className='border border-gray-300'
            ></td>
          </tr>
        </tbody>
      </table>

      <table className='w-full border-collapse text-xs'>
        <tbody>
          <tr>
            <td className='border border-gray-300 p-1 w-1/2'>Type A Uncertainity uA</td>
            <td className='border border-gray-300 p-1 bg-cyan-200 text-center'>
              {uncertaintyData.summary.typeAUncertainty}
            </td>
            <td className='border border-gray-300 p-1 text-center'>Ur</td>
            <td
              className='border border-gray-300 p-1'
              colSpan='3'
            ></td>
          </tr>
          <tr>
            <td className='border border-gray-300 p-1'>Combine uncertainty Uc</td>
            <td className='border border-gray-300 p-1 bg-cyan-200 text-center'>
              {uncertaintyData.summary.combinedUncertainty}
            </td>
            <td className='border border-gray-300 p-1 text-center'>Uc</td>
            <td
              className='border border-gray-300 p-1'
              colSpan='3'
            ></td>
          </tr>
          <tr>
            <td className='border border-gray-300 p-1'>Effective degree of Freedom,n</td>
            <td className='border border-gray-300 p-1 bg-cyan-200 text-center'>
              {Math.round(uncertaintyData.summary.effectiveDegreeOfFreedom)}
            </td>
            <td className='border border-gray-300 p-1 text-center'>Veff</td>
            <td
              className='border border-gray-300 p-1'
              colSpan='3'
            ></td>
          </tr>
          <tr>
            <td className='border border-gray-300 p-1'>Coverage factor K</td>
            <td className='border border-gray-300 p-1 bg-cyan-200 text-center'>
              {uncertaintyData.summary.coverageFactor}
            </td>
            <td
              className='border border-gray-300 p-1'
              colSpan='4'
            ></td>
          </tr>
          <tr>
            <td className='border border-gray-300 p-1'>Expended Uncertainty, U</td>
            <td className='border border-gray-300 p-1 bg-cyan-200 text-center'>
              {uncertaintyData.summary.expandedUncertainty}
            </td>
            <td className='border border-gray-300 p-1 text-center'>K×Uc</td>
            <td className='border border-gray-300 p-1 text-center bg-cyan-200'>
              {((calculateUE(reading) * 100) / calculateReadingMean(reading)).toFixed(4)}
            </td>
            <td className='border border-gray-300 p-1'>%</td>
          </tr>
          <tr>
            <td className='border border-gray-300 p-1'>Approximated Uncertainty,U</td>
            <td
              className='border border-gray-300 p-1 bg-cyan-200 text-center'
              colSpan='5'
            >
              {((calculateUE(reading) * 100) / calculateReadingMean(reading)).toFixed(2)}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UncertaintyBudget;
