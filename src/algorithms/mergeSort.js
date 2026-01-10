// Merge Sort Step Generator
// Returns an array of steps for visualization
export function* mergeSortSteps(arr) {
  const array = [...arr];
  
  yield { array: [...array], active: [], swapped: false, description: "Starting Merge Sort" };
  
  function* mergeSortHelper(arr, start, end) {
    if (start >= end) return;
    
    const mid = Math.floor((start + end) / 2);
    
    yield { 
      array: [...array], 
      active: Array.from({length: end - start + 1}, (_, i) => start + i), 
      swapped: false, 
      description: `Dividing array from position ${start} to ${end}` 
    };
    
    yield* mergeSortHelper(arr, start, mid);
    yield* mergeSortHelper(arr, mid + 1, end);
    yield* merge(arr, start, mid, end);
  }
  
  function* merge(arr, start, mid, end) {
    const left = arr.slice(start, mid + 1);
    const right = arr.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;
    
    yield { 
      array: [...array], 
      active: Array.from({length: end - start + 1}, (_, idx) => start + idx), 
      swapped: false, 
      description: `Merging subarrays [${start}...${mid}] and [${mid + 1}...${end}]` 
    };
    
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }
      
      yield { 
        array: [...array], 
        active: [k], 
        swapped: true, 
        description: `Placing element at position ${k}` 
      };
      k++;
    }
    
    while (i < left.length) {
      arr[k] = left[i];
      yield { 
        array: [...array], 
        active: [k], 
        swapped: true, 
        description: `Placing remaining left element at position ${k}` 
      };
      i++;
      k++;
    }
    
    while (j < right.length) {
      arr[k] = right[j];
      yield { 
        array: [...array], 
        active: [k], 
        swapped: true, 
        description: `Placing remaining right element at position ${k}` 
      };
      j++;
      k++;
    }
    
    yield { 
      array: [...array], 
      active: Array.from({length: end - start + 1}, (_, idx) => start + idx), 
      swapped: false, 
      description: `Merged subarray [${start}...${end}]` 
    };
  }
  
  yield* mergeSortHelper(array, 0, array.length - 1);
  
  yield { array: [...array], active: [], swapped: false, description: "Merge Sort completed" };
}

// Get all steps as an array
export function getMergeSortSteps(arr) {
  const generator = mergeSortSteps(arr);
  const steps = [];
  let step = generator.next();
  
  while (!step.done) {
    steps.push(step.value);
    step = generator.next();
  }
  
  return steps;
}
