
// Merge Sort Tree Visualization with Full State Tracking
// Generates steps that describe the state of the entire tree at each moment.

export function generateMergeSortTreeSteps(initialArray) {
  const steps = [];
  const originalArray = [...initialArray];

  // 1. Build the static tree structure with unique IDs
  let nodeIdCounter = 0;

  function buildTree(arr, level = 0, xPos = 50, width = 100) {
    const id = `node-${nodeIdCounter++}`;
    const node = {
      id,
      array: [...arr],
      level,
      x: xPos, // Percentage or relative unit for visualization
      width: width,
      isLeaf: arr.length <= 1,
      // State properties for visualization
      status: 'hidden', // hidden, visible, active-split, active-merge, sorted
      children: []
    };

    if (arr.length > 1) {
      const mid = Math.floor(arr.length / 2);
      const leftArr = arr.slice(0, mid);
      const rightArr = arr.slice(mid);

      // Calculate child positions (simplified logic)
      const childWidth = width / 2;
      node.children = [
        buildTree(leftArr, level + 1, xPos - childWidth / 2, childWidth),
        buildTree(rightArr, level + 1, xPos + childWidth / 2, childWidth)
      ];
    }

    return node;
  }

  // Initial build - x is center (50%), width spans sufficient space
  // We'll calculate positions more precisely later or let the renderer handle strict layout
  // For now, let's just use levels and relative order for layout
  const root = buildTree(originalArray, 0, 50, 50);

  // Flatten tree for easier state updates
  const allNodes = {};
  function flatten(node) {
    allNodes[node.id] = { ...node, children: node.children.map(c => c.id) }; // Store IDs for children
    node.children.forEach(flatten);
  }
  flatten(root);

  // Helper to create a snapshot of the current state
  function createSnapshot(type, description, activeNodeIds = []) {
    // Deep copy the node states
    const nodeStates = Object.keys(allNodes).reduce((acc, id) => {
      acc[id] = { ...allNodes[id] };
      return acc;
    }, {});

    return {
      type,
      description,
      nodes: nodeStates,
      rootId: root.id,
      activeIds: activeNodeIds
    };
  }

  // --- ALGORITHM EXECUTION WITH STEP GENERATION ---

  // Step 0: Initial
  allNodes[root.id].status = 'visible';
  steps.push(createSnapshot('initial', 'Initial Array', [root.id]));

  function recursiveSplit(nodeId) {
    const node = allNodes[nodeId];

    if (node.children.length === 0) return; // Leaf

    // Highlight current node as splitting
    node.status = 'active-split';
    steps.push(createSnapshot('split', `Splitting [${node.array.join(', ')}]`, [nodeId]));

    // Reveal children
    const [leftId, rightId] = node.children;
    allNodes[leftId].status = 'visible';
    allNodes[rightId].status = 'visible';

    // Show the split effect
    steps.push(createSnapshot('split-reveal', `Created sub-arrays`, [leftId, rightId]));

    node.status = 'visible'; // Reset parent

    // Recurse
    recursiveSplit(leftId);
    recursiveSplit(rightId);
  }

  function recursiveMerge(nodeId) {
    const node = allNodes[nodeId];

    if (node.children.length === 0) {
      // Leaf node is trivially sorted
      node.status = 'sorted';
      steps.push(createSnapshot('leaf', `Single element ${node.array[0]} is sorted`, [nodeId]));
      return node.array;
    }

    const [leftId, rightId] = node.children;

    // Recurse first
    const sortedLeft = recursiveMerge(leftId);
    const sortedRight = recursiveMerge(rightId);

    // Prepare for merge
    allNodes[leftId].status = 'active-merge';
    allNodes[rightId].status = 'active-merge';
    steps.push(createSnapshot('merge-prepare', `Merging [${sortedLeft.join(', ')}] and [${sortedRight.join(', ')}]`, [leftId, rightId]));

    // Perform merge logic (just for calculation, the visualization just needs the result)
    // Actually, we want to update the array in the node to be the sorted version now
    // But wait, the node structure was static. We need to update the `array` property of the node to show it sorted.

    // Merge logic
    const merged = [];
    let i = 0, j = 0;
    while (i < sortedLeft.length && j < sortedRight.length) {
      if (sortedLeft[i] <= sortedRight[j]) {
        merged.push(sortedLeft[i]); i++;
      } else {
        merged.push(sortedRight[j]); j++;
      }
    }
    while (i < sortedLeft.length) merged.push(sortedLeft[i++]);
    while (j < sortedRight.length) merged.push(sortedRight[j++]);

    // Update node with sorted array
    node.array = merged;
    node.status = 'sorted';
    // Fade out children or mark them as merged-done? 
    // "fading when sorting" -> usually children disappear or fade, and parent lights up
    allNodes[leftId].status = 'merged-done';
    allNodes[rightId].status = 'merged-done';

    steps.push(createSnapshot('merge-complete', `Merged into [${merged.join(', ')}]`, [nodeId]));

    return merged;
  }

  // Execute Split Phase
  recursiveSplit(root.id);

  // Execute Merge Phase
  // Reset leaf status to unsorted briefly? No, keep them visible.
  recursiveMerge(root.id);

  steps.push(createSnapshot('complete', 'Merge Sort Complete', [root.id]));

  return steps;
}

export function getMergeSortTreeSteps(arr) {
  return generateMergeSortTreeSteps(arr);
}
