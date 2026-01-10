// Merge Sort Step Generator
// Returns an array of steps for visualization
export function mergeSortSteps(input) {
  const arr = [...input];
  const steps = [];
  
  // Helper function to merge two sorted subarrays
  function merge(left, right, startIdx) {
    const merged = [];
    let i = 0, j = 0;
    let k = startIdx;
    
    steps.push({
      array: [...arr],
      active: [],
      swapped: false,
      message: `Merging [${left.join(', ')}] and [${right.join(', ')}]`
    });
    
    while (i < left.length && j < right.length) {
      steps.push({
        array: [...arr],
        active: [startIdx + i, startIdx + left.length + j],
        swapped: false,
        message: `Comparing ${left[i]} and ${right[j]}`
      });
      
      if (left[i] <= right[j]) {
        arr[k] = left[i];
        steps.push({
          array: [...arr],
          active: [k],
          swapped: true,
          message: `Placed ${left[i]} at position ${k}`
        });
        merged.push(left[i]);
        i++;
      } else {
        arr[k] = right[j];
        steps.push({
          array: [...arr],
          active: [k],
          swapped: true,
          message: `Placed ${right[j]} at position ${k}`
        });
        merged.push(right[j]);
        j++;
      }
      k++;
    }
    
    // Copy remaining elements
    while (i < left.length) {
      arr[k] = left[i];
      steps.push({
        array: [...arr],
        active: [k],
        swapped: true,
        message: `Placed remaining ${left[i]} at position ${k}`
      });
      merged.push(left[i]);
      i++;
      k++;
    }
    
    while (j < right.length) {
      arr[k] = right[j];
      steps.push({
        array: [...arr],
        active: [k],
        swapped: true,
        message: `Placed remaining ${right[j]} at position ${k}`
      });
      merged.push(right[j]);
      j++;
      k++;
    }
    
    return merged;
  }
  
  // Recursive merge sort function
  function mergeSort(start, end) {
    if (end - start <= 1) return;
    
    const mid = Math.floor((start + end) / 2);
    
    steps.push({
      array: [...arr],
      active: [],
      swapped: false,
      message: `Dividing array from index ${start} to ${end}`
    });
    
    mergeSort(start, mid);
    mergeSort(mid, end);
    
    const left = arr.slice(start, mid);
    const right = arr.slice(mid, end);
    merge(left, right, start);
  }
  
  // Initial state
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Starting Merge Sort"
  });
  
  mergeSort(0, arr.length);
  
  // Final state
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Merge Sort completed"
  });
  
  return steps;
}
