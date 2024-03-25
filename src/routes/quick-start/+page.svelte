<script lang="ts">
	import { Step, Stepper, Toast } from '@skeletonlabs/skeleton';
    import Step1 from './steps/1.svelte';
    import Step2 from './steps/2.svelte';
    import Step3 from './steps/3.svelte';
    import Step4 from './steps/4.svelte';
    import Step5 from './steps/5.svelte';
    import Step6 from './steps/6.svelte';

    import { initializeStores } from '@skeletonlabs/skeleton';

    initializeStores();

    // Function which redirects the user to the dashboard
    function redirectToDashboard(){
        window.location.href = '/dashboard?useCase=experiment';
    }

    const steps = {
        "generate": false,
        "harmonic": false,
        "played": false,
        "correct": false
    }
</script>
<Toast />

<div class="flex flex-wrap justify-between items-center w-[90%] mx-auto mt-5 mb-10">
    <h1 class="h1">Quick Start Guide</h1>
    <a href="/" class="inline mx-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">Home</a>
</div>
<Stepper class="w-[90%] mx-auto my-10" buttonCompleteLabel="Explore the dashboard" on:complete={redirectToDashboard}>
	<Step>
		<svelte:fragment slot="header">What Does Harmonify Do?</svelte:fragment>
		<Step1 />
	</Step>
	<Step locked={!steps["generate"]}>
		<svelte:fragment slot="header">1. Importing or generating high dimensional data</svelte:fragment>
		<Step2 bind:dataCreated={steps["generate"]}/>
	</Step>
    <Step locked={!steps["harmonic"]}>
		<svelte:fragment slot="header">2. Mapping data to an audio signal</svelte:fragment>
        <Step3 bind:playedAll={steps["harmonic"]}/>
	</Step>
    <Step locked={!steps["played"]}>
		<svelte:fragment slot="header">2. Mapping data to an audio signal</svelte:fragment>
        <Step4 bind:playedFull={steps["played"]}/>
	</Step>
    <Step locked={!steps["correct"]}>
		<svelte:fragment slot="header">3. Listen and explore</svelte:fragment>
        <Step5 bind:correctlyGuessed={steps["correct"]}/>
	</Step>
    <Step>
		<svelte:fragment slot="header">You Can Now Sonify Data</svelte:fragment>
        <Step6 />
	</Step>
</Stepper>