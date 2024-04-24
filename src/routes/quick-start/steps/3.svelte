<script lang="ts">
	import { onMount } from "svelte";
    import Waveform from "$lib/visualisations/waveform.svelte";
	import { browser } from "$app/environment";

    export let playedAll: boolean;

    const harmonics = [false, false, false, false, false];
    const gainNodes: GainNode[] = [];
    const oscilatorNodes: OscillatorNode[] = [];
    let audioContext: AudioContext;
    
    const toggleHarmonic = (index: number) => () => {
        if(audioContext){
            harmonics[index] = !harmonics[index];
            gainNodes[index].gain.value = harmonics[index] ? (1/2)**(index+1) : 0;
        }
    };

    $: if (harmonics.every(harmonic => harmonic)){
        playedAll = true;
    }

    // Initialise the audio context on mount
    onMount(()=> {
        if(browser){
            audioContext = new AudioContext();
            if(audioContext !== null){
            // Add an oscillator and gain node for each harmonic
                harmonics.forEach((_, index) => {
                    if(audioContext){
                        const oscillator = audioContext.createOscillator();
                        const gain = audioContext.createGain();
                        gain.gain.value = 0;
                        oscillator.connect(gain);
                        gain.connect(audioContext.destination);
                        oscillator.type = 'sine';
                        oscillator.frequency.value = 440 * (index + 1);
                        oscillator.start();
                        oscilatorNodes.push(oscillator);
                        gainNodes.push(gain);
                    }
                });
            }
        }

        return () => {
            if(audioContext){
                audioContext.close();
            }
        };
    });
</script>

<p class="m-3">Our sonification approach makes use of a natural phenomena: harmonic overtones. It may be no suprise to hear that when you pluck a guitar string or tap a pan you hear more than a single oscilating wave. Instead the sound consists of several "harmonics" each making the sound "natural". These harmonics have frequencies that are integer multiples of the first wave's each with decreasing amplitude.</p>
<h4 class="m-3">Below are the seperate harmonics that make up a natural signal. <b class="text-primary-500">Have a go clicking on each waveform to turn it on</b>. You will hear the signal sounds most natural with all 5 components turned on!</h4>
{#each gainNodes as displayNode, index}
    <button on:click={toggleHarmonic(index)} class="block my-3 w-[80%] mx-auto">
        <p>Harmonic {index+1}: {oscilatorNodes[index].frequency.value} Hz</p>
        <Waveform audioContext={audioContext} gainNodes={displayNode}/>
    </button>
{/each}