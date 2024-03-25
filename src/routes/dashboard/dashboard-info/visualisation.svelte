<!--2D ChartJS visualisation of the first two components of the processed data-->

<script lang="ts">
    import {
        Chart,
    } from 'chart.js/auto';
    import { onMount } from 'svelte';
    import { processedData, selectedPoints } from '$lib/stores';
    
    import Helper from '$lib/assets/helper.svelte';

    let selectedPointsLocal: number[][] = [];
    let scatterCanvas: HTMLCanvasElement | null;
    let scatter: Chart | null = null;
    let expectedData: number[][];
    let anomalousData: number[][];
    let clusters: number[];
    // Determines whether the current visualisation is displaying clusters
    let displayingClusters: boolean = false;

    selectedPoints.subscribe(value => {
        selectedPointsLocal = Object.values(value);
    });

    // Subscribe to the processedData store. Update the expectedData, anomalousData, and clusters for visualisation
    processedData.subscribe(value => {
        expectedData = value.expectedData;
        anomalousData = value.anomalousData;
        clusters = value.clusters;
    });

    // Define the baseline data object for the scatter plot (assuming no clusters are present)
    const data = {
        type: "scatter",
        data: {
        datasets: [
        {
          label: 'Selected Points',
          backgroundColor: 'rgba(60,179,113,.5)',
          borderColor: 'rgba(60,179,113,0.5)',
          borderWidth: 2,
          data: [],
        },
        {
          label: 'Gaussian',
          backgroundColor: 'rgba(255, 99, 132, .5)',
          borderColor: 'rgba(255, 99, 132, .2)',
          borderWidth: 1,
          data: [],
        },
        {
          label: 'Anomaly',
          backgroundColor: 'rgba(99,0,125, .5)',
          borderColor: 'rgba(99,0,125, .2)',
          borderWidth: 1,
          data: [],
        }
      ],
      },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Component 1'
                },
                display: true,
            },
            y: {
                title: {
                    display: true,
                    text: 'Component 2'
                },
                display: true,
            }
        }
    },
    };

    // If the selectedPointsLocal changes and the scatter plot has been defined, update the scatter plot with the new selected points
    // The first dataset in the scatter plot is the selected points 
    $:if (selectedPointsLocal && scatter){
        scatter.config.data.datasets[0].data = [];
        for (let i = 0; i < selectedPointsLocal.length; i++) {
            if (selectedPointsLocal[i].length < 2) continue;
            scatter.config.data.datasets[0].data.push({
                x: selectedPointsLocal[i][0],
                y: selectedPointsLocal[i][1],
            });
        }
        scatter.update();
    }

    // If the expectedData and anomalousData are defined (as provied by the processedData store), update the scatter plot with the new data
    $: if (expectedData && anomalousData && scatter) {

        // If clusters are present, update the scatter plot data object to include the clusters with random colours
        if (clusters.length > 0) {

            if(!displayingClusters) {
                displayingClusters = true;
                // Redefine the data object to include the clusters
                scatter.config.data.datasets = [{
                    label: 'Selected Points',
                    backgroundColor: 'rgba(60,179,113,.5)',
                    borderColor: 'rgba(60,179,113,0.5)',
                    borderWidth: 2,
                    data: [],
                    },
                    {
                    label: 'Anomalous Data',
                    backgroundColor: 'rgba(99,0,125, .5)',
                    borderColor: 'rgba(99,0,125, .2)',
                    borderWidth: 1,
                    data: [],
                    }
                ];

                // For each cluster, add a new dataset to the data object
                for (let i = 0; i <= Math.max(...clusters); i++) {
                    const r = Math.floor(Math.random() * 255);
                    const g = Math.floor(Math.random() * 255);
                    const b = Math.floor(Math.random() * 255);
                    scatter.config.data.datasets.push({
                        label: `Cluster ${i+1}`,
                        backgroundColor: `rgba(${r},${g},${b},.5)`,
                        borderColor: `rgba(${r},${g},${b},.2)`,
                        borderWidth: 1,
                        data: [],
                    });
                }
            }

            // Clear all previous cluster data
            for (let i = 1; i < scatter.config.data.datasets.length; i++) {
                scatter.config.data.datasets[i].data = [];
            }

            expectedData.forEach((point, index) => {
                if(!scatter) return;
                scatter.config.data.datasets[clusters[index]+2].data.push({
                    x: point[0],
                    y: point[1],
                });
            });

            anomalousData.forEach((point) => {
                if(!scatter) return;
                scatter.config.data.datasets[1].data.push({
                    x: point[0],
                    y: point[1],
                });
            });
        } else if (clusters.length == 0) {

            // Redefine the data object to remove the clusters if they are not present
            if (displayingClusters){
                displayingClusters = false;
                scatter.config.data.datasets = [
                    {
                    label: 'Selected Points',
                    backgroundColor: 'rgba(60,179,113,.5)',
                    borderColor: 'rgba(60,179,113,0.5)',
                    borderWidth: 2,
                    data: [],
                    },
                    {
                    label: 'Expected Data',
                    backgroundColor: 'rgba(255, 99, 132, .5)',
                    borderColor: 'rgba(255, 99, 132, .2)',
                    borderWidth: 1,
                    data: [],
                    },
                    {
                    label: 'Anomalous Data',
                    backgroundColor: 'rgba(99,0,125, .5)',
                    borderColor: 'rgba(99,0,125, .2)',
                    borderWidth: 1,
                    data: [],
                    }
                ];
            }

            scatter.config.data.datasets[1].data = [];
            scatter.config.data.datasets[2].data = [];

            expectedData.forEach((point) => {
                if(!scatter) return;
                scatter.config.data.datasets[1].data.push({
                    x: point[0],
                    y: point[1],
                });
            });

            anomalousData.forEach((point) => {
                if(!scatter) return;
                scatter.config.data.datasets[2].data.push({
                    x: point[0],
                    y: point[1],
                });
            });
        }
        scatter.update();
    }

    // Generate the scatter plot on mount using the default data object
    onMount(()=> {
        if (scatterCanvas == null) return;
        scatter = new Chart(scatterCanvas, data as any);
    })
</script>

<div class="max-w-xl rounded-md bg-primary-50 m-3 p-5">
    <h3 class="h3">Component Visualisation</h3>
    <div class="my-2 flex justify-between">
        <Helper text="Find out more" modalName="latentScatterInfo"></Helper>
        <Helper text="See clusters" modalName="clusterInfo" ping={$processedData.pca === null}></Helper>
    </div>
    <canvas bind:this={scatterCanvas} class="w-[45vw] aspect-video m-2"></canvas>
</div>
  