<!-- Settings panel used to display the current settings + data information -->
<script lang="ts">
    import { setupInformation } from "$lib/stores";
    import {processedData} from '$lib/stores';
	import Icon from "@iconify/svelte";
	import { getModalStore } from "@skeletonlabs/skeleton";

    const modalStore = getModalStore();
</script>


<div class="text-left bg-primary-50 m-3 p-5 rounded-md max-w-md relative text-sm">
    <h3 class="h3">Processing Settings</h3>
    <div class="mb-2">
        <p><b>Principle Components Option:</b> {$setupInformation.visibleComponents.option}</p>
        <p><b>Prime only harmonics:</b> {$setupInformation.primeOnly? 'On' : 'Off'}</p>
        <p><b>Clustering:</b> {$setupInformation.cluster? 'On' : 'Off'}</p>
        <p>Want to change this setup? Click the settings icon below</p>
    </div>
    <h3 class="h3">Data Stats</h3>
    <p><b>Dimensions:</b> {$processedData.dimensions}</p>
    <p><b>Number of regular rows:</b> {$processedData.expectedData.length} (indexed 0 to {$processedData.expectedData.length - 1})</p>
    <p><b>Number of irregular rows:</b> {$processedData.anomalousData.length} (indexed {$processedData.expectedData.length} to {$processedData.expectedData.length + $processedData.anomalousData.length - 1})</p>
    {#if $setupInformation.cluster}
        <p><b>Number of clusters:</b> {$setupInformation.numClusters}</p>
    {/if}
    {#if $processedData.expectedData.length > 0}
        <p><b>Number of audible components:</b> {$processedData.visibleComponents} / {$processedData.expectedData[0].length}</p>
    {/if}
    
    <div class="flex justify-end items-center w-full">
        <button class="btn-icon variant-ghost-secondary rounded-full"
        on:click={()=>modalStore.trigger({component: 'settings', type: 'component'})}>
            <Icon icon="material-symbols-light:settings-outline" height={20}/>
        </button>
    </div>
</div>