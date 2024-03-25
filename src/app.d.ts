// Processed data inferface: Stores the number of components for sonification, the data, the pca object (if pca is performed), and the clusters
declare interface ProcessedData{
	dimensions: string;
	visibleComponents: number;
    expectedData: number[][];
	anomalousData: number[][];
    // PCA is provided for each cluster if clustering is performed
	pca: PCA[] | null;
	clusters: number[];
}

// Unprocessed data interface: Stores the expected data and the anomalous data as generated or uploaded by a user
declare interface unprocessedData{
    expectedData: number[][];
    anomalousData: number[][];
}

// Determines which approach is used to determine the number of components
type componentOptions = 'Fixed' | 'Percentage Variance' | 'Kaiser'

// Settings interface: Stores the settings used to control data processing and sonification
declare interface Settings {
	visibleComponents: {
		option: componentOptions;
		value: number;
	},
	primeOnly: boolean;
	cluster: boolean;
	numClusters: number;
}

declare interface FrequencyMultiplier{
    type: "Fixed" | "Component" | "Cluster";
    value: number;
}