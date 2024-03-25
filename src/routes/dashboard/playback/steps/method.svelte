<script lang="ts">
	import Helper from "$lib/assets/helper.svelte";
	import { createEventDispatcher } from "svelte";
    
    export let playing: boolean;
    export let amplitudeOption: boolean;

    const dispatch = createEventDispatcher();
    let doneOnce = false;

    $: if ((amplitudeOption || !amplitudeOption) && !doneOnce) {
        doneOnce = true;
    } else {
        dispatch("used");
    }
</script>

<h4 class="h4 mb-3">Select a sonification method</h4>
<Helper text="Examples" modalName="sonificationExamples"></Helper>

<div class="flex-wrap flex items-stretch justify-center w-[95%] overflow-hidden">
    <button class="hover:bg-primary-500/10 {!amplitudeOption ? 'bg-primary-500/20':''} flex-1 text-left rounded-l-md p-1" disabled={playing} on:click={()=>amplitudeOption = false}>
        <h5 class="h6">Frequency Modulation</h5>
        <p class="text-sm">Scale the frequencies of a harmonic signal by the normalised latent values of the sampled row.</p>
        <img src="/frequency.png" alt="Frequency Modulation" class="w-full" />
    </button>
    
    <span class="divider-vertical !min-h-full" />

    <button class="hover:bg-primary-500/10 {amplitudeOption ? 'bg-primary-500/20':''} flex-1 text-left rounded-r-md p-1" disabled={playing} on:click={()=>amplitudeOption = true}>
        <h5 class="h6">Amplitude Modulation</h5>
        <p class="text-sm">Scale the amplitudes of a harmonic signal by the scaled down latent values of the sampled row.</p>
        <img src="/amplitude.png" alt="Amplitude Modulation" class="w-full" />
    </button>
</div>