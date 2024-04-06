<script lang="ts">
    import { getModalStore } from '@skeletonlabs/skeleton';
    const modalStore = getModalStore();
</script>

<div class="bg-primary-200 rounded-md p-3 max-w-2xl text-center text-sm max-h-[90vh] overflow-scroll">
    <h3 class="my-3 h3">See Clusters of Data? What to do</h3>
    <p class="my-2">Seeing clustered data is perfectly normal. Perhaps you have data from 3 different sources and you are looking for irregular data across them. This may result in 3 “regular” looking clusters with "irregular" data mixed around. You can use clustering to stop this impacting your sonification!</p>
    <p class="my-2"> As we aim to exploit a relationship between "regular" latent variables, we must ensure they are all consistent. You can use clustering to stop clusters influencing your sonification using the steps provided below:</p>
    <ol class="my-2 list">
        <li>
            <span class="font-bold">Step 1: </span>
            <span>Count the number of clusters you see? Let's say "3" as in the example below.</span>
        </li>
        <li>
            <span class="font-bold">Step 2: </span>
            <span>Click the settings button.</span>
        </li>
        <li>
            <span class="font-bold">Step 3: </span>
            <span>Find the clustering option, click the tick box and enter "3".</span>
        </li>
        <li>
            <span class="font-bold">Step 4: </span>
            <span class="max-w-lg text-left">Click Submit. Harmonify will use k-means clustering to find the clusters before performing PCA on each one.</span>
        </li>
    </ol>

    <img src="/clusters.png" alt="scatter plot graphic" class="w-full mx-auto" />

    <button class="btn variant-filled-surface my-3" on:click={()=>modalStore.close()}>Close</button>
</div>