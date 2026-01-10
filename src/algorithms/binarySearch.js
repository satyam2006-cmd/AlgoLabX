// Binary Search Step Generator
// Returns an array of steps for visualization
export function* binarySearchSteps(arr) {
  const array = [...arr];
  const target = array[0]; // Use first element as target
  const searchArray = array.slice(1); // Search in the rest
  
  yield { array: [...array], active: [], swapped: false, description: `Starting Binary Search for ${target}` };
  
  let left = 0;
  let right = searchArray.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    yield { 
      array: [target, ...searchArray], 
      active: [mid + 1], // +1 because of target at index 0
      swapped: false, 
      description: `Searching at index ${mid}, value: ${searchArray[mid]}` 
    };
    
    if (searchArray[mid] === target) {
      yield { 
        array: [target, ...searchArray], 
        active: [mid + 1], 
        swapped: true, 
        description: `Found ${target} at index ${mid}` 
      };
      return;
    } else if (searchArray[mid] < target) {
      left = mid + 1;
      yield { 
        array: [target, ...searchArray], 
        active: [mid + 1], 
        swapped: false, 
        description: `Target is greater, searching right half (${left} to ${right})` 
      };
    } else {
      right = mid - 1;
      yield { 
        array: [target, ...searchArray], 
        active: [mid + 1], 
        swapped: false, 
        description: `Target is smaller, searching left half (${left} to ${right})` 
      };
    }
  }
  
  yield { array: [target, ...searchArray], active: [], swapped: false, description: `${target} not found in array` };
}

// Get all steps as an array
export function getBinarySearchSteps(arr) {
  const generator = binarySearchSteps(arr);
  const steps = [];
  let step = generator.next();
  
  while (!step.done) {
    steps.push(step.value);
    step = generator.next();
  }
  
  return steps;
}
