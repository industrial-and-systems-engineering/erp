// Calculation functions for each reading
export const calculateReadingMean = (readings) => {
    const readingValues = ["r1", "r2", "r3", "r4", "r5"]
        .map((key) => readings[key])
        .filter((val) => val !== "" && val !== null);

    if (readingValues.length === 0) return "";

    // Find the maximum number of decimal places in any reading
    const maxDecimalPlaces = readingValues.reduce((max, val) => {
        const decimalPart = String(val).split('.');
        const decimalDigits = decimalPart.length > 1 ? decimalPart[1].length : 0;
        return Math.max(max, decimalDigits);
    }, 0);

    // Calculate the mean
    const numericReadings = readingValues.map(val => parseFloat(val)).filter(val => !isNaN(val));
    if (numericReadings.length === 0) return "";

    const mean = numericReadings.reduce((acc, val) => acc + val, 0) / numericReadings.length;

    // Round to the maximum number of decimal places
    return Number(mean.toFixed(maxDecimalPlaces));
};

export const calculateStdDev = (readings) => {
    const numericReadings = ["r1", "r2", "r3", "r4", "r5"]
        .map((key) => parseFloat(readings[key]))
        .filter((val) => !isNaN(val) && val !== null);

    if (numericReadings.length <= 1) return 0;

    const mean = numericReadings.reduce((acc, val) => acc + val, 0) / numericReadings.length;
    const squaredDiffs = numericReadings.map((val) => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / (numericReadings.length - 1);

    return Math.sqrt(variance);
};

export const calculateStdUncertainty = (readings) => {
    const stdDev = parseFloat(calculateStdDev(readings));
    const numericReadings = ["r1", "r2", "r3", "r4", "r5"]
        .map((key) => parseFloat(readings[key]))
        .filter((val) => !isNaN(val) && val !== null);

    return numericReadings.length > 0 ? stdDev / Math.sqrt(numericReadings.length) : "";
};

export const calculateUC = (reading) => {
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

export const calculateEDof = (reading) => {
    const stdUncertainty = parseFloat(calculateStdUncertainty(reading)) || 0;
    const combinedUncertainty = parseFloat(calculateUC(reading)) || 0;

    if (stdUncertainty === 0) return "N/A";

    return 4 * (Math.pow(combinedUncertainty, 4) / Math.pow(stdUncertainty, 4));
};

export const calculateUE = (reading) => {
    const uc = parseFloat(calculateUC(reading)) || 0;
    const edof = parseFloat(calculateEDof(reading)) || 0;
    const mean = parseFloat(calculateReadingMean(reading)) || 0;
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
    if (reading.rUnit === "°C") {
        return (uc * kAt95CL).toFixed(4);
    }
    return ((uc * kAt95CL * 100) / mean).toFixed(4);
};