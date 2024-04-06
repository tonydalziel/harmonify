<script lang="ts">
	import { processedData, selectedPoints } from "$lib/stores";
    import { round } from "$lib/utils";
	import Icon from "@iconify/svelte";
    import { Matrix } from 'ml-matrix';

    export let windowIndex:number ;
    export let amplitudeOption: boolean;
    export let baselineFrequency: number;

    let open = false;
    let means: number[] | null = null;
    let sds: number[] | null = null

    processedData.subscribe(value => {
        if (value.expectedData.length > 0) {
            const matrix = new Matrix($processedData.expectedData.concat($processedData.anomalousData));
            means = matrix.mean('column');
            sds = matrix.standardDeviation('column');
        }
    });
</script>

{#if windowIndex >= 0 && baselineFrequency && $selectedPoints[windowIndex]}
    <div class="w-full my-1 overflow-auto text-sm px-3 leading-loose">
        <button class="font-bold my-1"
        on:click={()=>open=!open}>Frequency Calculations <Icon icon="teenyicons:down-outline" class="inline mx-1"/></button>
        {#if open}
            <p>Fundamental Frequency: {round(baselineFrequency)}</p>
            <p class="font-bold">Frequency Modulation: {!amplitudeOption? 'Enabled':'Disabled'}</p>
            {#if amplitudeOption}
                <p class="text-xs">For amplitude modulation, we use the standard frequencies for each harmonic being an integer multiple of the fundamental frequency.</p>
                <p class="text-xs bg-slate-200">Frequency of harmonic x = fundamental frequency * x</p>
                {#each Array($processedData.visibleComponents) as _,index}
                    <p>Harmonic {index+1}: {round(baselineFrequency)} * {index+1} = {round(baselineFrequency * (index + 1))}</p>
                {/each}
            {:else}
                <p class="text-xs">For frequency modulation, each dimension is standardised (column wise) to have a mean of 0 and standard deviation of 0.25. Larger shifts of higher frequencies will be the most notable.</p>
                <p class="text-xs bg-slate-200">Frequency of harmonic x = (fundamental frequency * x) + (fundamental frequency  * ((dimension x - mean of all dimension x's) / (4 * standard deviation of all dimension x's)))</p>
                {#if means !== null && sds !== null}
                    {#each Array($processedData.visibleComponents) as _,index}
                        <p>Harmonic {index+1}: ({round(baselineFrequency)} * {index+1}) + ({round(baselineFrequency)} * {round(($selectedPoints[windowIndex][index]- means[index])/(4*sds[index]))}) = {round(((baselineFrequency * (index+1)) + (baselineFrequency * (($selectedPoints[windowIndex][index]- means[index])/(4*sds[index])))))}</p>
                    {/each}
                {/if}
            {/if}
        {/if}
    </div>
{/if}