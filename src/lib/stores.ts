import { writable } from 'svelte/store';

// Loading store: True if the app is currently loading or processing data
export const loading = writable<boolean>(false);

// Setup information store: Settings used to control data processing and sonification (number of components)
export const setupInformation = writable<Settings>({
    visibleComponents: {
        option: "Fixed",
        value: 5
    },
    primeOnly: false,
    cluster: false,
    numClusters: 1
});

// Unprocessed data store: Data that has been generated or uploaded but not yet processed
export const unprocessedData = writable<unprocessedData>({
    expectedData: [],
    anomalousData: []
});

// Processed data store: Data that has been processed or uploaded and is ready for sonification
export const processedData = writable<ProcessedData>({
    dimensions: '0 x 0',
    visibleComponents: 5,
    expectedData: [],
    anomalousData: [],
    pca: null,
    clusters: []
});

export const tasks = writable<Record<string,[string,boolean]>>({
    "sample": ["Sample a row (data point) of 'regular' data", false],
    "sonify": ["Sonify the data point using amplitude modulation", false],
    "compare": ["Compare your modulated signal with the original harmonic signal, what happens to the different components?", false],
    "irregular": ["Sample and sonify an irregular data point, how does it compare?", false],
    "frequency": ["Try out frequency modulation", false],
    "auto": ["Use autoplay to automate sampling", false],
    "components": ["Change the number of audible components", false],
    "generate": ["Generate Clustered Test Data", false],
    "cluster": ["See any clusters? Perform data clustering", false],
});

export const selectedPoints = writable<Record<number,number[]>>({});