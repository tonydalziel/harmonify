<script lang="ts">
    import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';

    export let dataType: string;
			
    const modalStore = getModalStore();

    const openModal = (name: string) => {
        new Promise<string>((resolve) => {
                modalStore.trigger({
                    type: 'component',
                    component: name,
                    response: (r: string) => resolve(r)
                });
            }).then((r: string) => {
                if(r){
                    dataType = r;
                }
        });
    }
</script>

<div>
    <button type="button" class="btn variant-filled-tertiary !rounded-full"
    on:click={()=>openModal('generateData')}>
        Generate Data
    </button>
    
    <button type="button" class="btn variant-filled-tertiary !rounded-full"
    on:click={()=>openModal('uploadData')}
    >
        Upload Data
    </button>
    
    <p class="inline m-2 text-success-500 {dataType== ''? 'text-warning-700' : ''}">
        Current data: {dataType}
    </p>
</div>