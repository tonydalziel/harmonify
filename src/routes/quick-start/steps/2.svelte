<script lang="ts">
	import { generateNewData } from '$lib/generate_data';
	import { performPCA } from '$lib/pca';
	import { processedData, setupInformation, unprocessedData } from '$lib/stores';
	import { type TableSource, Table } from '@skeletonlabs/skeleton';
	import { onDestroy } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';

	export let dataCreated: boolean = false;

    const rawData: TableSource = {
        head: [],
        body: []
    };

    const latentData: TableSource = {
        head: [],
        body: []
    };

	function generateData() {
        generateNewData();
        performPCA($unprocessedData, $setupInformation);
		dataCreated = true;
	}

    const unSub: Unsubscriber = processedData.subscribe(data=>{
        const currentIndex = 3;

        if(data.expectedData[currentIndex]){
            rawData.head = [];
            latentData.head = [];
            for (let i=0; i<data.expectedData[currentIndex].length; i++) {
                rawData.head.push("Dimension " + (i+1).toString());
                latentData.head.push("Dimension " + (i+1).toString());
            }
            rawData.body = [data.expectedData[currentIndex].map(value => (Math.round((value) * 100) / 100).toString())];
            latentData.body = [$unprocessedData.expectedData[currentIndex].map(value => (Math.round((value) * 100) / 100).toString())];
        }
    });

    onDestroy(() => {
        unSub();
    });

</script>

<p class="my-6 mx-3">
	Use the button below to generate a test dataset containing 1000 data points and 100 dimensions <a class="text-primary-500 underline" href="https://www.statology.org/high-dimensional-data/">(high-dimensional data)</a>. 950 of these data points are 'regular' and 50 data points are 'irregular'. The goal of our app is to find the irregular data using only sound!
</p>

<div class="my-10 w-[80%] mx-auto flex justify-center items-stretch flex-wrap">
	<div class="flex-col flex justify-center items-center flex-1">
		<button
			type="button"
			class="btn {dataCreated
				? 'variant-filled-success'
				: 'variant-filled-tertiary'} !rounded-full h6 my-1"
			on:click={generateData}
		>
			Generate Data
		</button>
		<span
			class="divider-vertical h-5 my-1 border {dataCreated
				? 'border-success-500'
				: 'border-tertiary-500'}"
		/>
		<p class="h6 {dataCreated ? 'text-success-500 font-semibold' : 'text-error-500'} ">
			Performed PCA
		</p>
	</div>
	<span class="divider-vertical divider-tertiary-500 min-h-full" />
	<div class="flex-col flex justify-center items-center flex-1 text-right">
		<h6 class="my-2 h6">Example data point from generated data:</h6>
        {#if dataCreated}
            <Table source={rawData} class="max-w-lg overflow-auto"/>
        {/if}
		<h6 class="my-2 h6">Latent representation after PCA:</h6>
        {#if dataCreated}
            <Table source={latentData} class="max-w-lg overflow-auto"/>
        {/if}
	</div>
</div>

<p class="my-6 mx-3">
    <a class="text-primary-500 underline" href="https://en.wikipedia.org/wiki/Principal_component_analysis">Principal Component Analysis (PCA)</a> is performed automatically on generated data, mapping the dataset to a latent space in which dimensions are ordered by the amount of variance they explain in the original data. This provides a latent representation of each data point.
</p>
