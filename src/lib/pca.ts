// Set of functions used to perform k-means clustering and PCA on unprocessed data

import { PCA } from "ml-pca";
import {processedData} from "$lib/stores";

// Utility functions to calculate the distance between two points
function calculateDistance(point1: number[], point2: number[]) {
    return Math.sqrt(point1.reduce((sum, value, index) => sum + Math.pow(value - point2[index], 2), 0));
}

// Takes in a single data point and a set of centroids (k) and returns the closest centroid's index
function assignCluster(dataPoint:number[], centroids:number[][]) {
    let clusterID = 0;
    let minDistance = calculateDistance(dataPoint, centroids[0]);

    for (let i = 1; i < centroids.length; i++) {
        const distance = calculateDistance(dataPoint, centroids[i]);
        if (distance < minDistance) {
            minDistance = distance;
            clusterID = i;
        }
    }

    return clusterID;
}

// Function which takes in a dataset, the number of clusters (k) and returns the current centroids
// Ran for a number of iterations or until the assignments no longer change
function updateCentroids(dataset: number[][], assignments:number[], k:number) {
    const dimension = dataset[0].length;
    const centroids = Array.from({ length: k }, () => Array(dimension).fill(0));
    const counts = new Array(k).fill(0);

    dataset.forEach((point, index) => {
        const clusterID = assignments[index];
        counts[clusterID]++;
        point.forEach((value, dim) => {
            centroids[clusterID][dim] += value;
        });
    });

    centroids.forEach((centroid, index) => {
        if (counts[index] > 0) {
            centroid.forEach((_, dim) => {
                centroid[dim] /= counts[index];
            });
        }
    });

    return centroids;
}

// Function to perform k-means clustering on a dataset
function kmeans(dataset: number[][], k:number) {
    const numSamples = dataset.length;
    const assignments = new Array(numSamples).fill(-1);
    let centroids = getRandomCentroids(dataset, k);
    let iterations = 0;
    let changed = true;

    while (changed && iterations < 20) {
        changed = false;
        iterations++;

        // Assign clusters
        for (let i = 0; i < numSamples; i++) {
            const newCluster = assignCluster(dataset[i], centroids);
            if (newCluster !== assignments[i]) {
                assignments[i] = newCluster;
                changed = true;
            }
        }

        // Update centroids
        centroids = updateCentroids(dataset, assignments, k);
    }

    return {assignments, centroids};
}

// Function to get k random centroids from the dataset to initialise the k-means algorithm
function getRandomCentroids(dataset: number[][], k:number) {
    const centroids = [];
    const chosenIndexes = new Set();
    while (centroids.length < k) {
        const index = Math.floor(Math.random() * dataset.length-1);
        if (!chosenIndexes.has(index)) {
            chosenIndexes.add(index);
            centroids.push([...dataset[index]]);
        }
    }
    return centroids;
}

// Function to perform PCA on unprocessed data
export function performPCA (unprocessedData: unprocessedData | null, setupInformation: Settings | null) {

    if (unprocessedData === null || setupInformation === null) {
        return;
    }

    const allData = unprocessedData.expectedData.concat(unprocessedData.anomalousData);

    if (allData.length === 0) {
        return;
    }

    // If clustering is enabled and the number of clusters is greater than 1, perform k-means clustering
    // Otherwise, perform PCA on the entire expected dataset
    if (setupInformation.cluster && setupInformation.numClusters > 1) {

        const {assignments} = kmeans(allData, setupInformation.numClusters);

        const pca: PCA[] = [];
        let expectedData: number[][] = [];
        let anomalousData: number[][] = [];
        let minDimension: number = Number.MAX_VALUE;

        // For each cluster, perform PCA
        for (let i =0; i<=Math.max(...assignments); i++) {
            // Get all data in this cluster
            const clusterData = allData.filter((_, index) => assignments[index] === i);
            // Perform PCA on this cluster
            pca.push(new PCA(clusterData));
            // Find minimum dimensions across all clusters
            minDimension = pca.map(pca => pca.getExplainedVariance().length).reduce((a, b) => Math.min(a, b));
        }

        // For each sample, perform a prediction using the necessary pca
        for (let i =0; i< unprocessedData.expectedData.length; i++) {
            const cluster = assignments[i];
            const clusterLatentData = pca[cluster].predict([unprocessedData.expectedData[i]], {nComponents: minDimension}).to2DArray();
            expectedData = expectedData.concat(clusterLatentData);
        }

        // For each anomalous sample, perform a prediction using the necessary pca
        // The cluster is assigned based on the closest centroid (anomalous data is not used to update centroids, only to assign clusters)
        for (let i =0; i<unprocessedData.anomalousData.length; i++) {
            const cluster = assignments[i + unprocessedData.expectedData.length];
            const clusterLatentData = pca[cluster].predict([unprocessedData.anomalousData[i]], {nComponents: minDimension}).to2DArray();
            anomalousData = anomalousData.concat(clusterLatentData);
        }


        processedData.set({
            dimensions: `${allData.length} x ${unprocessedData.expectedData[0].length}`,
            expectedData: expectedData,
            anomalousData: anomalousData,
            visibleComponents: getPCAComponents(pca, setupInformation.visibleComponents.option, setupInformation.visibleComponents.value),
            pca: pca,
            clusters: assignments
        })

    } else {
        const pca = new PCA(allData, {scale: true});

        const pcaComponents = getPCAComponents([pca], setupInformation.visibleComponents.option, setupInformation.visibleComponents.value);
        
        const expectedData = pca.predict(unprocessedData.expectedData).to2DArray();
        const anomalousData = pca.predict(unprocessedData.anomalousData).to2DArray();

        processedData.set({
            dimensions: `${allData.length} x ${unprocessedData.expectedData[0].length}`,
            expectedData: expectedData,
            anomalousData: anomalousData,
            visibleComponents: pcaComponents,
            pca: [pca],
            clusters: []
        });
    }
}

// Function to return the appropriate number of components for sonification based off of the PCA of each cluster
export function getPCAComponents(pcaArray: PCA[], option: componentOptions, value: number): number {

    const components = []

    // For each cluster, either assign the fixed value, calculate the number of components that explain the given percentage of variance, or use the Kaiser rule
    for (let i=0; i<pcaArray.length; i++){
        let pcaComponents: number = 2;

        switch (option) {
            case "Fixed":
                return value;
            case "Percentage Variance": {
                // Loop through the cumulative variance and find the number of components that explain the given percentage of variance
                const cumulativeVariance = pcaArray[i].getCumulativeVariance();
                const percentageVariance = value / 100;
                for (let i = 0; i < cumulativeVariance.length; i++) {
                    if (cumulativeVariance[i] >= percentageVariance || i === cumulativeVariance.length - 1) {
                        pcaComponents = i + 1;
                        break;
                    }
                }
                break;
            }
            case "Kaiser": {
                // Count the number of eigenvalues greater than 1
                const eigenValues = pcaArray[i].getEigenvalues();
                for (let i = 0; i < eigenValues.length; i++) {
                    if (eigenValues[i] > 1) {
                        pcaComponents++;
                    } else {
                        break;
                    }
                }
                break;
            }
        }
        components.push(pcaComponents);
    }

    // Uses the average number of components across all clusters to ensure that the sonification is consistent
    const sum = components.reduce((acc, curr) => acc + curr, 0); 
    const average = Math.round(sum / components.length); 
    return average;
}
