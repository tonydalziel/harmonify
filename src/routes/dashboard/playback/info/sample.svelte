<script lang="ts">
	import { processedData, selectedPoints } from "$lib/stores";
	import Icon from "@iconify/svelte";
	import { Table, type TableSource } from "@skeletonlabs/skeleton";

    export let currentIndex: number|null;
    export let windowIndex: number;
    export let cluster: number|null;

    let viewRawData: boolean = false;
    let viewAbsoluteValues: boolean = false;

    // Generic table source for viewing raw data
    const rawData: TableSource = {
        head: [],
        body: []
    };

    const absoluteData: TableSource = {
        head: [],
        body: []
    };

    // Update the raw data table when the selected point changes
    $: if($selectedPoints[windowIndex] !== undefined){
        const currentPoint = $selectedPoints[windowIndex];
        rawData.head = [];
        absoluteData.head = [];
        for (let i=0; i<currentPoint.length; i++) {
            rawData.head.push("Component " + (i+1).toString());
            absoluteData.head.push("Component " + (i+1).toString());
        }
        // Set the table body as the current point mapped to strings
        rawData.body = [currentPoint.map(value => (Math.round((value + Number.EPSILON) * 100) / 100).toString())];
        absoluteData.body = rawData.body.map(row => row.map(value => Math.abs(parseFloat(value)).toString()));
    }
</script>

<div class="text-sm px-3">
    {#if currentIndex && $selectedPoints[windowIndex]}
        <p>Data Point (Row) Index: {currentIndex}</p>
        <p>This data point is <b>{currentIndex < $processedData.expectedData.length ? 'Regular' : 'Irregular'}</b></p>

        {#if cluster !== null}
            <p>Cluster assignment: {cluster+1}</p>
        {/if}

        <div class="w-full my-1 overflow-auto">
            <button class="font-bold my-1"
            on:click={()=>viewRawData=!viewRawData}>View Raw Data <Icon icon="teenyicons:down-outline" class="inline mx-1"/></button>
            {#if viewRawData}
                <Table source={rawData} />
            {/if}
        </div>

        <div class="w-full my-1 overflow-auto">
            <button class="font-bold my-1"
            on:click={()=>viewAbsoluteValues=!viewAbsoluteValues}>View Absolute Values <Icon icon="teenyicons:down-outline" class="inline mx-1"/></button>
            {#if viewAbsoluteValues}
                <Table source={absoluteData} />
            {/if}
        </div>
    {/if}
</div>
