// Selection Sort Step Generator
// Returns an array of steps for visualization
export function* selectionSortSteps(arr) {
  const array = [...arr];
  const n = array.length;
  
  yield { array: [...array], active: [], swapped: false, description: "Starting Selection Sort" };
  
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    
    yield { 
      array: [...array], 
      active: [i], 
      swapped: false, 
      description: `Finding minimum element from position ${i}` 
    };
    
    for (let j = i + 1; j < n; j++) {
      yield { 
        array: [...array], 
        active: [minIdx, j], 
        swapped: false, 
        description: `Comparing elements at positions ${minIdx} and ${j}` 
      };
      
      if (array[j] < array[minIdx]) {
        minIdx = j;
        yield { 
          array: [...array], 
          active: [minIdx], 
          swapped: false, 
          description: `New minimum found at position ${minIdx}` 
        };
      }
    }
    
    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      
      yield { 
        array: [...array], 
        active: [i, minIdx], 
        swapped: true, 
        description: `Swapped minimum element to position ${i}` 
      };
    }
    
    yield { 
      array: [...array], 
      active: [i], 
      swapped: false, 
      description: `Element at position ${i} is now sorted` 
    };
  }
  
  yield { array: [...array], active: [], swapped: false, description: "Selection Sort completed" };
}

// Get all steps as an array
export function getSelectionSortSteps(arr) {
  const generator = selectionSortSteps(arr);
  const steps = [];
  let step = generator.next();
  
  while (!step.done) {
    steps.push(step.value);
    step = generator.next();
  }
  
  return steps;
}
