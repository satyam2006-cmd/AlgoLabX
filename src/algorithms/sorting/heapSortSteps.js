// Heap Sort Step Generator
// Returns an array of steps for visualization
export function heapSortSteps(input) {
  const arr = [...input];
  const steps = [];
  const n = arr.length;
  
  // Helper function to heapify a subtree
  function heapify(n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    steps.push({
      array: [...arr],
      active: [largest, left, right],
      swapped: false,
      message: `Heapifying subtree at root ${i}`
    });
    
    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }
    
    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }
    
    if (largest !== i) {
      steps.push({
        array: [...arr],
        active: [i, largest],
        swapped: false,
        message: `Largest element found at position ${largest}`
      });
      
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      steps.push({
        array: [...arr],
        active: [i, largest],
        swapped: true,
        message: `Swapped ${arr[largest]} with ${arr[i]}`
      });
      
      heapify(n, largest);
    }
  }
  
  // Initial state
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Starting Heap Sort - Building max heap"
  });
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    steps.push({
      array: [...arr],
      active: [i],
      swapped: false,
      message: `Building heap from index ${i}`
    });
    heapify(n, i);
  }
  
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Max heap built, starting extraction"
  });
  
  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    steps.push({
      array: [...arr],
      active: [0, i],
      swapped: false,
      message: `Moving largest element ${arr[0]} to position ${i}`
    });
    
    [arr[0], arr[i]] = [arr[i], arr[0]];
    steps.push({
      array: [...arr],
      active: [0, i],
      swapped: true,
      message: `Swapped ${arr[i]} with ${arr[0]}`
    });
    
    // Call heapify on the reduced heap
    steps.push({
      array: [...arr],
      active: [0],
      swapped: false,
      message: `Heapifying reduced heap of size ${i}`
    });
    heapify(i, 0);
  }
  
  // Final state
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Heap Sort completed"
  });
  
  return steps;
}
