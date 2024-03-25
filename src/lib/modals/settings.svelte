<!-- Modal allowing users to alter settings for data processing and sonification -->

<script lang="ts">

    // SvelteComponent used to expose parent props to this component for styling.
	import type { SvelteComponent } from 'svelte';

	// Stores are used to update the preset settings and whether the app is in a loading state.
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { setupInformation, loading } from '$lib/stores';
	import { completeTask } from '$lib/utils';

	// Props
	export let parent: SvelteComponent;

    // Modal store is used to pass the response back to the parent component.
	const modalStore = getModalStore();

    // Loading information to prevent a user from submitting the form multiple times.
	let localLoading: boolean = false;
	loading.subscribe(value => {
		localLoading = value;
	});

	// A copy of the current settings that a user can modify
	let sessionSettings: Settings = {
		visibleComponents: {
			option: "Fixed",
			value: 2
		},
		primeOnly: false,
		cluster: false,
		numClusters: 1
	};
    let startingVisbleComponents = {
        option: "Fixed",
        value: 2
    }

    // Takes a copy of the current settings
	setupInformation.subscribe(value => {
        startingVisbleComponents.value = value.visibleComponents.value;
        startingVisbleComponents.option = value.visibleComponents.option;
		sessionSettings = value;
	});

	// Custom submit function to pass the response and close the modal. (provided by SkeletonUI)
	function onFormSubmit(): void {
        if (sessionSettings.visibleComponents.option !== startingVisbleComponents.option || sessionSettings.visibleComponents.value !== startingVisbleComponents.value) {
            completeTask("components");
        }
        if (sessionSettings.cluster) {
            completeTask("cluster");
        }
		setupInformation.set(sessionSettings);
		modalStore.close();
	}

	// Base Classes
	const cBase = 'card p-5 m-3 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

<div class="modal-example-form {cBase}">
    <header class={cHeader}>Sonification Settings</header>
    <article>Use the following controls to alter the way in which data is processed and sonified.</article>
    <!-- Enable for debugging: -->
    <form class="modal-form {cForm}">
        <div class="m-1 hover:bg-white/10">
            <h1 class="h4">Audible Components</h1>
            <p class="text-sm my-2">Note: The following settings are only relevant to generated data or uploaded unprocessed data. Otherwise, use a fixed number of components.</p>
            <label class="flex justify-start items-center m-2">
                <input class="radio mr-2" type="radio" bind:group={sessionSettings.visibleComponents.option} name="pcaSettingSelect" value="Fixed" />
                {#if sessionSettings.visibleComponents.option == "Fixed"}
                    <div class="flex justify-start items-center">
                        <p class="inline-block min-w-max">Fixed Value: </p>
                        <input class="ml-1 px-1 rounded-md input min-w-full" type="number" bind:value={sessionSettings.visibleComponents.value} min={2} step={1} />
                    </div>
                {:else}
                    Fixed Value
                {/if}
            </label>
            <label class="flex justify-start items-center m-2">
                <input class="radio mr-2" type="radio" bind:group={sessionSettings.visibleComponents.option} name="pcaSettingSelect" value="Percentage Variance" />
                {#if sessionSettings.visibleComponents.option == "Percentage Variance"}
                <div class="flex justify-start items-center">
                    <p class="inline-block min-w-max">Percentage Variance Covered: </p>
                    <input class="ml-1 px-1 rounded-md input min-w-full" type="number" bind:value={sessionSettings.visibleComponents.value} min={1} max={100} step={1} />
                </div>
                {:else}
                    Percentage Variance Covered
                {/if}
            </label>
            <label class="flex justify-start items-center m-2">
                <input class="radio mr-2" type="radio" bind:group={sessionSettings.visibleComponents.option} name="pcaSettingSelect" value="Kaiser" />
                Kaiser Criterion
            </label>
        </div>
        <div class="m-1 hover:bg-white/10">
            <h1 class="h4">Missing Fundamental Problem</h1>
            <p>Enable this option to generate only prime harmonics, reducing the 'missing fundamental' effect.</p>
            <input class="checkbox m-1" type="checkbox" bind:checked={sessionSettings.primeOnly} />
        </div>
        <div class="m-1 hover:bg-white/10">
            <h1 class="h4">Clustering Data</h1>
            <p>Enable this option to cluster data using k-means clustering before performing PCA.</p>
            <p class="text-sm my-2">Note: The following settings are only relevant to generated data or uploaded unprocessed data</p>
            <input class="checkbox m-1" type="checkbox" bind:checked={sessionSettings.cluster} />
            {#if sessionSettings.cluster}
                <p>Number of clusters: </p>
                <input class="m-1 px-1 rounded-md input" type="number" bind:value={sessionSettings.numClusters} min={1} step={1} />
            {/if}
        </div>
    </form>
    <footer class="modal-footer {parent.regionFooter}">
    <button class="btn {parent.buttonNeutral}" on:click={parent.onClose} disabled={localLoading}>{parent.buttonTextCancel}</button>
    {#if localLoading}
        <button class="btn p-6 placeholder animate-pulse" disabled>Loading...</button>
    {:else}
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Submit Form</button>
    {/if}
</footer>
</div>