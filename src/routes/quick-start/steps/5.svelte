<script lang="ts">
	import { processedData } from "$lib/stores";
	import { onMount } from "svelte";
    import { Matrix } from 'ml-matrix';
	import Waveform from "$lib/visualisations/waveform.svelte";
    import { getToastStore } from '@skeletonlabs/skeleton';

    const toastStore = getToastStore();
			

    export let correctlyGuessed: boolean;

    // Choice: data, playing, oscilatorNodes, gainNodes, regular data?
    let choices: [number[], boolean, OscillatorNode[], GainNode[], boolean][] = [];
    let selected: boolean[] = [true,true,true,true,true];

    let audioContext: AudioContext;

    $: if(!correctlyGuessed && (choices.length > 0 && (selected.every((guess,index) => guess == choices[index][4])))){
        correctlyGuessed = true;
        toastStore.trigger({
            message: 'Well Done. You found the irregular sample!',
            // Provide any utility or variant background style:
            background: 'variant-filled-success',
        });
    }

    onMount(() => {
        audioContext = new AudioContext();

        const matrix = new Matrix($processedData.expectedData.concat($processedData.anomalousData));
        const sd = 4 * matrix.standardDeviation('column')[0];

        // Take 4 samples of regular data
        for (let i=0; i<4; i++){
            const oscilatorNodes: OscillatorNode[] = [];
            const gainNodes: GainNode[] = [];
            let data = $processedData.expectedData[i].slice(0, 5);

            // Retrieve the current point and remove any negative values
            data = data.map(value => Math.abs(value) / sd);

            // If the sum of the scaled values is above 1, normalise the values
            const sumOfValues = data.reduce((a, b) => a + b, 0);
            if(sumOfValues > 1){
                data.forEach((value, index) => {
                    data[index] = value / sumOfValues;
                });
            }

            // Create 5 harmonics
            for (let j=0; j<5; j++){
                const oscillator = audioContext.createOscillator();
                const gain = audioContext.createGain();
                gain.gain.value = 0;
                oscillator.connect(gain);
                gain.connect(audioContext.destination);
                oscillator.type = 'sine';
                oscillator.frequency.value = 440 * (j + 1);
                oscillator.start();
                oscilatorNodes.push(oscillator);
                gainNodes.push(gain);
            }

            choices.push([data, false, oscilatorNodes, gainNodes, true]);
        }

        // Take 1 sample of irregular data
        const oscilatorNodes: OscillatorNode[] = [];
        const gainNodes: GainNode[] = [];
        let data = $processedData.anomalousData[0].slice(0, 5);
        data = data.map(value => Math.abs(value) / sd);
        const sumOfValues = data.reduce((a, b) => a + b, 0);
        console.log(sumOfValues);
        if(sumOfValues > 1){
            data = data.map(value => value / sumOfValues);
        }

        // Create 5 harmonics
        for (let j=0; j<5; j++){
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            gain.gain.value = 0;
            oscillator.connect(gain);
            gain.connect(audioContext.destination);
            oscillator.type = 'sine';
            oscillator.frequency.value = 440 * (j + 1);
            oscillator.start();
            oscilatorNodes.push(oscillator);
            gainNodes.push(gain);
        }

        choices.push([data, false, oscilatorNodes, gainNodes, false]);

        // Shuffle choices
        for (let i=choices.length-1; i>0; i--){
            const j = Math.floor(Math.random() * (i+1));
            [choices[i], choices[j]] = [choices[j], choices[i]];
        }

        return () => {
            if(audioContext)
                audioContext.close();
        };
    });
</script>

<h4 class="h4 my-6">Now that you can perform sonification, try out the 5 modulated signals below. Can you correctly identify the irregular samples? Click the sample you suspect!</h4>
<div class="w-[80%] mx-auto">
    {#each choices as choice, index}
        <button class="my-3 w-full rounded-md {correctlyGuessed && !selected[index] ? 'bg-success-200' : 'bg-error-200'}"
        on:click={()=>{
            selected[index] = !selected[index];
        }}>
            <p class="block">Guess: {selected[index]? 'Regular':'Irregular'}</p>
            <div class="flex justify-center items-center">
                <button
                    type="button"
                    class="btn variant-filled-tertiary !rounded-full h6 mx-3"
                    on:click={(e)=>{
                        e.stopPropagation();
                        if (!choices[index][1]){
                            choices[index][1] = true;
                            choices[index][3].forEach((node,nodeIndex) => {
                                node.gain.value = choices[index][0][nodeIndex];
                            });
                        } else {
                            choices[index][1] = false;
                            choices[index][3].forEach(node => {
                                node.gain.value = 0;
                            });
                        }
                    }}
                >
                        {choices[index][1] ? 'Pause' : 'Play'}
                </button>
                <Waveform audioContext={audioContext} gainNodes={choice[3]}/>
            </div>
        </button>
    {/each}
</div>