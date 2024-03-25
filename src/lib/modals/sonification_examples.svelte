<script lang="ts">
    import { getModalStore } from '@skeletonlabs/skeleton';
    const modalStore = getModalStore();
</script>

<div class="bg-primary-200 rounded-md p-3 max-w-2xl text-center text-sm max-h-[90vh] overflow-scroll">
    <h3 class="my-3 h3">Sonification Examples</h3>
    <div class="text-left">
        <h5 class="my-3 h5">Amplitude Modulation</h5>
        <p>For amplitude modulation, we assign the value of each component from the sampled data to the amplitude of the respective component of a harmonic signal. In naturally occurring harmonic signals, each component of a harmonic signal will have decreasing amplitude. Significant deviations to this rule will sound unnatural. Listen to the three tracks below to find out for yourself:</p>
        <div class="w-full flex justify-center items-center my-3">
            <p class="mx-2 text-left">Harmonic signal with 440 Hz fundamental frequency and 10 components</p>
            <audio controls>
                <source src="/audio/standard.wav" type="audio/wav">
                Your browser does not support the audio element.
            </audio>
        </div>
        <div class="w-full flex justify-center items-center my-3">
            <p class="mx-2 text-left flex-1">Higher amplitude on the 2nd component</p>
            <audio controls>
                <source src="/audio/second_amplitude.wav" type="audio/wav">
                Your browser does not support the audio element.
            </audio>
        </div>
        <div class="w-full flex justify-center items-center my-3">
            <p class="mx-2 text-left flex-1">Higher amplitude on the 9th component</p>
            <audio controls>
                <source src="/audio/ninth_amplitude.wav" type="audio/wav">
                Your browser does not support the audio element.
            </audio>
        </div>


        <h5 class="my-3 h5">Frequency Modulation</h5>
        <p>For frequency modulation, we scale each component of a harmonic signal with the respective normalised component of sampled data. This results in anomalous samples producing extreme frequencies with more variation particularly in earlier components.</p>
        <div class="w-full flex justify-center items-center my-3">
            <p class="mx-2 text-left">Harmonic signal with 440 Hz fundamental frequency and 10 components</p>
            <audio controls>
                <source src="/audio/standard.wav" type="audio/wav">
                Your browser does not support the audio element.
            </audio>
        </div>
        <div class="w-full flex justify-center items-center my-3">
            <p class="mx-2 text-left flex-1">Scaling up frequencies for the 3rd and 4th components</p>
            <audio controls>
                <source src="/audio/second_freq.wav" type="audio/wav">
                Your browser does not support the audio element.
            </audio>
        </div>
        <div class="w-full flex justify-center items-center my-3">
            <p class="mx-2 text-left">Scaling up frequencies for the 2nd, 3rd, and 4th components</p>
            <audio controls>
                <source src="/audio/third_freq.wav" type="audio/wav">
                Your browser does not support the audio element.
            </audio>
        </div>
    </div>
    <button class="btn variant-filled-surface my-3" on:click={()=>modalStore.close()}>Close</button>
</div>