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

<h4 class="h4 mt-6 mb-3 mx-3">Now that we have some data, we need to map it to a sound. But where do we start?</h4>
<h4 class="h5 m-3">Our approach makes use of a natural phenomena, harmonic signals. It may be no suprise to hear that when you pluck a guitar string or tap a pan you hear more than a single oscilating wave. Instead the sound consists of several "harmonics" each making the sound "natural". These harmonics are integer multiples of the first wave's frequency each with decreasing amplitude.</h4>
<h4 class="h5 m-3">For our sonification, we use the latent data (another name for the reduced representation) calculated previously to scale either the frequencies or amplitudes of these harmonics, making specific components of the sound stand out.</h4>
<h4 class="h5 m-3">Below is a harmonic signal with a fundamental frequency (the first wave's frequency) of 200 Hz and 5 components. <b class="text-primary-500">Have a go turning on each component by clicking their box</b>. You will see the signal sounds most natural with all 5 components turned on!</h4>
{#each gainNodes as displayNode, index}
    <button on:click={toggleHarmonic(index)} class="block my-3 w-[80%] mx-auto">
        <p>Component {index+1}: {oscilatorNodes[index].frequency.value} Hz</p>
        <Waveform audioContext={audioContext} gainNodes={displayNode}/>
    </button>
{/each}