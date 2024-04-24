<script lang="ts">
	import { processedData, selectedPoints } from "$lib/stores";
	import { round } from "$lib/utils";
	import { getToastStore } from "@skeletonlabs/skeleton";

    export let fundamentalFrequency: number;
    export let cluster: number|null;
    export let windowIndex: number;
    export let playing: boolean;

    let optionSelect: string = "f1";
    let baselineFrequency: number = 440;
    const toastStore = getToastStore();

     // Function to get the frequency multiplier by parsing the frequencyMultiplierOption
     const updateFundamental = () => {

        fundamentalFrequency = baselineFrequency;

        if (optionSelect.startsWith("component")){
            const index = parseInt(optionSelect.split("component")[1]);
            fundamentalFrequency *= Math.abs($selectedPoints[windowIndex][index]);
        } else if (optionSelect === "cluster" && cluster !== null){
            fundamentalFrequency *= cluster;
        }
    }

    // If the frequency changes, or the options update, update the fundamental frequency
    $: if(baselineFrequency || optionSelect ||  cluster){
        if (baselineFrequency < 20 || baselineFrequency > 20000){
            toastStore.trigger({
                message: 'Frequency must be between 20 and 20000 Hz',
                timeout: 1000,
                background: 'variant-filled-warning',
            })
            fundamentalFrequency = 0;
        } else {
            updateFundamental();
        }
    }

    // If the selected point is deleted reset everything
    selectedPoints.subscribe(points => {
        if(!points[windowIndex] || points[windowIndex].length === 0){
            optionSelect = "f1";
        } else {
            updateFundamental();
        }
    });
</script>


<h4 class="h4 mb-3">Set the fundamental frequency</h4>

<div class="flex items-center w-[80%]">
    <p class="text-primary-900 mx-1">Frequency: </p>
    <input disabled={playing} class="ml-1 px-1 rounded-md input" type="number" bind:value={baselineFrequency} min={1} max={20000} step={1} />
    <p class="text-primary-900 mx-1">x</p>
    <select disabled={playing} class="input ml-1 px-1 rounded-md" bind:value={optionSelect}>
        <option value={"f1"}>1</option>
        {#if $selectedPoints[windowIndex]}
            {#each Array($processedData.visibleComponents) as _, index}
                <option value={`component${index}`}>Latent Variable {index+1}: {round($selectedPoints[windowIndex][index])}</option>
            {/each}
        {/if}
        {#if cluster !== null}
            <option value={`cluster`}>Cluster Assignment: {cluster+1}</option>
        {/if}
    </select>
    <p class="text-primary-900 mx-1">Hz</p>
</div>