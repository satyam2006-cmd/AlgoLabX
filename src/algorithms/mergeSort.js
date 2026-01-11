// Merge Sort Tree Visualization Generator
// Generates clear divide-and-conquer tree steps
export function generateMergeSortSteps(initialArray) {
  const steps = [];
  const originalArray = [...initialArray];
  
  // Build the complete tree structure first
  let treeLevels = [];
  
  function buildTree(arr, level = 0) {
    if (arr.length <= 1) {
      // Base case: single element
      if (!treeLevels[level]) {
        treeLevels[level] = [];
      }
      treeLevels[level].push([...arr]);
      return [...arr];
    }
    
    // Add current array to this level
    if (!treeLevels[level]) {
      treeLevels[level] = [];
    }
    treeLevels[level].push([...arr]);
    
    // Divide
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    
    // Recursively build sub-trees
    const sortedLeft = buildTree(left, level + 1);
    const sortedRight = buildTree(right, level + 1);
    
    // Merge and return
    return mergeArrays(sortedLeft, sortedRight);
  }
  
  function mergeArrays(left, right) {
    const result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
    }
    
    // Add remaining elements
    return [...result, ...left.slice(i), ...right.slice(j)];
  }
  
  // Build the complete tree
  const sortedResult = buildTree(originalArray);
  
  // Generate divide phase steps (top to bottom)
  steps.push({
    type: 'start',
    phase: 'divide',
    description: `Starting Merge Sort with [${originalArray.join(', ')}]`
  });
  
  // Show each level of division
  for (let level = 0; level < treeLevels.length; level++) {
    steps.push({
      type: 'divide_level',
      phase: 'divide',
      level,
      arrays: [...treeLevels[level]],
      description: `Level ${level}: Splitting into ${treeLevels[level].length} subarray${treeLevels[level].length > 1 ? 's' : ''}`
    });
  }
  
  // Generate merge phase steps (bottom to top)
  steps.push({
    type: 'merge_phase_start',
    phase: 'merge',
    description: 'Starting merge phase - building sorted arrays from bottom up'
  });
  
  // Build merge levels from bottom up
  let mergeLevels = [];
  let currentLevel = [...treeLevels[treeLevels.length - 1]]; // Start with single elements
  
  while (currentLevel.length > 1) {
    const nextLevel = [];
    
    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        // Merge two adjacent arrays
        const merged = mergeArrays(currentLevel[i], currentLevel[i + 1]);
        nextLevel.push(merged);
        
        steps.push({
          type: 'merge_step',
          phase: 'merge',
          leftArray: [...currentLevel[i]],
          rightArray: [...currentLevel[i + 1]],
          resultArray: [...merged],
          description: `Merging [${currentLevel[i].join(', ')}] + [${currentLevel[i + 1].join(', ')}] → [${merged.join(', ')}]`
        });
      } else {
        // Carry over odd array
        nextLevel.push([...currentLevel[i]]);
      }
    }
    
    mergeLevels.push([...nextLevel]);
    currentLevel = nextLevel;
  }
  
  // Final result
  steps.push({
    type: 'complete',
    phase: 'complete',
    inputArray: originalArray,
    outputArray: sortedResult,
    description: `Merge Sort Complete! Input: [${originalArray.join(', ')}] → Output: [${sortedResult.join(', ')}]`
  });
  
  return steps;
}

// Get all steps as an array
export function getMergeSortSteps(arr) {
  return generateMergeSortSteps(arr);
}
