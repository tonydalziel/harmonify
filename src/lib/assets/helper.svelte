<script lang="ts">
    export let text: string;
    export let modalName: string;
    export let ping: boolean = false;

    import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
			
    const modalStore = getModalStore();

    const modal: ModalSettings = {
        type: 'component',
        component: modalName,
    };
                      
</script>

<div class="flex my-1 text-sm items-center {ping? 'animate-bounce':''}">
    <p>{text}</p>

    <button class="w-6 h-6 bg-warning-50 rounded-full text-center ml-2 relative"
    on:click={()=>modalStore.trigger(modal)}>
        <p>?</p>
    </button>
</div>