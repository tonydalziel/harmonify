<script lang="ts">
	import { processedData, selectedPoints, tasks } from "$lib/stores";
	import { completeTask } from "$lib/utils";
	import Icon from "@iconify/svelte";
	import { RangeSlider } from "@skeletonlabs/skeleton";

    export let windowIndex:number;
    export let updateStatus: () => void;
    export let sampleByIndex: () => void;
    export let currentIndex: number|null;
    export let playing: boolean;
    export let sliderValue: number;

    let autoplaying: boolean = false;
    let playedPoints: number = 0;

    const playAndSample = () => {

        if (! $tasks["auto"][1] ) completeTask("auto");

        if(!playing){
            updateStatus();
        }

        const numPoints = $processedData.expectedData.concat($processedData.anomalousData).length;

        // Shuffle indices from 0 to numPoints - 1
        let indices = Array.from({length: numPoints}, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        autoplaying = true;
        const autoPlayInterval = setInterval(() => {
            if(!playing){
                clearInterval(autoPlayInterval);
                autoplaying = false;
            } else if(playedPoints == numPoints){
                clearInterval(autoPlayInterval);
                playedPoints = 0;
                autoplaying = false;
            } else {
                currentIndex = indices[playedPoints];
                sampleByIndex();
                playedPoints++;
            }
        }, 1000);
    }
</script>

<h4 class="h4 mb-3">Listen and compare</h4>
<p class="text-sm my-3">Use the slider below to compare the modulated signal to the standard harmonic. Autoplay will randomly shuffle all data points then sample and play each one until pause is selected.</p>

<div class="flex justify-start items-center w-[90%]">
    <button class="btn-icon variant-filled-tertiary !rounded-full text-sm m-1" on:click={()=>updateStatus()}
        disabled={!$selectedPoints[windowIndex]}><Icon icon="mdi:{playing? 'pause':'play'}" height={18}/></button>
    {#if autoplaying}
        <p class="mx-2">Played {playedPoints} / {$processedData.expectedData.concat($processedData.anomalousData).length} data points</p>
    {:else}
        <button class="btn variant-filled-tertiary !rounded-full text-sm m-1" on:click={()=>playAndSample()}
        disabled={!$selectedPoints[windowIndex]}>Autoplay</button>
    {/if}

    <div class="w-full mx-2">
        <div class="w-full flex justify-between items-center text-secondary-900">
            <p>Natural Signal</p>
            <p>Modulated Signal</p>
        </div>
        <RangeSlider name="Modulation Slider" bind:value={sliderValue} min={0} max={1} step={0.01} ticked accent={"accent-tertiary-500 dark:accent-tertiary-500"}></RangeSlider>
    </div>
</div>