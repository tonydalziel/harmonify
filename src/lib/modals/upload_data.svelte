<script lang="ts">
	import { processedData, unprocessedData, loading } from '$lib/stores';
    import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';

    const modalStore = getModalStore();
    const toastStore = getToastStore();

    let rawInput: HTMLInputElement;
	let processedInput: HTMLInputElement;

    const generateToast = (message: string) => {
        toastStore.trigger({message: message});
    }

    // Function for reading in new raw data to the unprocessed data store (performs various input validation steps)
	const newRawData = (event: Event) => {
		if (event.target == null) return;

		const files = (event.target as HTMLInputElement).files;
		if (files == null || files.length == 0) return;
		const file  = files[0];
		const fileReader = new FileReader();
		fileReader.onload = () => {
			// Try to parse the file as JSON
			try {
				const data = JSON.parse(fileReader.result as string);
				// Check whether the data has the names "gaussianData" and "anomalyData" and that these variables have number[][] types
				if (data.expectedData && data.anomalousData && Array.isArray(data.expectedData) && Array.isArray(data.anomalousData)){
					if (data.expectedData.length > 0 && data.anomalousData.length > 0){
						// Check all the arrays in the data are of the same length
						const arrayLength = data.expectedData[0].length;
						if (data.expectedData.concat(data.anomalousData).every((arr: number[]) => arr.length == arrayLength) ){
							// Set the data in the store
							unprocessedData.set({
								expectedData: data.expectedData,
								anomalousData: data.anomalousData
							});
							closeModal('Uploaded Unprocessed Data');
						} else {
							generateToast('Invalid file format: Array lengths are not consistent');
                            modalStore.close();
						}
					} else {
                        generateToast("No data provided")
                    }
				} else {
					generateToast('Invalid file format: Must provide arrays containing gaussian data and anomalous data');
				}
			} catch (e) {
				generateToast('Error parsing file');
			}
		}
		fileReader.readAsText(file);
		rawInput.value = '';
	}

    // Function for reading in new processed data to the processed data store (performs various input validation steps)
	const newProcessedData = (event: Event) => {
		if (event.target == null) return;

		const files = (event.target as HTMLInputElement).files;
		if (files == null || files.length == 0) return;
		const file  = files[0];
		const fileReader = new FileReader();
		fileReader.onload = () => {
			// Try to parse the file as JSON
			try {
				const data = JSON.parse(fileReader.result as string);
				// Check whether the data has the names "gaussianData" and "anomalyData" and that these variables have number[][] types
				if (data.expectedData && data.anomalousData && Array.isArray(data.expectedData) && Array.isArray(data.anomalousData)){
					if (data.expectedData.length > 0 && data.anomalyData.length > 0){
						// Check all the arrays in the data are of the same length
						const arrayLength = data.expectedData[0].length;
						if (data.expectedData.concat(data.anomalousData).every((arr: number[]) => arr.length == arrayLength) && (!data.clusters.length || data.clusters.length == data.expectedData.length)){
							// Set the data in the store
							processedData.set({
								dimensions: `${data.expectedData.length + data.anomalousData.length} x ${arrayLength}`,
								expectedData: data.expectedData,
								anomalousData: data.anomalousData,
								pca: null,
								clusters: data.clusters? data.clusters : [],
                                visibleComponents: Math.min(5, data.expectedData[0].length),
							});
							closeModal('Uploaded Processed Data');
						} else {
							generateToast('Invalid file format: Array lengths are not consistent');
						}
					}
				} else {
					generateToast('Invalid file format: Must provide arrays containing gaussian data and anomalous data');
				}
			} catch (e) {
				generateToast('Error parsing file');
			}
		}
		fileReader.readAsText(file);
		processedInput.value = '';
	}

    const closeModal = (response: string) => {
        if($modalStore[0].response){
            $modalStore[0].response(response);
        }
        modalStore.close();
    }
</script>

<div class="bg-primary-200 rounded-md p-3 max-w-2xl text-center text-sm max-h-[90vh] overflow-scroll f">
    <h3 class="my-3 h3">Generate Data</h3>
    <p class="my-2">If you have your own data to test, you can upload it using one of the two options provided below. Please be sure to follow the data upload formats provided in the documentation below.</p>
    <a class="underline text-tertiary-500" href="https://github.com/tonydalziel/harmonify">Documentation</a>
    <p class="my-2 italic">Note: Unprocessed data will have PCA performed on it automatically whereas processed data will have no further processing done other than selecting the number of audible components.</p>
    
    <label for="raw_import" class="btn variant-filled-tertiary !rounded-full block mx-auto my-3 max-w-fit cursor-pointer">Upload raw data</label>
    <input id="raw_import" type="file" accept=".json" class="hidden" bind:this={rawInput} on:change={newRawData}/>
    <label for="processed_import" class="btn variant-filled-tertiary !rounded-full block mx-auto my-3 max-w-fit cursor-pointer">Upload processed data</label>
    <input id="processed_import" type="file" accept=".json" class="hidden" bind:this={processedInput} on:change={newProcessedData}/>

    
    <button class="btn variant-filled-surface my-3" on:click={()=>modalStore.close()} disabled={$loading}>Close</button>
</div>