
export function getHeapSortDetailedSteps(initialArray) {
    const steps = [];
    const array = [...initialArray];
    const n = array.length;

    // Helper to push state
    // visibleCount: How many nodes should be visible in the tree (for construction phase)
    const pushStep = (type, activeIndices, swappedIndices, heapSize, msg, phase, visibleCount = n) => {
        steps.push({
            array: [...array],
            activeIndices: activeIndices || [],
            swappedIndices: swappedIndices || [],
            heapSize: heapSize,
            sortedIndices: [],
            type: type,
            message: msg,
            phase: phase,
            visibleCount: visibleCount // Control tree node visibility
        });
    };

    // To track sorted elements for visualization
    const getSortedIndices = (currentHeapSize) => {
        const sorted = [];
        for (let i = currentHeapSize; i < n; i++) {
            sorted.push(i);
        }
        return sorted;
    };

    // --- PHASE 0: Construction (Array Traversal -> Tree Form) ---
    // Animate the "mapping" of array indices to tree nodes
    for (let i = 0; i < n; i++) {
        pushStep(
            'construct',
            [i], // Highlight current index
            [],
            n,
            `Mapping Index ${i} to Tree Node`,
            'construction',
            i + 1 // Incrementally reveal nodes
        );
    }

    pushStep('idle', [], [], n, `Tree Structure Formed. Starting Heap Construction.`, 'building', n);

    const heapify = (size, i, phaseLabel) => {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        pushStep(
            'compare',
            [i, left < size ? left : -1, right < size ? right : -1].filter(x => x !== -1),
            [],
            size,
            `Heapify: Checking parent ${array[i]} against children`,
            phaseLabel,
            n
        );

        if (left < size && array[left] > array[largest]) {
            largest = left;
        }

        if (right < size && array[right] > array[largest]) {
            largest = right;
        }

        if (largest !== i) {
            pushStep(
                'swap',
                [i, largest],
                [i, largest],
                size,
                `Swapping ${array[i]} with ${array[largest]}`,
                phaseLabel,
                n
            );

            [array[i], array[largest]] = [array[largest], array[i]];

            pushStep(
                'idle',
                [],
                [],
                size,
                `Swapped. Continuing down...`,
                phaseLabel,
                n
            );

            heapify(size, largest, phaseLabel);
        }
    };

    // --- PHASE 1: Build Max Heap ---
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        pushStep('idle', [i], [], n, `Building heap from index ${i}`, 'building', n);
        heapify(n, i, 'building');
    }

    pushStep('idle', [], [], n, `Max Heap constructed. Starting Sort.`, 'sorting', n);

    // --- PHASE 2: Extract & Sort ---
    for (let i = n - 1; i > 0; i--) {
        pushStep(
            'swap',
            [0, i],
            [0, i],
            i + 1,
            `Moving max element ${array[0]} to sorted position`,
            'extracting',
            n
        );

        [array[0], array[i]] = [array[i], array[0]];

        pushStep(
            'idle',
            [],
            [],
            i,
            `${array[i]} is sorted.`,
            'sorting',
            n
        );

        heapify(i, 0, 'sorting');
    }

    // Final state
    steps.push({
        array: [...array],
        activeIndices: [],
        swappedIndices: [],
        heapSize: 0,
        sortedIndices: Array.from({ length: n }, (_, i) => i),
        type: 'idle',
        message: 'Heap Sort Complete',
        phase: 'complete',
        visibleCount: n
    });

    // Post-process sorted indices
    steps.forEach(step => {
        if (step.phase !== 'complete') {
            step.sortedIndices = getSortedIndices(step.heapSize);
        }
    });

    return steps;
}
