<script lang="ts">
	import { processedData } from "$lib/stores";
	import { round } from "$lib/utils";
	import Waveform from "$lib/visualisations/waveform.svelte";
	import { RangeSlider } from "@skeletonlabs/skeleton";
    import { Matrix } from 'ml-matrix';
	import { onMount } from "svelte";

    export let playedFull: boolean;

    let sampled:boolean = false;
    let data: number[] = [];

    let sliderValue: number = 0;
    let playing: boolean = false;

    let audioContext: AudioContext;
    let oscilatorNodes: OscillatorNode[] = [];
    let gainNodes: GainNode[] = [];

    const sample = () => {
        sampled = true;
        if ($processedData.pca !== null){
            const variance = $processedData.pca[0].explained_variance_;
            data = $processedData.expectedData[3].slice(0, 5);

            const matrix = new Matrix($processedData.expectedData.concat($processedData.anomalousData));
            const sd = 4 * matrix.standardDeviation('column')[0];

            // Retrieve the current point and remove any negative values
            data = data.map(value => Math.abs(value) / sd);

            // If the sum of the scaled values is above 1, normalise the values
            const sumOfValues = data.reduce((a, b) => a + b, 0);
            if(sumOfValues > 1){
                data.forEach((value, index) => {
                    data[index] = value / sumOfValues;
                });
            }
        }
    };

    const play = () => {
        playing = !playing;
        if (!playing){
            gainNodes.forEach(node => {
                node.gain.value = 0;
            });
        }
    };

    $: if(playing && sliderValue >= 0){
        gainNodes.forEach((node,index) => {
            node.gain.value = ((1-sliderValue) * (1/2)**(index+1)) + (sliderValue * data[index]);
        });
        gainNodes = gainNodes;
    }

    $: if(playing && sliderValue == 1) playedFull = true;

    onMount(()=> {
        audioContext = new AudioContext();
        if(audioContext !== null){
            // Add an oscillator and gain node for each harmonic
            for (let index = 0; index < 5; index++) {
                const oscillator = audioContext.createOscillator();
                const gain = audioContext.createGain();
                gain.gain.value = 0;
                oscillator.connect(gain);
                gain.connect(audioContext.destination);
                oscillator.type = 'sine';
                oscillator.frequency.value = 200 * (index+1);
                oscillator.start();
                oscilatorNodes.push(oscillator);
                gainNodes.push(gain);
            }
        }

        return () => {
            if(audioContext){
                audioContext.close();
            }
        };
    });
</script>

<h4 class="h4 my-6 mx-3">Now that we have defined our starting point, let's take a sample from the generated data and assign the absolute scaled down values to the amplitude of each harmonic. <b class="text-primary-500">Use the slider to see how the amplitude values change!</b></h4>
<h6 class="h6 my-6 mx-3">As we are taking a regular sample, we expect the values to be smaller (closer to the mean of 0 (another quirk of Principle Component Analysis)) with less variation at higher components. This shouldn't make the signal too unnatural unlike irregular samples.</h6>
<div class="my-6 flex justify-center flex-col items-center">
    <button
        type="button"
        class="btn {sampled
            ? 'variant-filled-success'
            : 'variant-filled-tertiary'} !rounded-full h6 my-1"
        on:click={sample}
    >
			Regular sample from generated data
	</button>
    <span
        class="divider-vertical h-5 my-1 border {sampled
            ? 'border-success-500'
            : 'border-tertiary-500'}"
    />
    <button
        type="button"
        class="btn variant-filled-tertiary !rounded-full h6 my-1"
        disabled={!sampled}
        on:click={play}
    >
			{playing ? 'Pause' : 'Play'}
	</button>
    <div class="w-1/2 mx-auto">
        <div class="w-full flex justify-between items-center text-secondary-900">
            <p>Standard Harmonic</p>
            <p>Modulated Harmonic</p>
        </div>
        <RangeSlider name="Modulation Slider" bind:value={sliderValue} min={0} max={1} step={0.1} ticked accent={"accent-tertiary-500 dark:accent-tertiary-500"}></RangeSlider>
    </div>
    <div class="w-1/2 my-1">
        {#each gainNodes as displayNode, index}
            <p>Component {index+1}: {oscilatorNodes[index].frequency.value} Hz | {round(gainNodes[index].gain.value*100)}% gain</p>
            <Waveform audioContext={audioContext} gainNodes={displayNode}/>
        {/each}
    </div>
</div>
