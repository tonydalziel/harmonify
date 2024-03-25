<!--Waveform visualisation which takes in a number of WebAudio API nodes and analyses them to determine the current waveform-->

<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    // Either takes in a single gainNode or a set of gainNodes all of which are connected to a single analyser
    export let gainNodes: GainNode[] | GainNode;
    export let audioContext: AudioContext;

    // Initialise the analyser, canvas, and waveform data
    let analyser: AnalyserNode | undefined = undefined;
    let waveformCanvas: HTMLCanvasElement | undefined = undefined;
    let waveformData: Uint8Array = new Uint8Array(0);
    let bufferLength: number = 0;

    // If the gainNodes or analyser change -> Connect the gain node(s) to the analyser
    $: if (gainNodes && analyser) {

        // Check the type of gainNode
        if (gainNodes instanceof GainNode) {
            gainNodes.connect(analyser);
        }else {
            // Connect each gain node to the analyser
            for (let i = 0; i < gainNodes.length; i++) {
                gainNodes[i].connect(analyser);
            }
        }
    }

    // Draw the waveform to the canvas using the WebAudio API analyser Node
    const draw = () => {
        if (!analyser || !waveformCanvas)
            return
        const drawVisual = requestAnimationFrame(draw);
        const canvasContext = waveformCanvas.getContext('2d');
        if(!canvasContext)
            return

        analyser.getByteTimeDomainData(waveformData);
        canvasContext.fillStyle = "rgb(200, 200, 200)";
        canvasContext.fillRect(0, 0, waveformCanvas.width, waveformCanvas.height);
        canvasContext.lineWidth = 2;
        canvasContext.strokeStyle = "rgb(0, 0, 0)";
        canvasContext.beginPath();
        const sliceWidth = waveformCanvas.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
        const v = waveformData[i] / 128.0;
        const y = v * (waveformCanvas.height / 2);

        if (i === 0) {
            canvasContext.moveTo(x, y);
        } else {
            canvasContext.lineTo(x, y);
        }

        x += sliceWidth;
        }
        canvasContext.lineTo(waveformCanvas.width, waveformCanvas.height / 2);
        canvasContext.stroke();
    }

    // If the waveformCanvas and analyser are initialised, clear the canvas and invoke the draw function to begin the visualisation
    $: if (waveformCanvas && analyser) {
        // Clear the canvas
        const canvasContext = waveformCanvas.getContext('2d');
        if (canvasContext){
            bufferLength = analyser.frequencyBinCount;
            waveformData = new Uint8Array(bufferLength);
            canvasContext.clearRect(0,0,waveformCanvas.width,waveformCanvas.height);
            draw();
        }
    }

    // On mount, create the analyser node
    onMount(()=> {
        if(browser){
            analyser = audioContext.createAnalyser();
        }
    });

</script>

<canvas bind:this={waveformCanvas} id="waveform" class="w-full h-20"></canvas>