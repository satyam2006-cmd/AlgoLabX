// Binary Search Step Generator
// Returns an array of steps for visualization
export function binarySearchSteps(input) {
  const arr = [...input];
  const steps = [];
  
  // Binary search requires sorted array
  const sortedArr = [...arr].sort((a, b) => a - b);
  const target = sortedArr[0]; // Use first element as target for demonstration
  
  // Initial state
  steps.push({
    array: [...sortedArr],
    active: [],
    swapped: false,
    message: `Starting Binary Search for target: ${target}`
  });
  
  let left = 0;
  let right = sortedArr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    steps.push({
      array: [...sortedArr],
      active: [mid],
      swapped: false,
      message: `Searching in range [${left}, ${right}], mid = ${mid}`
    });
    
    if (sortedArr[mid] === target) {
      steps.push({
        array: [...sortedArr],
        active: [mid],
        swapped: true,
        message: `Found target ${target} at position ${mid}!`
      });
      break;
    } else if (sortedArr[mid] < target) {
      steps.push({
        array: [...sortedArr],
        active: [mid],
        swapped: false,
        message: `${sortedArr[mid]} < ${target}, searching right half`
      });
      left = mid + 1;
    } else {
      steps.push({
        array: [...sortedArr],
        active: [mid],
        swapped: false,
        message: `${sortedArr[mid]} > ${target}, searching left half`
      });
      right = mid - 1;
    }
  }
  
  if (left > right) {
    steps.push({
      array: [...sortedArr],
      active: [],
      swapped: false,
      message: `Target ${target} not found in array`
    });
  }
  
  // Final state
  steps.push({
    array: [...sortedArr],
    active: [],
    swapped: false,
    message: "Binary Search completed"
  });
  
  return steps;
}
