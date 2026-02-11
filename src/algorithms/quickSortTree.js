
// QuickSort Tree Visualization: Perfect Three-Phase Sequence
// Phase 1: Partition Tree (Top -> Down) - Tree grows, pivots are placed.
// Phase 2: Assembly Pass (Top -> Down Traversal) - In-order traversal visits nodes, elements fly to final array.
// Phase 3: Final Reveal (Right -> Left) - Tree disappears, final array turns green, container shrinks.

export function generateQuickSortTreeSteps(initialArray) {
    const steps = [];
    const nodes = {};
    let nodeIdCounter = 0;
    let elementIdCounter = 0;

    // 1. Initialize data with unique element IDs
    const indexedArray = initialArray.map(val => ({
        value: val,
        id: `el-${elementIdCounter++}`
    }));

    let sortedBottomArray = new Array(initialArray.length).fill(null);
    let revealedIndices = new Set();

    function createSnapshot(description, activeNodeId = null, isDone = false) {
        const nodesCopy = JSON.parse(JSON.stringify(nodes));
        const sortedBottomCopy = JSON.parse(JSON.stringify(sortedBottomArray));
        return {
            nodes: nodesCopy,
            rootId: "node-0",
            description,
            activeId: activeNodeId,
            sortedBottomArray: sortedBottomCopy,
            revealedIndices: Array.from(revealedIndices),
            isDone
        };
    }

    // Pre-calculate final order
    const finalSortedArray = [...indexedArray].sort((a, b) => a.value - b.value);
    const elementToFinalIndex = {};
    finalSortedArray.forEach((item, idx) => {
        elementToFinalIndex[item.id] = idx;
    });

    // --- PHASE 1: Recursive Construction & Partitioning ---

    function quickSortRecursion(arr, level = 0, parentId = null) {
        if (arr.length === 0) return null;

        const id = `node-${nodeIdCounter++}`;
        const nodeData = {
            id,
            parentId,
            array: [...arr],
            level,
            status: 'visible',
            children: [],
            arrayStates: new Array(arr.length).fill('default'),
            isLeaf: arr.length <= 1,
            // Metadata for Phase 2
            pivotItem: null,
            pivotIndex: -1,
            leftChildId: null,
            rightChildId: null,
        };
        nodes[id] = nodeData;

        if (parentId) {
            nodes[parentId].children.push(id);
        }

        if (arr.length <= 1) {
            if (arr.length === 1) {
                nodeData.pivotItem = arr[0];
                nodeData.pivotIndex = 0;
                nodeData.arrayStates[0] = 'locked';
                steps.push(createSnapshot(`Base case: ${arr[0].value}`, id));
            } else {
                steps.push(createSnapshot(`Empty subarray`, id));
            }
            return id;
        }

        nodeData.status = 'active-partition';
        const pivotIdx = arr.length - 1;
        const pivotValue = arr[pivotIdx].value;
        const pivotItem = arr[pivotIdx];
        nodeData.arrayStates[pivotIdx] = 'pivot';
        steps.push(createSnapshot(`Choosing pivot: ${pivotValue}`, id));

        let i = -1;
        for (let j = 0; j < pivotIdx; j++) {
            nodeData.arrayStates[j] = 'comparing';
            steps.push(createSnapshot(`Comparing ${arr[j].value} with pivot ${pivotValue}`, id));

            if (arr[j].value < pivotValue) {
                i++;
                nodeData.arrayStates[i] = 'swapping';
                nodeData.arrayStates[j] = 'swapping';
                steps.push(createSnapshot(`Swapping elements`, id));

                [arr[i], arr[j]] = [arr[j], arr[i]];
                nodeData.array = [...arr];

                nodeData.arrayStates[i] = 'default';
                nodeData.arrayStates[j] = 'default';
            } else {
                nodeData.arrayStates[j] = 'default';
            }
        }

        const finalPivotIdx = i + 1;
        nodeData.arrayStates[finalPivotIdx] = 'swapping';
        nodeData.arrayStates[pivotIdx] = 'swapping';
        steps.push(createSnapshot(`Placing pivot ${pivotValue}`, id));

        [arr[finalPivotIdx], arr[pivotIdx]] = [arr[pivotIdx], arr[finalPivotIdx]];
        nodeData.array = [...arr];

        // Lock the pivot
        nodeData.arrayStates[finalPivotIdx] = 'locked';
        nodeData.arrayStates[pivotIdx] = 'default';
        nodeData.pivotItem = pivotItem;
        nodeData.pivotIndex = finalPivotIdx;

        steps.push(createSnapshot(`Pivot ${pivotValue} locked in its position`, id));

        nodeData.status = 'visible';

        const leftArr = arr.slice(0, finalPivotIdx);
        const rightArr = arr.slice(finalPivotIdx + 1);

        nodeData.leftChildId = quickSortRecursion(leftArr, level + 1, id);
        nodeData.rightChildId = quickSortRecursion(rightArr, level + 1, id);

        return id;
    }

    quickSortRecursion([...indexedArray]);

    // --- PHASE 2: Result Assembly (In-order Down-Traversal) ---
    steps.push(createSnapshot("Phase 2: Assembling the final sorted result..."));

    function traverseAndAssemble(nodeId) {
        if (!nodeId) return;
        const node = nodes[nodeId];

        // Traverse Left
        traverseAndAssemble(node.leftChildId);

        // Assemble Pivot/Item
        if (node.pivotItem) {
            const item = node.pivotItem;
            const idxInNode = node.pivotIndex;
            const finalIdx = elementToFinalIndex[item.id];

            // Highlight the node being visited
            const oldStatus = node.status;
            node.status = 'active-partition'; // Use partition status for highlighting
            steps.push(createSnapshot(`Collecting element ${item.value} from current node`, nodeId));

            // Append to bottom array
            sortedBottomArray[finalIdx] = item;
            // Erase from node
            node.array[idxInNode] = null;
            steps.push(createSnapshot(`Appending ${item.value} to output`, nodeId));

            node.status = oldStatus;
        }

        // Traverse Right
        traverseAndAssemble(node.rightChildId);
    }

    traverseAndAssemble("node-0");

    // --- PHASE 3: Final Reveal (Right-to-Left Green) ---
    // Hide the tree
    Object.keys(nodes).forEach(id => {
        nodes[id].status = 'hidden';
    });
    steps.push(createSnapshot("Assembling complete. All elements collected.", null));

    for (let idx = initialArray.length - 1; idx >= 0; idx--) {
        revealedIndices.add(idx);
        steps.push(createSnapshot("", null)); // Silent steps for the green reveal
    }

    const finalSnapshot = createSnapshot("QuickSort Complete", null, true);
    steps.push(finalSnapshot);

    return steps;
}

export function getQuickSortTreeSteps(arr) {
    return generateQuickSortTreeSteps(arr);
}
