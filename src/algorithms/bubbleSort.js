// Bubble Sort Step Generator
// Returns an array of steps for visualization
export function* bubbleSortSteps(arr) {
  const array = [...arr];
  const n = array.length;
  
  yield { array: [...array], active: [], swapped: false, description: "Starting Bubble Sort" };
  
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    
    for (let j = 0; j < n - i - 1; j++) {
      yield { 
        array: [...array], 
        active: [j, j + 1], 
        swapped: false, 
        description: `Comparing elements at positions ${j} and ${j + 1}` 
      };
      
      if (array[j] > array[j + 1]) {
        // Swap elements
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swapped = true;
        
        yield { 
          array: [...array], 
          active: [j, j + 1], 
          swapped: true, 
          description: `Swapped elements at positions ${j} and ${j + 1}` 
        };
      }
    }
    
    if (!swapped) {
      yield { 
        array: [...array], 
        active: [], 
        swapped: false, 
        description: "Array is already sorted" 
      };
      break;
    }
    
    yield { 
      array: [...array], 
      active: [n - i - 1], 
      swapped: false, 
      description: `Element at position ${n - i - 1} is now in correct position` 
    };
  }
  
  yield { array: [...array], active: [], swapped: false, description: "Bubble Sort completed" };
}

// Get all steps as an array
export function getBubbleSortSteps(arr) {
  const generator = bubbleSortSteps(arr);
  const steps = [];
  let step = generator.next();
  
  while (!step.done) {
    steps.push(step.value);
    step = generator.next();
  }
  
  return steps;
}
