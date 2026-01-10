// Heap Sort Step Generator
// Returns an array of steps for visualization
export function* heapSortSteps(arr) {
  const array = [...arr];
  const n = array.length;
  
  yield { array: [...array], active: [], swapped: false, description: "Starting Heap Sort" };
  
  function* heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    yield { 
      array: [...array], 
      active: [i, left, right].filter(idx => idx < n), 
      swapped: false, 
      description: `Heapifying node at position ${i}` 
    };
    
    if (left < n && array[left] > array[largest]) {
      largest = left;
    }
    
    if (right < n && array[right] > array[largest]) {
      largest = right;
    }
    
    if (largest !== i) {
      [array[i], array[largest]] = [array[largest], array[i]];
      
      yield { 
        array: [...array], 
        active: [i, largest], 
        swapped: true, 
        description: `Swapped elements at positions ${i} and ${largest}` 
      };
      
      yield* heapify(arr, n, largest);
    }
  }
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(arr, n, i);
  }
  
  yield { 
    array: [...array], 
    active: [], 
    swapped: false, 
    description: "Max heap built" 
  };
  
  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    
    yield { 
      array: [...array], 
      active: [0, i], 
      swapped: true, 
      description: `Moving largest element to position ${i}` 
    };
    
    yield* heapify(arr, i, 0);
    
    yield { 
      array: [...array], 
      active: [i], 
      swapped: false, 
      description: `Element at position ${i} is now sorted` 
    };
  }
  
  yield { array: [...array], active: [], swapped: false, description: "Heap Sort completed" };
}

// Get all steps as an array
export function getHeapSortSteps(arr) {
  const generator = heapSortSteps(arr);
  const steps = [];
  let step = generator.next();
  
  while (!step.done) {
    steps.push(step.value);
    step = generator.next();
  }
  
  return steps;
}
