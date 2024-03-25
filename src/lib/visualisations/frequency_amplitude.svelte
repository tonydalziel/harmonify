<!--2D ChartJS visualisation of the first two components of the processed data-->

<script lang="ts">
	import { processedData, setupInformation } from '$lib/stores';
    import { Chart, } from 'chart.js/auto';
	import { get } from 'svelte/store';

    export let oscillatorNodes: OscillatorNode[];
    export let gainNodes: GainNode[];
    export let fundamentalFrequency: number;


    let chartCanvas: HTMLCanvasElement | null;
    let chart: Chart | null = null;

    const updateChart = () => {
        if(!chart) return;
        chart.config.data.datasets[0].data = Array(1000).fill(0);
        // Split the line into 1000 points depending on the min and max of the frequency + 10 %
        const frequencies = oscillatorNodes.map(node => node.frequency.value);
        const amplitudes = gainNodes.map(node => node.gain.value);
        const min = Math.min(Math.min(...frequencies) * 0.9, fundamentalFrequency * 0.9);
        const max = Math.max(Math.max(...frequencies) * 1.1, fundamentalFrequency * (get(processedData).visibleComponents - 1) * 1.1);
        const step = (max - min) / 1000;

        chart.config.data.labels = Array(1000).fill(0).map((_, index) => Math.round(min + index * step));
        
        frequencies.forEach((frequency, index) => {
            const amplitude = amplitudes[index];
            const frequencyIndex = Math.floor((frequency - min) / step);
            if (chart){
                if (chart) {
                    const currentData = chart.config.data.datasets[0].data[frequencyIndex];
                    if (typeof currentData === 'number') {
                        chart.config.data.datasets[0].data[frequencyIndex] = currentData + amplitude;
                    }
                }
            }
        });

        chart.update();
    }

    // Define the baseline data object for the frequency amplitude bar plot with values from 20 to 20000 Hz and 0 to 1 amplitude
    // Don't show either axis values but show the titles
    const data = {
        type: 'line',
        data: {
            labels: Array(1000).fill(0).map((_, index) => index),
            datasets: [{
                label: 'Frequency Amplitude',
                data: Array(1000).fill(0),
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Frequency (Hz)'
                    }
                },
                y: {
                    min: 0,
                    max: 0.5,
                    
                    title: {
                        display: true,
                        text: 'Amplitude'
                    }
                }
            }
        }
    };
    

    // If the selectedPointsLocal changes and the scatter plot has been defined, update the scatter plot with the new selected points
    // The first dataset in the scatter plot is the selected points 
    $:if (oscillatorNodes && chart && gainNodes){
        updateChart();
    }

    let doneOnce = false;
    $: if (chartCanvas && !doneOnce){
        const context = chartCanvas.getContext('2d');
        if(context){
            context.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
            chart = new Chart(chartCanvas, data as any);
            doneOnce = true;
        }

        updateChart();
    }
</script>

<canvas bind:this={chartCanvas} class="w-full aspect-video m-2"></canvas>
  