// Insertion Sort Step Generator
// Returns an array of steps for visualization
export function* insertionSortSteps(arr) {
  const array = [...arr];
  const n = array.length;
  
  yield { array: [...array], active: [], swapped: false, description: "Starting Insertion Sort" };
  
  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;
    
    yield { 
      array: [...array], 
      active: [i], 
      swapped: false, 
      description: `Inserting element at position ${i}` 
    };
    
    while (j >= 0 && array[j] > key) {
      yield { 
        array: [...array], 
        active: [j, j + 1], 
        swapped: false, 
        description: `Comparing elements at positions ${j} and ${j + 1}` 
      };
      
      array[j + 1] = array[j];
      j--;
      
      yield { 
        array: [...array], 
        active: [j + 1, j + 2], 
        swapped: true, 
        description: `Shifting element to the right` 
      };
    }
    
    array[j + 1] = key;
    
    yield { 
      array: [...array], 
      active: [j + 1], 
      swapped: true, 
      description: `Placed element at position ${j + 1}` 
    };
  }
  
  yield { array: [...array], active: [], swapped: false, description: "Insertion Sort completed" };
}

// Get all steps as an array
export function getInsertionSortSteps(arr) {
  const generator = insertionSortSteps(arr);
  const steps = [];
  let step = generator.next();
  
  while (!step.done) {
    steps.push(step.value);
    step = generator.next();
  }
  
  return steps;
}
