// Quick Sort Step Generator
// Returns an array of steps for visualization
export function* quickSortSteps(arr) {
  const array = [...arr];
  
  yield { array: [...array], active: [], swapped: false, description: "Starting Quick Sort" };
  
  function* quickSortHelper(low, high) {
    if (low < high) {
      const pivotIndex = yield* partition(low, high);
      yield* quickSortHelper(low, pivotIndex - 1);
      yield* quickSortHelper(pivotIndex + 1, high);
    }
  }
  
  function* partition(low, high) {
    const pivot = array[high];
    yield { 
      array: [...array], 
      active: [high], 
      swapped: false, 
      description: `Choosing pivot element ${pivot} at position ${high}` 
    };
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      yield { 
        array: [...array], 
        active: [j, high], 
        swapped: false, 
        description: `Comparing ${array[j]} with pivot ${pivot}` 
      };
      
      if (array[j] <= pivot) {
        i++;
        if (i !== j) {
          [array[i], array[j]] = [array[j], array[i]];
          yield { 
            array: [...array], 
            active: [i, j], 
            swapped: true, 
            description: `Swapped ${array[j]} with ${array[i]}` 
          };
        }
      }
    }
    
    // Place pivot in correct position
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    yield { 
      array: [...array], 
      active: [i + 1, high], 
      swapped: true, 
      description: `Placed pivot ${pivot} at position ${i + 1}` 
    };
    
    return i + 1;
  }
  
  yield* quickSortHelper(0, array.length - 1);
  
  yield { array: [...array], active: [], swapped: false, description: "Quick Sort completed" };
}

// Get all steps as an array
export function getQuickSortSteps(arr) {
  const generator = quickSortSteps(arr);
  const steps = [];
  let step = generator.next();
  
  while (!step.done) {
    steps.push(step.value);
    step = generator.next();
  }
  
  return steps;
}
