<script lang="ts">
    import { getModalStore } from '@skeletonlabs/skeleton';
    const modalStore = getModalStore();
</script>

<div class="bg-primary-200 rounded-md p-3 max-w-2xl text-left text-sm max-h-[90vh] overflow-scroll">
    <h3 class="my-3 h3 text-center">Visualisations: What do they show?</h3>
    <h5 class="my-2 h5">Single Waveform</h5>
    <p>The single waveform plot shows each harmonic combined into a single waveform.</p>
    <h5 class="my-2 h5">Split Waveform</h5>
    <p>The split waveform plot shows each wave making up the harmonic. Typically these waves increase in frequency (usually by integer multiples of the fundamental) and decrease in amplitude. Spot outliers by looking for higher components with notably high amplitude. Alternatively, use the slider to see how the waves change, perhaps you can spot some patterns between regular and irregular data!</p>
    <h5 class="my-2 h5">Frequency Plot</h5>
    <p>The frequency plot shows the amplitude and frequency of each wave in the output. Use the slider to see how these values change between the modulated wave and standard harmonic. <br>For amplitude modulation, you will see the bars increase or decrease along the y axis (amplitude). Spot outliers by looking for extremely large amplitudes on higher components. <br>For frequency modulation, you will see the bars slide left and right along the x axis (frequency). Spot outliers by looking for frequency bars swapping place! This means the data point is extremely far from the mean on that component (usually an outlier!).</p>
    <button class="btn variant-filled-surface my-3" on:click={()=>modalStore.close()}>Close</button>
</div>