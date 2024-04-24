<div class="my-3 flex justify-center items-center flex-col w-[80%] mx-auto description text-center">
    <p> Welcome to <b>harmonify</b>, a web app that allows researchers and sonification enthusiasts to explore high-dimensional data using sound</p>
    <p>Our approach can be broken into two main components: <b>dimensionality reduction</b> and <b>sonification</b></p>
    <p>Starting with high-dimensional data, we apply <b>principal component analysis (PCA)</b>. This technique maps the data to a lower dimension, represented using latent variables, also known as components. A key feature of PCA is that each subsequent component explains a diminishing amount of the total variance. This characteristic implies that data points from a "typical" dataset (what we call 'regular') are likely to have diminishing values along these components and will have fewer fluctuations in later components as the variance decreases. We can exploit this relationship for sonification!</p>
    <p>We can map each latent variable to an audible parameter of decreasing importance. For this, we use harmonics. Often when you hear a guitar string, you don't just hear a single sine wave but instead many "harmonics" each with a frequency an integer multiple of the first harmonic with decreasing amplitude</p>
    <p>Taking advantage of the relationship introduced between latent variables, we can assign the scaled absolute value of each latent variable to the amplitude of the respective harmonic for a given data point. For 'regular' data, the signals will often have lower amplitudes than naturally occurring harmonics, resuling in a natural sound. On the other hand, 'irregular' data tends to have high amplitudes in the higher components leading to an unnatural sound. We call this <b>amplitude modulation</b></p>
    <p>Alternatively, we can use the latent variables to modulate the frequencies of respective harmonics. With regular samples there will be little to no change from the natural frequencies whereas irregular samples will have more fluctuations in later components leading to sounds that are notably unnatural. We call this <b>frequency modulation</b></p>
    <p>In addition to these approaches, we offer a range of options to help you explore the use of sound with data.</p>
    <button class="btn variant-filled-surface my-3" disabled>Paper</button>
    <a href="https://github.com/tonydalziel/harmonify"><button class="btn variant-filled-surface my-3">Git Hub</button></a>
    <a href="/"><button class="btn variant-filled-surface my-3">return to home</button></a>
</div>

<style lang="postcss">
    .description p{
        margin: 1rem 0;
    }
    .description b{
        color: hsl(284, 95%, 66%);
    }
</style>

