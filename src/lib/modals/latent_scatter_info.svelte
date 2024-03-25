<script lang="ts">
    import { getModalStore } from '@skeletonlabs/skeleton';
    const modalStore = getModalStore();
</script>

<div class="bg-primary-200 rounded-md p-3 max-w-2xl text-center text-sm max-h-[90vh] overflow-scroll">
    <h3 class="my-3 h3">Component Visualisations: What to expect</h3>
    <p class="my-2">The following information only applies to generated data or uploaded RAW data. Uploaded processed data may have different propertiers.</p>
    <p class="my-2">The scatter plot shows the first two components of the processed data (in a reduced dimension). This can be a good indicator as to whether or not dimensionality reduction worked. This step is crucial for a working sonification!</p>

    <ul class="text-left m-2">
        <li><b>Spread of Data Points:</b> The distribution of points across the plot can reveal clusters of similar data points, outliers, or general trends within your dataset. Clusters indicate groups of samples with similar properties, while outliers might represent anomalies or unique instances in your data. With our test data, we expect two main clusters: “Regular data” and “Irregular data” as anomalies aren't captured well by the PCA.
            <ul>
                <li>
                    If you have provided clustered data you may see many more clusters. In this case, you may want to perform clustering to get the expected results. 
                </li>
                <li>
                    If you see no clear clusters, your data was not well captured by the PCA and you may not get consistent results with sonification.
                </li>
            </ul>
        </li>
        <li>
            <b>Variance:</b> The first component (x-axis) captures the most variance within your dataset, followed by the second principal component (y-axis). The spread along the x-axis will generally be wider than along the y-axis, reflecting the descending order of variance captured by each component.
        </li>
        <li>
            <b>Interpretation of Axes:</b> Unlike your original variables, the axes of this plot do not correspond to specific features but are combinations of them. Each axis represents a 'principal component' that captures certain variances and patterns in the data. The direction and length of these components can give insights into which original variables are most influential in explaining the variance in your data.
        </li>
    </ul>

    <img src="/visualisation.png" alt="scatter plot graphic" class="w-full mx-auto" />

    <button class="btn variant-filled-surface my-3" on:click={()=>modalStore.close()}>Close</button>
</div>