import { performPCA, getPCAComponents } from "$lib/pca";
import {loading, processedData, setupInformation, unprocessedData} from '$lib/stores';

// Local copies of the localSettings, localProcessedData, and clustering status (used to determine whether clustering should be re-performed)
let localSettings: Settings | null = null;
let localProcessedData: ProcessedData | null = null;
let clusteringStatus = false;
let clusteringNum = 1;

// Anytime the unprocessed data is changed, perform PCA
unprocessedData.subscribe(value => {
    loading.set(true);
    performPCA(value, localSettings);
    loading.set(false);
});

// Anytime the settings are changed, update the processed data accordingly
setupInformation.subscribe(value => {

    if (localProcessedData !== null) {
        if (localProcessedData.pca !== null) {
            const components = getPCAComponents(localProcessedData.pca, value.visibleComponents.option, value.visibleComponents.value);
            localProcessedData.visibleComponents = components;
            processedData.update((pd)=>{
                pd.visibleComponents = components;
                return pd;
            });

            console.log(value.cluster, clusteringStatus, value.numClusters, clusteringNum);
            if (value.cluster !== clusteringStatus || value.numClusters !== clusteringNum) {
                unprocessedData.update(data => data);
                clusteringStatus = value.cluster;
                clusteringNum = value.numClusters;
            }
        } else {
            processedData.update((pd)=>{
                pd.visibleComponents = value.visibleComponents.value;
                return pd;
            });
        }
    }
    localSettings = value;
});

// Anytime the processed data is changed, update the local copy (used for calculating the number of components for sonification)
processedData.subscribe(value => {
    loading.set(true);
    localProcessedData = value;
    loading.set(false);
});