// Set of functions used to generate new test data with 950 gaussian samples and 50 anomalous samples, each with 100 dimensions

import { unprocessedData } from "$lib/stores";

function generateGaussianData(numberOfSamples:number=950, dimensions:number=100, mean:number[]=[], stdRange:[number,number]=[1,3]) {

    let gaussianData: number[][] = [];

    // For each column (dimension) in the data, generate samples from a gaussian distribution
    for (let i = 0; i < dimensions; i++) {
        const column = [];
        const colMean = mean[i];
        const colStd = getRandomInt(...stdRange);
        for (let j = 0; j < numberOfSamples; j++) {
            const u = 1 - Math.random(); // Subtraction to avoid taking log of zero
            const v = 1 - Math.random();
            const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
            column.push(z * colStd + colMean);
        }
        gaussianData.push(column);
    }

    // Transpose the data so that each row is a sample
    // https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript#:~:text=map(function%20(row%2C%20r,first%2C%20and%20then%20by%20row.&text=Another%20approach%20by%20iterating%20the,matrix%20by%20mapping%20inner%20values.
    gaussianData = gaussianData[0].map((_, colIndex) => gaussianData.map(row => row[colIndex]));

    return gaussianData;
}

// Helper function to get random integer between min (inclusive) and max (inclusive)
function getRandomInt(min:number=0, max:number=1) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateNewData(numberOfGaussianSamples:number=950, numberOfAnomalySamples:number=50, dimensions:number=100, clusters:number=1) {
    // Generate an array of random means for the gaussian data
    const means = []
    for (let i = 0; i < dimensions; i++) {
        means.push(getRandomInt(-i, i));
    }

    const gaussianData: number[][] = [];
    const anomalyData: number[][] = [];

    for (let i = 0; i < clusters; i++) {
        // Offset the means of each cluster by a random amount to make the clusters distinct
        const clusterMeans = means.map(mean => mean + getRandomInt(-i, i));
        gaussianData.push(... generateGaussianData(Math.round(numberOfGaussianSamples/clusters), dimensions, clusterMeans));
        anomalyData.push(... generateGaussianData(Math.round(numberOfAnomalySamples/clusters), dimensions, clusterMeans,[5,12]));
    }

    unprocessedData.set({
        expectedData: gaussianData,
        anomalousData: anomalyData
    });
}
