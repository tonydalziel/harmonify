<script lang="ts">
    import Icon from '@iconify/svelte';
</script>

<div class="flex flex-col w-screen min-h-screen justify-center items-center text-center">
    <h1 class="h1 my-3">harmonify</h1>
    <p class="my-3">Explore data with sound</p>
    <img src="/intro_diagram.png" alt="harmonify flow" class="w-[80%] mx-auto" />
    <div class="flex justify-between w-[80%] flex-wrap">
        <div class="grow basis-1 bg-primary-100 m-3 p-2 rounded-md">
            <h3 class="h3 mb-2">New User?</h3>
            <nav class="list-nav">
                <ul>
                    <li>
                        <a target="_self" href="/quick-start">
                            <span class="badge bg-primary-300"><Icon icon="material-symbols:play-lesson" /></span>
                            <span class="flex-auto">Quick Start Guide</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
        <div class="grow basis-1 bg-primary-100 m-3 p-2 rounded-md">
            <h3 class="h3 mb-2">Returning User?</h3>
            <nav class="list-nav">
                <ul>
                    <li>
                        <a target="_self" href="/dashboard?useCase=experiment">
                            <span class="badge bg-primary-300"><Icon icon="material-symbols:experiment" /></span>
                            <span class="flex-auto">Experiment with generated test data</span>
                        </a>
                    </li>
                    <li>
                        <a target="_self" href="/dashboard?useCase=upload">
                            <span class="badge bg-primary-300"><Icon icon="material-symbols:upload" /></span>
                            <span class="flex-auto">Upload my own data</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
    <a href="/technical"><button class="btn variant-filled-primary my-3">Read the technical report</button></a>
</div>
