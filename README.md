[View the live site by clicking here!](https://harmonify-mhz9cxfdz-tony-dalziels-projects.vercel.app/)

# Data
To get started, choose one of the following options.

## Generating gaussian samples
If you just want to explore how sonification can be used and you have no data to try out, simply click the "Generate Data" button in the top right corner to sample 950 data points from a random gaussian and 50 random samples. PCA will automatically be perfomed on this data to allow for sonification.

## Uploading raw data
If you have some numerical data to try out and would like us to perform the PCA for you, click the "Upload Data" dropdown then the RAW data option to upload raw data in the following JSON format:

    {
        expectedData: [
            [v_11, v_21,...,v_x1],
            [v_12, v_22,...,v_x2],
            ....
        ],
        anomalousData: [
            [v_11, v_21,...,v_x1],
            [v_12, v_22,...,v_x2],
            ....
        ],
    }

Both arrays should have an equal number of variables per row and be split into "gaussianData" and "anomalyData" where gaussian data includes all samples to be expected (that should produce "natural sounds") and anomalous data includes all samples that should be notably differeny.

## Uploading processed data
If you have some processed data ready for sonification, click the "Upload Data" dropdown then the processed data option to upload processed data in the following format:

    {
        expectedData: [
            [l_11, l_21,...,l_x1],
            [l_12, l_22,...,l_x2],
            ....
        ],
        anomalousData: [
            [l_11, l_21,...,l_x1],
            [l_12, l_22,...,l_x2],
            ....
        ],
        clusters?: [0,1,0, ...]
    }

Where the data contained is processed such that each row contains a latent representation of the original numeric data.
The clusters array is optional, however if provided should contain an ID for which cluster each row belongs to.
