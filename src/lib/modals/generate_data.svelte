<script lang="ts">
	import { generateNewData } from '$lib/generate_data';
	import { tasks } from '$lib/stores';
	import { completeTask } from '$lib/utils';
    import { getModalStore } from '@skeletonlabs/skeleton';

    const modalStore = getModalStore();
    let loading: boolean = false;

    const GenerateData = (clusters: number) => {
        loading = true;
        if (clusters > 1 && ! $tasks["generate"][1] ) completeTask("generate");
        generateNewData(950,50,100,clusters);
        if($modalStore[0].response){
            if(clusters == 1) $modalStore[0].response("Generated Test Data");
            else $modalStore[0].response("Generated Clustered Test Data");
            
            modalStore.close();
        }
        loading = false;
    }
</script>

<div class="bg-primary-200 rounded-md p-3 max-w-2xl text-center text-sm max-h-[90vh] overflow-scroll f">
    <h3 class="my-3 h3">Generate Data</h3>
    <p class="my-2">If you don't have your own data and you just want to explore how this tools works, use the following buttons to generate your own test data! We generate test data by sampling from either a gaussian distribution or many gaussian distributions (for clusters!) for each dimension. All generated data will have PCA performed on it automatically.</p>
    <button class="btn variant-filled-tertiary !rounded-full block mx-auto my-3" on:click={()=>GenerateData(1)} disabled={loading}>Generate Test Data</button>
    <button class="btn variant-filled-tertiary !rounded-full block mx-auto my-3" on:click={()=>GenerateData(3)} disabled={loading}>Generate Clustered Test Data</button>
    <p class="my-2 italic">Note: We recommend performing clustering on all clustered data as otherwise the sonification will not work as intended.</p>
    <button class="btn variant-filled-surface my-3" on:click={()=>modalStore.close()} disabled={loading}>Close</button>
</div>