/**
 * Bucket Sort Step Generator
 * Handles distribution into buckets, internal bucket sorting, and merging.
 */
export function getBucketSortSteps(inputArr) {
    const arr = [...inputArr];
    const n = arr.length;
    const steps = [];

    if (n === 0) return [{ array: [], buckets: [], phase: 'initial', message: "Empty array" }];

    // Finding range for buckets
    const max = Math.max(...arr);
    const min = Math.min(...arr);

    // For educational purposes, if max < 100, we use ranges of 10 (as requested)
    // Otherwise we scale dynamically.
    const useDefaultRanges = max < 100;
    const bucketSize = useDefaultRanges ? 10 : Math.ceil((max - min + 1) / 10);
    const bucketCount = useDefaultRanges ? 10 : Math.ceil((max - min + 1) / bucketSize);

    const bucketRanges = [];
    for (let i = 0; i < bucketCount; i++) {
        const start = useDefaultRanges ? i * 10 : min + i * bucketSize;
        const end = useDefaultRanges ? (i * 10) + 9 : min + (i + 1) * bucketSize - 1;
        bucketRanges.push(`${start}–${end}`);
    }

    let buckets = Array.from({ length: bucketCount }, () => []);
    let sortedIndices = [];

    // Initial Step
    steps.push({
        array: [...arr],
        buckets: buckets.map(b => [...b]),
        bucketRanges,
        phase: 'initial',
        message: `Starting Bucket Sort. Creating ${bucketCount} buckets with range ${bucketSize}.`,
        activeElement: null,
        targetBucket: null,
        sortedIndices: []
    });

    // Step 2: Distribution
    for (let i = 0; i < n; i++) {
        const val = arr[i];
        let bucketIdx = useDefaultRanges
            ? Math.floor(val / 10)
            : Math.floor((val - min) / bucketSize);

        // Clamp bucket index
        bucketIdx = Math.max(0, Math.min(bucketIdx, bucketCount - 1));

        steps.push({
            array: [...arr],
            buckets: buckets.map(b => [...b]),
            bucketRanges,
            phase: 'distribution',
            message: `Distributing ${val} into bucket ${bucketIdx} (${bucketRanges[bucketIdx]})`,
            activeElement: i,
            targetBucket: bucketIdx,
            sortedIndices: []
        });

        buckets[bucketIdx].push(val);

        steps.push({
            array: [...arr],
            buckets: buckets.map(b => [...b]),
            bucketRanges,
            phase: 'distribution',
            message: `Element ${val} placed in bucket ${bucketIdx}.`,
            activeElement: i,
            targetBucket: bucketIdx,
            sortedIndices: []
        });
    }

    // Step 3: Sort each bucket
    for (let i = 0; i < bucketCount; i++) {
        if (buckets[i].length > 1) {
            steps.push({
                array: [...arr],
                buckets: buckets.map(b => [...b]),
                bucketRanges,
                phase: 'sorting',
                message: `Sorting bucket ${i} internally...`,
                activeElement: null,
                targetBucket: i,
                sortedIndices: []
            });

            buckets[i].sort((a, b) => a - b);

            steps.push({
                array: [...arr],
                buckets: buckets.map(b => [...b]),
                bucketRanges,
                phase: 'sorting',
                message: `Bucket ${i} sorted: [${buckets[i].join(', ')}]`,
                activeElement: null,
                targetBucket: i,
                sortedIndices: []
            });
        } else if (buckets[i].length === 1) {
            steps.push({
                array: [...arr],
                buckets: buckets.map(b => [...b]),
                bucketRanges,
                phase: 'sorting',
                message: `Bucket ${i} has only one element, no sorting needed.`,
                activeElement: null,
                targetBucket: i,
                sortedIndices: []
            });
        }
    }

    // Step 4: Merge Buckets Back
    let currentIndex = 0;

    for (let i = 0; i < bucketCount; i++) {
        if (buckets[i].length > 0) {
            steps.push({
                array: [...arr],
                buckets: buckets.map(b => [...b]),
                bucketRanges,
                phase: 'merging',
                message: `Merging elements from bucket ${i} back to main array.`,
                activeElement: null,
                targetBucket: i,
                sortedIndices: [...sortedIndices]
            });

            for (const val of buckets[i]) {
                arr[currentIndex] = val;
                sortedIndices.push(currentIndex);

                steps.push({
                    array: [...arr],
                    buckets: buckets.map(b => [...b]),
                    bucketRanges,
                    phase: 'merging',
                    message: `Placed ${val} at index ${currentIndex}.`,
                    activeElement: null,
                    targetBucket: i,
                    sortedIndices: [...sortedIndices]
                });

                currentIndex++;
            }
        }
    }

    // Final Step
    steps.push({
        array: [...arr],
        buckets: buckets.map(b => [...b]),
        bucketRanges,
        phase: 'done',
        message: "Bucket Sort completed! Array is now fully sorted.",
        activeElement: null,
        targetBucket: null,
        sortedIndices: Array.from({ length: n }, (_, i) => i)
    });

    return steps;
}
