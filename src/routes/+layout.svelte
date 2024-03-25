<script lang="ts">
	import '../app.postcss';
    import { initializeStores, Toast, type ModalComponent } from '@skeletonlabs/skeleton';
    import { Modal } from '@skeletonlabs/skeleton';

    // Modal imports
    import LatentScatterInfo from '$lib/modals/latent_scatter_info.svelte';
    import ClusterInfo from '$lib/modals/clusters.svelte';
    import GenerateData from '$lib/modals/generate_data.svelte';
    import UploadData from '$lib/modals/upload_data.svelte';
    import Settings from '$lib/modals/settings.svelte';
    import SonificationExamples from '$lib/modals/sonification_examples.svelte';
	import Visualisations from '$lib/modals/visualisations.svelte';

    initializeStores();

    const modalRegistry: Record<string, ModalComponent> = {
        // Set a unique modal ID, then pass the component reference
        latentScatterInfo: { ref: LatentScatterInfo },
        clusterInfo: { ref: ClusterInfo },
        generateData: { ref: GenerateData },
        uploadData: { ref: UploadData },
        settings: { ref: Settings },
        sonificationExamples: { ref: SonificationExamples },
        visualisations: { ref: Visualisations }
    };
							
</script>

<Modal components={modalRegistry}/>
<Toast />
<slot />
