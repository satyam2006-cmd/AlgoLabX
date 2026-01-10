// Selection Sort Step Generator
// Returns an array of steps for visualization
export function selectionSortSteps(input) {
  const arr = [...input];
  const steps = [];
  const n = arr.length;
  
  // Initial state
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Starting Selection Sort"
  });
  
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    
    // Find minimum element in unsorted portion
    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...arr],
        active: [minIdx, j],
        swapped: false,
        message: `Comparing elements at positions ${minIdx} and ${j}`
      });
      
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          array: [...arr],
          active: [minIdx],
          swapped: false,
          message: `New minimum found at position ${minIdx}`
        });
      }
    }
    
    // Swap minimum element with element at position i
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      steps.push({
        array: [...arr],
        active: [i, minIdx],
        swapped: true,
        message: `Swapped minimum element to position ${i}`
      });
    }
    
    steps.push({
      array: [...arr],
      active: [i],
      swapped: false,
      message: `Element at position ${i} is now sorted`
    });
  }
  
  // Final state
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Selection Sort completed"
  });
  
  return steps;
}
