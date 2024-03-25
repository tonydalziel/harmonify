<!--Playback window used to sample from the processed data and perform sonification-->

<script lang="ts">
    import { type ToastSettings, getToastStore } from '@skeletonlabs/skeleton';
    import Icon from '@iconify/svelte';
    import { onMount, createEventDispatcher } from 'svelte';
    import { browser } from '$app/environment';
    import { loading, processedData, selectedPoints, setupInformation, tasks } from '$lib/stores';
    import { Matrix } from 'ml-matrix';

    import Sample from './steps/sample.svelte';
    import SampleInfo from './info/sample.svelte';
    
    import Method from './steps/method.svelte';
    import FrequencyCalc from './info/frequency_calc.svelte';
    import AmplitudeCalc from './info/amplitude_calc.svelte';

    import FundamentalFrequency from './steps/fundamental_frequency.svelte';

    import Play from './steps/play.svelte';

    import Visualise from './steps/visualise.svelte';
	import { completeTask } from '$lib/utils';

    // Loading state and index of the window
    export let windowIndex: number;

    // Event dispatcher used to close the current window
    const dispatch = createEventDispatcher();

    // Function to destroy the window and close the audio context
    const closeWindow = () => {
        if(audioContext){
            audioContext.close();
        }

        selectedPoints.update((points) => {
            delete points[windowIndex];
            return points;
        });
        
        // Send a close event to the parent window
        dispatch('close', {index: windowIndex});
    }

    const toastStore = getToastStore();

    // Simple generate toast function for popups
    const generateToast = (message: string, timeout: number = 5000, background: string = 'variant-filled-primary') => {
		const t: ToastSettings = {
			message: message,
			timeout: timeout,
            background: background,
		};
		toastStore.trigger(t);
	}

    // Variables setting the state of the playback window
    let sliderValue: number = 1;
    let amplitudeOption: boolean = true;
    let playing: boolean = false;
    let clipping: boolean = false;
    let playbackTasks: Record<string,boolean> = {
        "Sample": false,
        "Selection": false,
        "Play": false,
        "Visualise": false
    };

    // Variables used to refresh playback windows if new data is processed
    let localLoading: boolean = false;
    let runningInterval: NodeJS.Timeout | null = null;

    // Variables used to control the sonification
    let fundamentalFrequency: number = 0;
    let cluster: number | null = null;

    // Variables storing data about the current selection
    let currentIndex: number | null = null;
    
    // WebAudio API context
    let audioContext: AudioContext | null = null;

    // Arrays storing the oscillators and gain nodes used for the signal
    let oscillators: OscillatorNode[] = [];
    let gainNodes: GainNode[] = [];

    // Arrays storing information about the modulated signal
    let outputGains: number[] = [];
    let outputFrequencies: number[] = [];

    // Whenever loading changes to a true state, set the localLoading variable to true until all selected points are updated
	loading.subscribe((value) => {
		if (value) {
			localLoading = true;
			if (runningInterval) clearInterval(runningInterval);
			runningInterval = setInterval(() => {
				if(Object.values($selectedPoints).every((arr) => arr.length > 0)){
					localLoading = false;
				}
			}, 300);
		}
	});

    const resetNodes = () => {
        if (audioContext) {
            oscillators = new Array($processedData.visibleComponents);
            outputFrequencies = new Array($processedData.visibleComponents).fill(0);
            gainNodes = new Array($processedData.visibleComponents);
            outputGains = new Array($processedData.visibleComponents).fill(0);
            // Create the oscillators and gain nodes for the number of visible components
            for (let i=0; i < $processedData.visibleComponents; i++) {
                oscillators[i] = audioContext.createOscillator();
                oscillators[i].type = "sine";

                const gainNode = audioContext.createGain();
                gainNode.gain.value = 0; // Set the gain value (adjust as needed)
                oscillators[i].connect(gainNode).connect(audioContext.destination);
                gainNodes[i] = gainNode;
            }
        }
    }

    // If the loading state changes, reset the current point and related settings
    $: if (localLoading) {
        if (playing) {
            updateStatus();
        }
        currentIndex = null;
        outputGains = [];
        fundamentalFrequency = 0;
        outputFrequencies = [];
        cluster = null;
        clipping = false;
        resetNodes();

        // Reset all playbackTasks
        Object.keys(playbackTasks).forEach((key) => {
            playbackTasks[key] = false;
        });

        playbackTasks = playbackTasks;

        selectedPoints.update((points) => {
            delete points[windowIndex];
            return points;
        });
    }

    // Function to sample a point from either the regular or irregular data
    // The current point is cut to the length of the visible components and the index is set (used for sampling based on index)
    const sample = (regularSample: boolean = true)=>{
        const regularSamples = $processedData.expectedData.length;
        const irregularSamples = $processedData.anomalousData.length;
        if(regularSample && regularSamples > 0){
            // Fetch a randomly selected point from the gaussian data
            currentIndex = Math.floor(Math.random() * regularSamples);
            sampleByIndex();
        } else if(!regularSample && irregularSamples > 0){
            // Fetch a randomly selected point from the anomaly data
            currentIndex = Math.floor(Math.random() * irregularSamples) + regularSamples;
            sampleByIndex();
        } else {
            generateToast('No data to sample from');
        }
    }

    // Function to sample a point based on the index provided (input validation is required to ensure the index is within the range of the data)
    // The index refers to the index of the sample in expectedData.concat(anomalousData)
    const sampleByIndex = () => {
        if(currentIndex === null){
            generateToast('No index provided');
            return;
        }

        const regularSamples = $processedData.expectedData.length;
        const irregularSamples = $processedData.anomalousData.length;

        if(currentIndex < 0 || currentIndex >= regularSamples + irregularSamples){
            generateToast(`Invalid index. Must be in the range 0 - ${regularSamples + irregularSamples}`);
            return;
        }

        if(currentIndex < regularSamples){
            if (!$tasks["sample"][1]) completeTask("sample");
            $selectedPoints[windowIndex] = $processedData.expectedData[currentIndex];

            if($processedData.clusters.length > 0){
                cluster = $processedData.clusters[currentIndex];
            } else {
                cluster = null;
            }

        } else {
            $selectedPoints[windowIndex] = $processedData.anomalousData[currentIndex - regularSamples];
            
            if($processedData.clusters.length > 0){
                cluster = $processedData.clusters[currentIndex];
            } else {
                cluster = null;
            }
        }

        const numComponents = $processedData.visibleComponents;

        // Cut the currentPoint to the length of the number of visible components
        $selectedPoints[windowIndex] = $selectedPoints[windowIndex].slice(0,numComponents);

        // If the audio context is active, regenerate the signal
        if (playing) {
            generateSignal();
        }

        playbackTasks["Sample"] = true;
        generateToast(`Sampled point at index ${currentIndex}`,1000);
    }

    // Function which takes a standard harmonic sequence of frequencies and modulates the amplitudes based on the currentPoint
    const amplitudeModulation = () => {
        if (!audioContext)
            return
        
        if(!$tasks["sonify"][1]) completeTask("sonify");

        // Generate a list of primes (for which harmonics will be mapped to if primeOnly is true)
        const primes: number[] = [1,2,3,5,7,11,13,17,19,23,29,31,37,41];

        // Prime number generator for new components
        if($setupInformation.primeOnly){

            // Generate enough primes such that either it matches the length of the sample or the final prime is greater than 20000
            let nextPrime = 42;
            while (primes.length < $selectedPoints[windowIndex].length && primes[primes.length-1] < 20000) {
                nextPrime += 1;
                let isPrime = true;
                for (let i=1; i<primes.length; i++) {
                    if (nextPrime % primes[i] === 0) {
                        isPrime = false;
                        break;
                    }
                }
                if (isPrime) {
                    primes.push(nextPrime);
                }
            }
        }

        const matrix = new Matrix($processedData.expectedData.concat($processedData.anomalousData));
        const sd = 4 * matrix.standardDeviation('column')[0];

        // Retrieve the current point and remove any negative values
        const scaledValues = $selectedPoints[windowIndex].map(value => Math.abs(value) / sd);

        clipping = false;
        // If the sum of the scaled values is above 1, normalise the values
        const sumOfValues = scaledValues.reduce((a, b) => a + b, 0);
        if(sumOfValues > 1){
            scaledValues.forEach((value, index) => {
                scaledValues[index] = value / sumOfValues;
            });
            clipping = true;
        }

        // For each element in the sample generate an oscilator, set the frequency and amplitude
        for (let i=0; i < scaledValues.length; i++) {
            let frequency = fundamentalFrequency * (i+1);

            if ($setupInformation.primeOnly) {
                frequency = fundamentalFrequency * primes[i];
            }
            
            // If the frequency is greater than 20000 or less than 20, break the loop as these frequencies are not audible
            if(frequency > 20000 || frequency < 20){
                generateToast(`Frequency ${frequency} is not audible. The signal has been clipped.`, 1000, 'variant-filled-warning');
                clipping = true;
                break;
            }

            outputFrequencies[i] = frequency;
            outputGains[i] = scaledValues[i];
        }
    }

    // Function which takes a standard harmonic sequence of frequencies and modulates the frequencies based on the currentPoint
    const frequencyModulation = () => {
        if (!audioContext)
            return

        if (!amplitudeOption && ! $tasks["frequency"][1]) completeTask("frequency");
        
        // Place into a matrix for easier computation
        const matrix = new Matrix($processedData.expectedData.concat($processedData.anomalousData));

        const means = matrix.mean('column');
        const sds = matrix.standardDeviation('column');
        
        const newPoints = $selectedPoints[windowIndex].map((value, index) => (value - means[index]) / (sds[index]));

        // Calculate the expected gain as an the sum of (1/2)^n where n is the index of the harmonic
        outputGains = outputGains.map((_, index) => (1 / 2)**(index+1));

        // Reset the clipping variable
        clipping = false;

        // For each element in the sample generate an oscilator
        for (let i=0; i < newPoints.length; i++) {

            const frequency = fundamentalFrequency * (i+1);

            let modulatedFrequency = frequency + (frequency * newPoints[i]);

            // Cap the frequency to be between 20 and 20000
            if(modulatedFrequency < 20 || modulatedFrequency > 20000){
                generateToast(`Frequency ${modulatedFrequency} is not audible. The signal has been clipped.`, 1000, 'variant-filled-warning');
                modulatedFrequency = Math.max(20, Math.min(20000, modulatedFrequency));
                clipping = true;
            }

            outputFrequencies[i] = modulatedFrequency;
        }
    
    }

    // Generate the signal
    const generateSignal = () => {

        if (!$tasks["irregular"][1] && currentIndex && currentIndex >= $processedData.expectedData.length) {
            completeTask("irregular");
        }

        if(amplitudeOption){
            amplitudeModulation();
        }else{
            frequencyModulation();
        }

        outputGains = outputGains;
        outputFrequencies = outputFrequencies;
    }

    // If the slider value changes and the output gains and frequencies are set, interpolate between the expected and output values
    // Used to compare with a standard harmonic sequence
    $: if (sliderValue >= 0 && outputGains && outputFrequencies && gainNodes[0] !== undefined) {
        if (amplitudeOption){
            for (let i=0; i < gainNodes.length; i++) {
                // Interpolate between expected and outputGains by the scaler value
                const expectedGain = (1 / 2)**(i+1);

                gainNodes[i].gain.value = (1 - sliderValue) * expectedGain + (sliderValue * outputGains[i]);
            }  
            outputFrequencies.forEach((frequency, index) => {
                oscillators[index].frequency.value = frequency;
            });
            if (!$tasks["compare"][1] && sliderValue == 0 && playing){
                completeTask("compare");
            }
        } else {
            for (let i=0; i < oscillators.length; i++) {
                // Interpolate between expected and outputFrequency by the scaler value
                const expectedFreq = fundamentalFrequency * (i+1);

                oscillators[i].frequency.value = (1 - sliderValue) * expectedFreq + sliderValue * outputFrequencies[i];
            } 
            outputGains.forEach((gain, index) => {
                gainNodes[index].gain.value = gain;
            });
        }
    }

    // Function to stop/start the oscillators making up the current signal
    const updateStatus = () => {
        if (!fundamentalFrequency) return;

        playbackTasks["Play"] = true;

        if (playing){
            playing = false;
            oscillators.forEach(oscillator => {
                oscillator.stop();
            });
            // Reset all nodes as you cannot start an oscillator once it has been stopped
            resetNodes();
        } else if (audioContext && $selectedPoints[windowIndex]) {
            playing = true;
            generateSignal();
            // Start the oscillator
            if (audioContext.state === "suspended") {
                audioContext.resume();
            }
            const currentTime = audioContext.currentTime;

            oscillators.forEach(oscillator => {
                oscillator.start(currentTime);
            });
        }
    }

    // Initialise the audio context on mount
    onMount(()=> {
        if(browser){
            audioContext = new AudioContext();
        }
        resetNodes();
        sample();
    });
</script>

<div class="min-w-[48%] h-fit bg-white/90 backdrop-blur-md rounded-md m-3 p-5 relative">
    <button class="absolute btn-icon variant-ghost-secondary top-3 right-3" on:click={closeWindow}>
        <Icon icon="material-symbols:close" class="w-6 h-6"/>
    </button>

    <div class="overflow-auto">
        <ol class="list">
            <li class="!mb-4 !items-start">
                <span class="btn-icon {playbackTasks["Sample"]? 'variant-ghost-success' : 'variant-outline-primary'} px-1">1</span>
                <span class="flex-auto items-stretch flex flex-wrap">
                    <div class="grow max-w-5xl lg:min-w-[64rem]">
                        <Sample randomSample={(regular)=>sample(regular)} sampleByIndex={sampleByIndex} bind:currentIndex={currentIndex}/>
                    </div>
                    <span class="divider-vertical !min-h-full" />
                    <div class="flex-1 overflow-hidden">
                        <SampleInfo currentIndex={currentIndex} windowIndex={windowIndex} cluster={cluster}/>
                    </div>
                </span>
            </li>
            <li class="!mb-4 !items-start {playing? 'opacity-50':''}">
                <span class="btn-icon {playbackTasks["Selection"]? 'variant-ghost-success' : 'variant-outline-primary'} px-1">2</span>
                <span class="flex-auto items-stretch flex flex-wrap">
                    <div class="grow max-w-5xl lg:min-w-[64rem]">
                        <Method playing={playing} bind:amplitudeOption={amplitudeOption} on:used={()=>{playbackTasks["Selection"] = true}}/>
                    </div>
                    <span class="divider-vertical !min-h-full" />
                    <div class="flex-1 overflow-hidden">
                        <FrequencyCalc windowIndex={windowIndex} amplitudeOption={amplitudeOption} baselineFrequency={fundamentalFrequency}/>
                        <AmplitudeCalc windowIndex={windowIndex} amplitudeOption={amplitudeOption}/>
                    </div>
                </span>
            </li>
            <li class="!my-4 !items-start {playing? 'opacity-50':''}">
                <span class="btn-icon {fundamentalFrequency > 0? 'variant-ghost-success' : 'variant-outline-primary'} px-1">3</span>
                <span class="flex-auto items-stretch flex flex-wrap">
                    <div class="grow max-w-5xl lg:min-w-[64rem]">
                        <FundamentalFrequency playing={playing} bind:fundamentalFrequency={fundamentalFrequency} cluster={cluster} windowIndex={windowIndex}/>
                    </div> 
                    <span class="divider-vertical !min-h-full" />
                    <div class="flex-1">
                        <p class="text-sm w-[full] overflow-auto px-3 lg:max-w-xs"> <b>Reminder</b>: You can view the sampled data's component values and cluster assignment above.</p>
                    </div>
                </span>
            </li>
            <li class="!my-7 !items-start {$selectedPoints[windowIndex] && fundamentalFrequency? '':'opacity-50'}">
                <span class="btn-icon {playbackTasks["Play"]? 'variant-ghost-success' : 'variant-outline-primary'} px-1">4</span>
                <span class="flex-auto items-stretch flex flex-wrap">
                    <div class="grow max-w-5xl lg:min-w-[64rem]">
                        <Play bind:sliderValue={sliderValue} bind:playing={playing} windowIndex={windowIndex} updateStatus={updateStatus} bind:currentIndex={currentIndex} sampleByIndex={sampleByIndex}/>
                    </div> 
                    <span class="divider-vertical !min-h-full" />
                    <div class="flex-1 lg:my-0 my-7">
                        <p class="text-sm w-[full] overflow-auto px-3 lg:max-w-xs"><b>Reminder</b>: You can quickly switch between samples during playback by using the sample buttons above!</p>
                    </div>
                </span>
            </li>
            <li class="!my-4 !items-start">
                <span class="btn-icon {playbackTasks["Visualise"]? 'variant-ghost-success' : 'variant-outline-primary'} px-1">5</span>
                <span class="flex-auto items-stretch flex flex-wrap">
                    <div class="grow max-w-5xl lg:min-w-[64rem]">
                        <Visualise audioContext={audioContext} gainNodes={gainNodes} oscilatorNodes={oscillators} fundamentalFrequency={fundamentalFrequency} clipping={clipping} on:used={()=>{playbackTasks["Visualise"] = true}}/>
                    </div> 
                    <span class="divider-vertical !min-h-full" />
                    <div class="flex-1"></div>
                </span>
            </li>
        </ol>
    </div>
</div>