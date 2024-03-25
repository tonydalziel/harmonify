<script lang="ts">
	import { processedData, selectedPoints } from "$lib/stores";
	import { round } from "$lib/utils";
	import Icon from "@iconify/svelte";
    import { Matrix } from 'ml-matrix';

    export let windowIndex:number ;
    export let amplitudeOption: boolean;

    let open = false;
    let sd: number | null = null

    processedData.subscribe(value => {
        if (value.expectedData.length > 0) {
            const matrix = new Matrix($processedData.expectedData.concat($processedData.anomalousData));
            sd = 4 * matrix.standardDeviation('column')[0];
        }
    });
</script>

{#if windowIndex >= 0 && $selectedPoints[windowIndex] && sd !== null}
    <div class="w-full my-1 overflow-auto text-sm px-3 leading-loose">
        <button class="font-bold my-1"
        on:click={()=>open=!open}>Amplitude Calculations <Icon icon="teenyicons:down-outline" class="inline mx-1"/></button>
        {#if open}
            <p class="font-bold">Amplitude Modulation: {amplitudeOption? 'Enabled':'Disabled'}</p>
            {#if amplitudeOption}
                <p class="text-xs">For amplitude modulation, we divide all values in the dataset by 4 * standard deviation of the first component such that most values are below 1.</p>
                <p class="text-xs">We assign values directly to the amplitude of each harmonic. If the amplitude for a signal is greater than 1 it must be <b class="text-error-500">clipped</b>.</p>
                {#each Array($processedData.visibleComponents) as _,index}
                    <p class="{Math.abs($selectedPoints[windowIndex][index] / sd) >= 1 ? 'text-error-500' :''}">Harmonic {index+1}: {Math.abs(round($selectedPoints[windowIndex][index]))} / {round(sd)} = {Math.abs(round(($selectedPoints[windowIndex][index] / sd)))}</p>
                {/each}
            {:else}
                <p class="text-xs">For frequency modulation, we use the standard amplitudes for a harmonic signal.</p>
                {#each Array($processedData.visibleComponents) as _,index}
                    <p>Harmonic {index+1}: (1/2)^{index+1} = {Math.pow(0.5,index+1)}</p>
                {/each}
            {/if}
        {/if}
    </div>
{/if}