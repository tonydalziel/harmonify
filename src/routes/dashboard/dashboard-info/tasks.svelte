<script lang="ts">
	import { tasks } from "$lib/stores";
	import Icon from "@iconify/svelte";

    let localTasks: Record<string, [string,boolean]> = {};

    tasks.subscribe(value => {
        localTasks = value;
    });
</script>

<div class="text-left flex justify-center items-center bg-primary-50 m-3 p-5 rounded-md max-w-md relative text-sm">
    <ul class="list z-10">
        {#each Object.keys(localTasks) as task}
            <li>
                <span class="max-w-2 max-h-2 min-h-2 min-w-2 rounded-full border {localTasks[task][1]? 'border-success-500 bg-success-500' : 'border-secondary-500'}"/>
                <p class="{localTasks[task][1]? 'font-bold text-success-500 line-through' : ''}">{localTasks[task][0]}</p>
            </li>
        {/each}
    </ul>
    <div class=" object-contain absolute bottom-2 right-10 -rotate-12 text-primary-100">
        <Icon icon="iconoir:sound-high" class=" text-9xl"/>
    </div>
</div>