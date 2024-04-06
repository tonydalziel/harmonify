<script lang="ts">
	import Icon from "@iconify/svelte";
	import { Tab, TabGroup } from "@skeletonlabs/skeleton";

    import WaveForm from "$lib/visualisations/waveform.svelte";
    import FrequencyBar from "$lib/visualisations/frequency_amplitude.svelte";
	import Helper from "$lib/assets/helper.svelte";
	import { round } from "$lib/utils";
	import { createEventDispatcher } from "svelte";

    export let audioContext: AudioContext | null;
    export let gainNodes: GainNode[];
    export let oscilatorNodes: OscillatorNode[];
    export let fundamentalFrequency: number;
    export let clipping: boolean;

    let tabSet = 0;
    let maxInView = 4;

    const dispatch = createEventDispatcher();
    let doneOnce = false;

    $: if (tabSet >= 0 && !doneOnce) {
        doneOnce = true;
    } else {
        dispatch("used");
    }
</script>

<h4 class="h4 mb-3">Visualise</h4>
<Helper text="What do these visuals show" modalName="visualisations" />
{#if clipping}
    <div class="alert variant-ghost-error w-[80%] my-1"><p>This signal has been clipped. For further information view frequency / amplitude calculations.</p></div>
{/if}
<TabGroup class="text-primary-900 w-[90%]">
    <Tab bind:group={tabSet} name="tab1" value={0}>
        <svelte:fragment slot="lead"><Icon icon="mdi:sine-wave" class="text-center my-1" height={18}/></svelte:fragment>
        <span>Single Waveform</span>
    </Tab>
    <Tab bind:group={tabSet} name="tab2" value={1}>
        <svelte:fragment slot="lead"><Icon icon="mdi:sine-wave" class="text-center my-1" height={18}/></svelte:fragment>
        <span>Split Waveform</span>
    </Tab>
    <Tab bind:group={tabSet} name="tab3" value={2}>
        <svelte:fragment slot="lead"><Icon icon="bi:bar-chart-fill" class="text-center my-1" height={18}/></svelte:fragment>
        <span>Frequency Plot</span>
    </Tab>
    <!-- Tab Panels --->
    <svelte:fragment slot="panel">
        {#if tabSet === 0}
            {#if audioContext}
                <WaveForm audioContext={audioContext} gainNodes={gainNodes}/>
            {:else}
                <p>Awaiting audio context</p>
            {/if}
        {:else if tabSet === 1}
            {#if audioContext && gainNodes.length > 0}
                {#each gainNodes.slice(0,maxInView) as displayNode, index}
                    <p>Harmonic {index+1}: {oscilatorNodes[index].frequency.value} Hz | {round(displayNode.gain.value)} gain</p>
                    <WaveForm audioContext={audioContext} gainNodes={displayNode}/>
                {/each}
                <div class="w-full flex justify-center items-center">
                    <button type="button" class="btn-icon bg-gradient-to-br variant-gradient-secondary-primary my-3 text-white"
                    on:click={
                    ()=>{if(maxInView==4){
                        maxInView=gainNodes.length;
                    }else{
                        maxInView=4;
                    }
                    }}>{maxInView<=Math.min(4,gainNodes.length)?'+':'-'}</button>
                </div>
            {:else}
                <p>Awaiting audio context. Click play to view.</p>
            {/if}
        {:else if tabSet === 2}
            {#if audioContext}
                <FrequencyBar gainNodes={gainNodes} oscillatorNodes={oscilatorNodes} fundamentalFrequency={fundamentalFrequency} />
            {:else}
                <p>Select a sample to visualise components</p>
            {/if}
        {/if}
    </svelte:fragment>
</TabGroup>