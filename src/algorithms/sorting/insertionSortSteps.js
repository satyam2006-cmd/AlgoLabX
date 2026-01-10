// Insertion Sort Step Generator
// Returns an array of steps for visualization
export function insertionSortSteps(input) {
  const arr = [...input];
  const steps = [];
  const n = arr.length;
  
  // Initial state
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Starting Insertion Sort"
  });
  
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    
    steps.push({
      array: [...arr],
      active: [i],
      swapped: false,
      message: `Inserting element ${key} at position ${i}`
    });
    
    // Move elements greater than key to one position ahead
    while (j >= 0 && arr[j] > key) {
      steps.push({
        array: [...arr],
        active: [j, j + 1],
        swapped: false,
        message: `Comparing ${arr[j]} with ${key}`
      });
      
      arr[j + 1] = arr[j];
      steps.push({
        array: [...arr],
        active: [j, j + 1],
        swapped: true,
        message: `Shifting element ${arr[j]} to the right`
      });
      
      j--;
    }
    
    // Place key at its correct position
    arr[j + 1] = key;
    steps.push({
      array: [...arr],
      active: [j + 1],
      swapped: true,
      message: `Inserted ${key} at position ${j + 1}`
    });
  }
  
  // Final state
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Insertion Sort completed"
  });
  
  return steps;
}
