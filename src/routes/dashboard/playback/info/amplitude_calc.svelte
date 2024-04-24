<script lang="ts">
	import { processedData, selectedPoints } from "$lib/stores";
	import { round } from "$lib/utils";
	import Icon from "@iconify/svelte";
    import { Matrix } from 'ml-matrix';

    export let windowIndex:number ;
    export let amplitudeOption: boolean;

    let open = false;
</script>

{#if windowIndex >= 0 && $selectedPoints[windowIndex]}
    <div class="w-full my-1 overflow-auto text-sm px-3 leading-loose">
        <button class="font-bold my-1"
        on:click={()=>open=!open}>Amplitude Calculations <Icon icon="teenyicons:down-outline" class="inline mx-1"/></button>
        {#if open}
            <p class="font-bold">Amplitude Modulation: {amplitudeOption? 'Enabled':'Disabled'}</p>
            {#if amplitudeOption}
                <p class="text-xs">In amplitude modulation, each latent variable is first converted to its absolute value. Then, each variable is raised to the power of 10. If the total sum of these amplitudes exceeds 1, the values are normalised so that their sum equals 1.</p>
                {#each Array($processedData.visibleComponents) as _,index}
                    <p>Harmonic {index+1}: (10 ** {Math.abs(round($selectedPoints[windowIndex][index]))})</p>
                {/each}
            {:else}
                <p class="text-xs">For frequency modulation, we use the standard amplitudes for each harmonic.</p>
                {#each Array($processedData.visibleComponents) as _,index}
                    <p>Harmonic {index+1}: (1/2)^{index+1} = {Math.pow(0.5,index+1)}</p>
                {/each}
            {/if}
        {/if}
    </div>
{/if}