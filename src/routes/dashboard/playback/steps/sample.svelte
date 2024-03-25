<script lang="ts">
    export let randomSample: (regular: boolean) => void;
    export let sampleByIndex: () => void;
    export let currentIndex: number|null;
</script>

<h4 class="h4 mb-3">Sample row from data</h4>
<button class="btn variant-filled-tertiary !rounded-full text-sm !my-1" on:click={()=>randomSample(true)}>Random sample from "regular" data</button>
<button class="btn variant-filled-tertiary !rounded-full text-sm !my-1" on:click={()=>randomSample(false)}>Random sample from "irregular" data</button>

<div class="inline-flex !my-1">
    <button class="btn variant-filled-tertiary !rounded-l-full text-sm !mr-0" on:click={sampleByIndex}>Sample by Index: </button>
    <input type="number" class="ml-0 h-full m-0 border-tertiary-500 border-2 w-36 rounded-r-full" bind:value={currentIndex} />
</div>