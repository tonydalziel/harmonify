<script lang="ts">
	import { generateNewData } from '$lib/generate_data';
    import { onMount } from 'svelte';

    import DataButtons from './nav/data_buttons.svelte';

	import Tasks from './dashboard-info/tasks.svelte';
    import Visualisation from './dashboard-info/visualisation.svelte';
    import Settings from './dashboard-info/setup.svelte';

    import Playback from './playback/main.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';

    let dataType: string = '';
    let hideTask: boolean = false;
    let playbackWindows: Set<number> = new Set<number>();
    const modalStore = getModalStore();

    // Function to add a new randomly indexed playback window
    function newPlayback(){
        let newWindow = Math.floor(Math.random() * 1000);
        while (playbackWindows.has(newWindow)){
            newWindow = Math.floor(Math.random() * 1000);
        }
        playbackWindows.add(newWindow);
        playbackWindows = playbackWindows;
    }

    // Function to remove a playback window
    function removePlayback(e: CustomEvent){
        const index = e.detail.index;
        playbackWindows.delete(index);
        playbackWindows = playbackWindows;
    }

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const useCase: string|null = urlParams.get('useCase');
        if(useCase){
            if(useCase == 'experiment'){
                generateNewData();
                playbackWindows.add(0);
                playbackWindows = playbackWindows;
                dataType = 'Generated Test Data';
            } else if(useCase == 'upload') {
                new Promise<string>((resolve) => {
                        modalStore.trigger({
                            type: 'component',
                            component: 'uploadData',
                            response: (r: string) => resolve(r)
                        });
                    }).then((r: string) => {
                        if(r){
                            dataType = r;
                        }
                });
            }
        }
    });
</script>

<div class="w-full p-2 bg-primary-50 flex justify-between items-center flex-wrap">
    <DataButtons bind:dataType />
    <div class="my-2">
        <a href="/" class="inline mx-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">Home</a>
        <a href="/quick-start" class="inline mx-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">Quick Start Guide</a>
    </div>
</div>

<!--Settings bar-->
<div class="w-full bg-primary-100 flex justify-center items-center flex-wrap lg:flex-nowrap overflow-hidden">
    {#if !hideTask}
        <Tasks on:close={()=>hideTask=true}/>
    {/if}
    <Visualisation />
    <Settings />
</div>

{#each playbackWindows as window}
    <Playback windowIndex={window} on:close={removePlayback}/>
{/each}

<div class="w-full flex justify-center items-center my-3">
    <button class="btn variant-ghost-secondary"
    on:click={newPlayback}>Add Playback Window</button>
</div>


