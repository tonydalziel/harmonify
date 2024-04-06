<!--2D ChartJS visualisation of the first two components of the processed data-->

<script lang="ts">
	import { processedData } from '$lib/stores';
    import { Chart, } from 'chart.js/auto';
	import { get } from 'svelte/store';

    export let oscillatorNodes: OscillatorNode[];
    export let gainNodes: GainNode[];
    export let fundamentalFrequency: number;


    let chartCanvas: HTMLCanvasElement | null;
    let chart: Chart | null = null;

    const updateChart = () => {
        if(!chart) return;

        const data: Record<string,number> = {};

        gainNodes.forEach((node,index)=> {
            const frequency = oscillatorNodes[index].frequency.value.toString();
            const amplitude = node.gain.value;
            if (frequency in data){
                data[frequency] += amplitude
            } else {
                data[frequency] = amplitude
            }
        });
        
        chart.config.data.datasets = Object.keys(data).map(freq => ({
            label: `${freq} Hz`,
            data: [
                {x: parseInt(freq), y: 0},
                {x: parseInt(freq), y: data[freq]}
            ],
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 2, // Adjust for line thickness
            fill: false,
            pointRadius: 0, // No points, just lines
            showLine: true // Ensure lines are drawn
        }));

        // chart.config.data.datasets[0].data.push(0);
        chart.update();
    }

    // Define the baseline data object for the frequency amplitude bar plot with values from 20 to 20000 Hz and 0 to 1 amplitude
    // Don't show either axis values but show the titles
    const data = {
        type: 'scatter',
        data: {
            datasets: []
        },
        options: {
            animation: false,
            scales: {
                x: {
                    min:20,
                    max: 20000,
                    title: {
                        display: true,
                        text: 'Frequency (Hz)'
                    }
                },
                y: {
                    min: 0,
                    max: 0.9,
                    
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
  