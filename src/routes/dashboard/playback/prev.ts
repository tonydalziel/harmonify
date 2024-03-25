<div class="min-w-[48%] h-fit bg-white/90 backdrop-blur-md rounded-md m-3 p-5">
    <div class="flex justify-between items-center">
        <h1 class="h2 text-slate-500">Data Playback</h1>
        <button type="button" class="btn-icon bg-gradient-to-br variant-gradient-secondary-primary m-3"
        on:click={closeWindow}
        disabled={playing}>
            <Icon icon="material-symbols:close" height={18}/>
        </button>
    </div>
    <button type="button" class="btn bg-gradient-to-br variant-gradient-primary-tertiary inline m-2 rounded-full" on:click={()=>sample(true)}>Sample from expected</button>
    <button type="button" class="btn bg-gradient-to-br variant-gradient-primary-tertiary inline m-2 rounded-full" on:click={()=>sample(false)}>Sample from anomalous</button>
    <div class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-full m-2 w-3/4">
        <button class="input-group-shim p-2">Row ID</button>
        <input
            bind:value={currentIndex}
            class="bg-transparent border-0 ring-0 p-2"
            name="prompt"
            id="prompt"
            type="number"
        />
        <button class="bg-gradient-to-br variant-gradient-primary-tertiary"
        on:click={sampleByIndex}>Sample</button>
    </div>
    <div class="m-1 hover:bg-white/10">
        <select class="select rounded-md opacity-70 hover:opacity-100" bind:value={amplitudeOption} disabled={playing}>
            <option value={true}>Amplitude Modulation</option>
            <option value={false}>Frequency Modulation</option>
        </select>
    </div>
    <!--Select between the actual wave, FFT, or raw values-->
    <TabGroup class="text-primary-900">
        <Tab bind:group={tabSet} name="tab1" value={0}>
            <svelte:fragment slot="lead"><Icon icon="mdi:sine-wave" class="text-center my-1" height={18}/></svelte:fragment>
            <span>Single Waveform</span>
        </Tab>
        <Tab bind:group={tabSet} name="tab2" value={1}>
            <svelte:fragment slot="lead"><Icon icon="mdi:sine-wave" class="text-center my-1" height={18}/></svelte:fragment>
            <span>Split Waveform</span>
        </Tab>
        <Tab bind:group={tabSet} name="tab4" value={2}>
            <svelte:fragment slot="lead"><Icon icon="icon-park-solid:data-two" class="text-center my-1" height={18}/></svelte:fragment>
            <span>Raw Input</span>
        </Tab>
        <!-- Tab Panels --->
        <svelte:fragment slot="panel">
            {#if tabSet === 0}
                {#if audioContext}
                    <WaveForm bind:audioContext={audioContext} bind:gainNodes={gainNodes}/>
                {:else}
                    <p>Awaiting audio context</p>
                {/if}
            {:else if tabSet === 1}
                {#if audioContext && gainNodes.length > 0}
                    {#each gainNodes.slice(0,maxInView) as displayNode}
                        <WaveForm bind:audioContext={audioContext} bind:gainNodes={displayNode}/>
                    {/each}
                    <div class="w-full flex justify-center items-center">
                        <button type="button" class="btn-icon bg-gradient-to-br variant-gradient-secondary-primary my-3 text-white"
                        on:click={
                        ()=>{if(maxInView==4){
                            maxInView=gainNodes.length;
                        }else{
                            maxInView=4;
                        }
                        }}>{maxInView<=Math.min(4,gainNodes.length)?'+':'-'}</button>
                    </div>
                {:else}
                    <p>Awaiting audio context. Click play to view.</p>
                {/if}
            {:else if tabSet === 2}
                {#if currentPoint.length > 0}
                    <Table class="text-white max-w-xl overflow-x-scroll" bind:source={tableSimple} />
                {:else}
                    Select a sample to view the raw input
                {/if}
                
            {/if}
        </svelte:fragment>
    </TabGroup>
    <div class="w-full my-2">
        <div class="w-full flex justify-between items-center text-secondary-900">
            <p>Single Sin Wave</p>
            <p>Modulated Harmonic Sequence</p>
        </div>
        <RangeSlider name="range-slider" bind:value={sliderValue} min={0} max={1} step={0.1} ticked accent={"accent-primary-900 dark:accent-primary-900"}></RangeSlider>
    </div>
    <div class="w-full mt-3 flex justify-start items-center">
        <button type="button" class="btn-icon h-10 bg-gradient-to-br variant-gradient-secondary-primary m-3 text-white"
        on:click={updateSampleStatus}
        disabled={currentPoint.length === 0}
        >
            {#if !playing}
                <Icon icon="mdi:play" height={18}/>
            {:else}
                <Icon icon="material-symbols:pause" height={18}/>
            {/if}
        </button>
        <p class="text-primary-900 mx-1">Frequency: </p>
        <input disabled={playing} class="ml-1 px-1 rounded-md input" type="number" bind:value={baseFrequency} min={1} max={20000} step={1} />
        <p class="text-primary-900 mx-1">x</p>
        <select disabled={playing} class="input ml-1 px-1 rounded-md" bind:value={frequencyMultiplierOption}>
            <option value={`f${1}`} >1</option>
            {#each currentPoint as value,index}
                <option value={`i${index}`}>PC{index+1}: {Math.abs(value)}</option>
            {/each}
            {#if cluster !== null}
                <option value={`c`}>Cluster Assignment: {cluster+1}</option>
            {/if}
        </select>
        <p class="text-primary-900 mx-1">Hz</p>
    </div>
</div>