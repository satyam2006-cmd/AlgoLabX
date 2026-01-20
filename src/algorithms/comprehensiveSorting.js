// Comprehensive Sorting Algorithms Collection
// All algorithms return step-by-step visualization data

// Bubble Sort
export function* bubbleSortSteps(arr) {
  const n = arr.length;
  
  yield {
    array: [...arr],
    active: [],
    swapped: false,
    message: "Starting Bubble Sort"
  };
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield {
        array: [...arr],
        active: [j, j + 1],
        swapped: false,
        message: `Comparing elements at positions ${j} and ${j + 1}`
      };
      
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        yield {
          array: [...arr],
          active: [j, j + 1],
          swapped: true,
          message: `Swapped elements at positions ${j} and ${j + 1}`
        };
      }
    }
  }
  
  yield {
    array: [...arr],
    active: [],
    swapped: false,
    message: "Bubble Sort completed"
  };
}

// Selection Sort
export function* selectionSortSteps(arr) {
  const n = arr.length;
  
  yield {
    array: [...arr],
    active: [],
    swapped: false,
    message: "Starting Selection Sort"
  };
  
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    
    for (let j = i + 1; j < n; j++) {
      yield {
        array: [...arr],
        active: [minIdx, j],
        swapped: false,
        message: `Comparing elements at positions ${minIdx} and ${j}`
      };
      
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      yield {
        array: [...arr],
        active: [i, minIdx],
        swapped: true,
        message: `Swapped minimum element to position ${i}`
      };
    }
  }
  
  yield {
    array: [...arr],
    active: [],
    swapped: false,
    message: "Selection Sort completed"
  };
}

// Insertion Sort
export function insertionSortSteps(arr) {
  const steps = [];
  const n = arr.length;
  
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
    
    arr[j + 1] = key;
    steps.push({
      array: [...arr],
      active: [j + 1],
      swapped: true,
      message: `Inserted ${key} at position ${j + 1}`
    });
  }
  
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Insertion Sort completed"
  });
  
  return steps;
}

// Merge Sort
export function mergeSortSteps(arr) {
  const steps = [];
  
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
  
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Starting Merge Sort"
  });
  
  mergeSort(0, arr.length);
  
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Merge Sort completed"
  });
  
  return steps;
}

// Quick Sort
export function quickSortSteps(arr) {
  const steps = [];
  
  function partition(low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    steps.push({
      array: [...arr],
      active: [high],
      swapped: false,
      message: `Pivot selected: ${pivot} at position ${high}`
    });
    
    for (let j = low; j < high; j++) {
      steps.push({
        array: [...arr],
        active: [j, high],
        swapped: false,
        message: `Comparing ${arr[j]} with pivot ${pivot}`
      });
      
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push({
          array: [...arr],
          active: [i, j],
          swapped: true,
          message: `Swapped ${arr[j]} with ${arr[i]}`
        });
      }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push({
      array: [...arr],
      active: [i + 1, high],
      swapped: true,
      message: `Placed pivot ${pivot} at position ${i + 1}`
    });
    
    return i + 1;
  }
  
  function quickSort(low, high) {
    if (low < high) {
      steps.push({
        array: [...arr],
        active: [low, high],
        swapped: false,
        message: `QuickSort on range [${low}, ${high}]`
      });
      
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    }
  }
  
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Starting Quick Sort"
  });
  
  quickSort(0, arr.length - 1);
  
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Quick Sort completed"
  });
  
  return steps;
}

// Heap Sort
export function heapSortSteps(arr) {
  const steps = [];
  const n = arr.length;
  
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
  
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Starting Heap Sort - Building max heap"
  });
  
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
  
  for (let i = n - 1; i > 0; i--) {
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
    
    steps.push({
      array: [...arr],
      active: [0],
      swapped: false,
      message: `Heapifying reduced heap of size ${i}`
    });
    heapify(i, 0);
  }
  
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Heap Sort completed"
  });
  
  return steps;
}

// Counting Sort
export function countingSortSteps(arr) {
  const steps = [];
  const n = arr.length;
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;
  
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Starting Counting Sort"
  });
  
  const count = new Array(range).fill(0);
  
  // Count occurrences
  for (let i = 0; i < n; i++) {
    count[arr[i] - min]++;
    steps.push({
      array: [...arr],
      active: [i],
      swapped: false,
      message: `Counting occurrences of ${arr[i]}`
    });
  }
  
  // Calculate cumulative count
  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
    steps.push({
      array: [...arr],
      active: [],
      swapped: false,
      message: `Calculating cumulative count for position ${i}`
    });
  }
  
  const output = new Array(n);
  
  // Build output array
  for (let i = n - 1; i >= 0; i--) {
    output[count[arr[i] - min] - 1] = arr[i];
    count[arr[i] - min]--;
    steps.push({
      array: [...output],
      active: [count[arr[i] - min]],
      swapped: true,
      message: `Placing ${arr[i]} at position ${count[arr[i] - min]}`
    });
  }
  
  // Copy back to original array
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
  }
  
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Counting Sort completed"
  });
  
  return steps;
}

// Radix Sort
export function radixSortSteps(arr) {
  const steps = [];
  const n = arr.length;
  const max = Math.max(...arr);
  
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Starting Radix Sort"
  });
  
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    steps.push({
      array: [...arr],
      active: [],
      swapped: false,
      message: `Sorting by digit place ${exp}`
    });
    
    const output = new Array(n);
    const count = new Array(10).fill(0);
    
    // Count occurrences of digits
    for (let i = 0; i < n; i++) {
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
      steps.push({
        array: [...arr],
        active: [i],
        swapped: false,
        message: `Counting digit ${digit} of ${arr[i]}`
      });
    }
    
    // Calculate cumulative count
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }
    
    // Build output array
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
    }
    
    // Copy back to original array
    for (let i = 0; i < n; i++) {
      arr[i] = output[i];
    }
    
    steps.push({
      array: [...arr],
      active: [],
      swapped: true,
      message: `Completed sorting by digit place ${exp}`
    });
  }
  
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Radix Sort completed"
  });
  
  return steps;
}

// Helper functions to get all steps
export function getBubbleSortSteps(arr) {
  // Simple implementation that returns steps directly with sorted tracking
  const steps = [];
  const workArray = [...arr]; // Create a copy to work with
  const n = workArray.length;
  const sorted = []; // Track sorted indices
  
  steps.push({
    array: [...workArray],
    active: [],
    swapped: false,
    sorted: [...sorted],
    message: "Starting Bubble Sort - comparing adjacent elements and swapping if needed"
  });
  
  for (let i = 0; i < n - 1; i++) {
    let swappedThisPass = false;
    
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...workArray],
        active: [j, j + 1],
        swapped: false,
        sorted: [...sorted],
        message: `Comparing ${workArray[j]} and ${workArray[j + 1]}`
      });
      
      if (workArray[j] > workArray[j + 1]) {
        [workArray[j], workArray[j + 1]] = [workArray[j + 1], workArray[j]];
        swappedThisPass = true;
        steps.push({
          array: [...workArray],
          active: [j, j + 1],
          swapped: true,
          sorted: [...sorted],
          message: `Swapped ${workArray[j]} and ${workArray[j + 1]}`
        });
      }
    }
    
    // Mark the last element of this pass as sorted
    sorted.push(n - 1 - i);
    steps.push({
      array: [...workArray],
      active: [],
      swapped: false,
      sorted: [...sorted],
      message: `Pass ${i + 1} complete - element at position ${n - 1 - i} is now in its final position`
    });
    
    // Early exit if no swaps occurred
    if (!swappedThisPass) {
      // Mark all remaining as sorted
      for (let k = 0; k < n - i - 1; k++) {
        if (!sorted.includes(k)) sorted.push(k);
      }
      break;
    }
  }
  
  // Mark all as sorted at the end
  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push({
    array: [...workArray],
    active: [],
    swapped: false,
    sorted: allSorted,
    message: "Bubble Sort completed! Array is now fully sorted."
  });
  
  return steps;
}

export function getSelectionSortSteps(arr) {
  // Simple implementation that returns steps directly with sorted tracking
  const steps = [];
  const workArray = [...arr]; // Create a copy to work with
  const n = workArray.length;
  const sorted = []; // Track sorted indices
  
  steps.push({
    array: [...workArray],
    active: [],
    swapped: false,
    sorted: [...sorted],
    minIdx: undefined,
    message: "Starting Selection Sort - finding minimum element in each pass"
  });
  
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    
    steps.push({
      array: [...workArray],
      active: [i],
      swapped: false,
      sorted: [...sorted],
      minIdx: minIdx,
      message: `Pass ${i + 1}: Looking for minimum element starting from position ${i}`
    });
    
    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...workArray],
        active: [j],
        swapped: false,
        sorted: [...sorted],
        minIdx: minIdx,
        checkIdx: j,
        message: `Comparing ${workArray[j]} with current minimum ${workArray[minIdx]}`
      });
      
      if (workArray[j] < workArray[minIdx]) {
        minIdx = j;
        steps.push({
          array: [...workArray],
          active: [j],
          swapped: false,
          sorted: [...sorted],
          minIdx: minIdx,
          message: `New minimum found: ${workArray[minIdx]} at position ${minIdx}`
        });
      }
    }
    
    if (minIdx !== i) {
      [workArray[i], workArray[minIdx]] = [workArray[minIdx], workArray[i]];
      steps.push({
        array: [...workArray],
        active: [i, minIdx],
        swapped: true,
        sorted: [...sorted],
        message: `Swapped minimum ${workArray[i]} to position ${i}`
      });
    }
    
    // Mark position i as sorted
    sorted.push(i);
    steps.push({
      array: [...workArray],
      active: [],
      swapped: false,
      sorted: [...sorted],
      message: `Position ${i} is now sorted with value ${workArray[i]}`
    });
  }
  
  // Mark last element as sorted
  sorted.push(n - 1);
  steps.push({
    array: [...workArray],
    active: [],
    swapped: false,
    sorted: [...sorted],
    message: "Selection Sort completed! Array is now fully sorted."
  });
  
  return steps;
}

export function getInsertionSortSteps(arr) {
  // Simple implementation that returns steps directly with sorted tracking
  const steps = [];
  const workArray = [...arr]; // Create a copy to work with
  const n = workArray.length;
  const sorted = [0]; // First element is always "sorted" initially
  
  steps.push({
    array: [...workArray],
    active: [],
    swapped: false,
    sorted: [...sorted],
    keyIdx: undefined,
    message: "Starting Insertion Sort - building sorted portion one element at a time"
  });
  
  for (let i = 1; i < n; i++) {
    const key = workArray[i];
    let j = i - 1;
    
    steps.push({
      array: [...workArray],
      active: [],
      swapped: false,
      sorted: [...sorted],
      keyIdx: i,
      message: `Inserting element ${key} from position ${i} into sorted portion`
    });
    
    while (j >= 0 && workArray[j] > key) {
      steps.push({
        array: [...workArray],
        active: [j, j + 1],
        swapped: false,
        sorted: [...sorted],
        keyIdx: j + 1,
        message: `${workArray[j]} > ${key}, shifting ${workArray[j]} to the right`
      });
      
      workArray[j + 1] = workArray[j];
      steps.push({
        array: [...workArray],
        active: [j, j + 1],
        swapped: true,
        sorted: [...sorted],
        keyIdx: j,
        message: `Shifted ${workArray[j + 1]} from position ${j} to ${j + 1}`
      });
      
      j--;
    }
    
    workArray[j + 1] = key;
    
    // Update sorted portion - all elements from 0 to i are now sorted
    sorted.length = 0;
    for (let k = 0; k <= i; k++) sorted.push(k);
    
    steps.push({
      array: [...workArray],
      active: [j + 1],
      swapped: true,
      sorted: [...sorted],
      message: `Placed ${key} at position ${j + 1} - sorted portion now has ${i + 1} elements`
    });
  }
  
  // All elements are sorted
  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push({
    array: [...workArray],
    active: [],
    swapped: false,
    sorted: allSorted,
    message: "Insertion Sort completed! Array is now fully sorted."
  });
  
  return steps;
}

export function getMergeSortSteps(arr) {
  // Simple implementation that returns steps directly
  const steps = [];
  const workArray = [...arr]; // Create a copy to work with
  const sorted = []; // Track sorted indices
  
  steps.push({
    array: [...workArray],
    active: [],
    swapped: false,
    sorted: [...sorted],
    message: "Starting Merge Sort"
  });
  
  function merge(left, right, startIdx) {
    const merged = [];
    let i = 0, j = 0;
    let k = startIdx;
    
    steps.push({
      array: [...workArray],
      active: [],
      swapped: false,
      sorted: [...sorted],
      message: `Merging [${left.join(', ')}] and [${right.join(', ')}]`
    });
    
    while (i < left.length && j < right.length) {
      steps.push({
        array: [...workArray],
        active: [startIdx + i, startIdx + left.length + j],
        swapped: false,
        sorted: [...sorted],
        message: `Comparing ${left[i]} and ${right[j]}`
      });
      
      if (left[i] <= right[j]) {
        workArray[k] = left[i];
        steps.push({
          array: [...workArray],
          active: [k],
          swapped: true,
          sorted: [...sorted],
          message: `Placed ${left[i]} at position ${k}`
        });
        merged.push(left[i]);
        i++;
      } else {
        workArray[k] = right[j];
        steps.push({
          array: [...workArray],
          active: [k],
          swapped: true,
          sorted: [...sorted],
          message: `Placed ${right[j]} at position ${k}`
        });
        merged.push(right[j]);
        j++;
      }
      k++;
    }
    
    while (i < left.length) {
      workArray[k] = left[i];
      steps.push({
        array: [...workArray],
        active: [k],
        swapped: true,
        sorted: [...sorted],
        message: `Placed remaining ${left[i]} at position ${k}`
      });
      merged.push(left[i]);
      i++;
      k++;
    }
    
    while (j < right.length) {
      workArray[k] = right[j];
      steps.push({
        array: [...workArray],
        active: [k],
        swapped: true,
        sorted: [...sorted],
        message: `Placed remaining ${right[j]} at position ${k}`
      });
      merged.push(right[j]);
      j++;
      k++;
    }
    
    return merged;
  }
  
  function mergeSort(start, end) {
    if (end - start <= 1) return;
    
    const mid = Math.floor((start + end) / 2);
    
    steps.push({
      array: [...workArray],
      active: [],
      swapped: false,
      sorted: [...sorted],
      message: `Dividing array from index ${start} to ${end}`
    });
    
    mergeSort(start, mid);
    mergeSort(mid, end);
    
    const left = workArray.slice(start, mid);
    const right = workArray.slice(mid, end);
    merge(left, right, start);
  }
  
  mergeSort(0, workArray.length);
  
  const allSorted = Array.from({ length: workArray.length }, (_, i) => i);
  steps.push({
    array: [...workArray],
    active: [],
    swapped: false,
    sorted: allSorted,
    message: "Merge Sort completed! Array is now fully sorted."
  });
  
  return steps;
}

export function getQuickSortSteps(arr) {
  // Simple implementation that returns steps directly
  const steps = [];
  const workArray = [...arr]; // Create a copy to work with
  const sorted = []; // Track sorted indices
  
  steps.push({
    array: [...workArray],
    active: [],
    swapped: false,
    sorted: [...sorted],
    message: "Starting Quick Sort"
  });
  
  function partition(low, high) {
    const pivot = workArray[high];
    let i = low - 1;
    
    steps.push({
      array: [...workArray],
      active: [high],
      swapped: false,
      sorted: [...sorted],
      message: `Pivot selected: ${pivot} at position ${high}`
    });
    
    for (let j = low; j < high; j++) {
      steps.push({
        array: [...workArray],
        active: [j, high],
        swapped: false,
        sorted: [...sorted],
        message: `Comparing ${workArray[j]} with pivot ${pivot}`
      });
      
      if (workArray[j] < pivot) {
        i++;
        [workArray[i], workArray[j]] = [workArray[j], workArray[i]];
        steps.push({
          array: [...workArray],
          active: [i, j],
          swapped: true,
          sorted: [...sorted],
          message: `Swapped ${workArray[j]} with ${workArray[i]}`
        });
      }
    }
    
    [workArray[i + 1], workArray[high]] = [workArray[high], workArray[i + 1]];
    steps.push({
      array: [...workArray],
      active: [i + 1, high],
      swapped: true,
      sorted: [...sorted],
      message: `Placed pivot ${pivot} at position ${i + 1}`
    });
    
    return i + 1;
  }
  
  function quickSort(low, high) {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    }
  }
  
  quickSort(0, workArray.length - 1);
  
  const allSorted = Array.from({ length: workArray.length }, (_, i) => i);
  steps.push({
    array: [...workArray],
    active: [],
    swapped: false,
    sorted: allSorted,
    message: "Quick Sort completed! Array is now fully sorted."
  });
  
  return steps;
}

export function getHeapSortSteps(arr) {
  // Simple implementation that returns steps directly
  const steps = [];
  const workArray = [...arr]; // Create a copy to work with
  const n = workArray.length;
  const sorted = []; // Track sorted indices
  
  steps.push({
    array: [...workArray],
    active: [],
    swapped: false,
    sorted: [...sorted],
    message: "Starting Heap Sort"
  });
  
  function heapify(n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < n) {
      steps.push({
        array: [...workArray],
        active: [largest, left],
        swapped: false,
        sorted: [...sorted],
        message: `Comparing parent ${workArray[largest]} with left child ${workArray[left]}`
      });
      
      if (workArray[left] > workArray[largest]) {
        largest = left;
      }
    }
    
    if (right < n) {
      steps.push({
        array: [...workArray],
        active: [largest, right],
        swapped: false,
        sorted: [...sorted],
        message: `Comparing largest ${workArray[largest]} with right child ${workArray[right]}`
      });
      
      if (workArray[right] > workArray[largest]) {
        largest = right;
      }
    }
    
    if (largest !== i) {
      [workArray[i], workArray[largest]] = [workArray[largest], workArray[i]];
      steps.push({
        array: [...workArray],
        active: [i, largest],
        swapped: true,
        sorted: [...sorted],
        message: `Swapped ${workArray[largest]} with ${workArray[i]}`
      });
      heapify(n, largest);
    }
  }
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    steps.push({
      array: [...workArray],
      active: [i],
      swapped: false,
      sorted: [...sorted],
      message: `Building max heap, starting at index ${i}`
    });
    heapify(n, i);
  }
  
  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    sorted.push(i); // Mark as sorted after moving to correct position
    [workArray[0], workArray[i]] = [workArray[i], workArray[0]];
    steps.push({
      array: [...workArray],
      active: [0, i],
      swapped: true,
      sorted: [...sorted],
      message: `Swapped max element ${workArray[i]} to position ${i}`
    });
    heapify(i, 0);
  }
  
  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push({
    array: [...workArray],
    active: [],
    swapped: false,
    sorted: allSorted,
    message: "Heap Sort completed! Array is now fully sorted."
  });
  
  return steps;
}

export function getCountingSortSteps(arr) {
  // Simple implementation that returns steps directly with sorted tracking
  const steps = [];
  const workArray = [...arr]; // Create a copy to work with
  const n = workArray.length;
  const max = Math.max(...workArray);
  const sorted = [];
  
  steps.push({
    array: [...workArray],
    active: [],
    swapped: false,
    sorted: [...sorted],
    message: "Starting Counting Sort - a non-comparison sorting algorithm"
  });
  
  // Create count array
  const count = new Array(max + 1).fill(0);
  
  steps.push({
    array: [...workArray],
    active: [],
    swapped: false,
    sorted: [...sorted],
    message: `Created count array of size ${max + 1} to store frequency of each element`
  });
  
  // Store count of each element
  for (let i = 0; i < n; i++) {
    count[workArray[i]]++;
    steps.push({
      array: [...workArray],
      active: [i],
      swapped: false,
      sorted: [...sorted],
      message: `Counted element ${workArray[i]}, frequency is now ${count[workArray[i]]}`
    });
  }
  
  // Store cumulative count
  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
    steps.push({
      array: [...workArray],
      active: [],
      swapped: false,
      sorted: [...sorted],
      message: `Cumulative count: elements ≤ ${i} appear ${count[i]} times`
    });
  }
  
  // Build output array (filled with zeros initially for better visualization)
  const output = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    const position = count[workArray[i]] - 1;
    output[position] = workArray[i];
    count[workArray[i]]--;
    
    // Mark position as sorted
    sorted.push(position);
    
    steps.push({
      array: [...output],
      active: [position],
      swapped: true,
      sorted: [...sorted],
      message: `Placed ${workArray[i]} at final position ${position}`
    });
  }
  
  // Copy to original array
  for (let i = 0; i < n; i++) {
    workArray[i] = output[i];
  }
  
  // Mark all as sorted
  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push({
    array: [...workArray],
    active: [],
    swapped: false,
    sorted: allSorted,
    message: "Counting Sort completed! Array is now fully sorted."
  });
  
  return steps;
}

export function getRadixSortSteps(arr) {
  // Simple implementation that returns steps directly with sorted tracking
  const steps = [];
  const workArray = [...arr]; // Create a copy to work with
  const n = workArray.length;
  const max = Math.max(...workArray);
  const sorted = [];
  
  steps.push({
    array: [...workArray],
    active: [],
    swapped: false,
    sorted: [...sorted],
    message: "Starting Radix Sort - sorting by individual digits from least to most significant"
  });
  
  let digitPlace = 1;
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    steps.push({
      array: [...workArray],
      active: [],
      swapped: false,
      sorted: [...sorted],
      message: `Sorting by ${digitPlace === 1 ? 'ones' : digitPlace === 10 ? 'tens' : digitPlace === 100 ? 'hundreds' : `${digitPlace}s`} digit (place value: ${exp})`
    });
    
    // Counting sort for current digit
    const output = new Array(n);
    const count = new Array(10).fill(0);
    
    // Store count of occurrences
    for (let i = 0; i < n; i++) {
      const digit = Math.floor(workArray[i] / exp) % 10;
      count[digit]++;
      steps.push({
        array: [...workArray],
        active: [i],
        swapped: false,
        sorted: [...sorted],
        message: `${workArray[i]} has digit ${digit} in ${digitPlace === 1 ? 'ones' : digitPlace === 10 ? 'tens' : digitPlace === 100 ? 'hundreds' : `${digitPlace}s`} place`
      });
    }
    
    // Change count[i] so that count[i] contains actual position
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }
    
    // Build output array
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(workArray[i] / exp) % 10;
      output[count[digit] - 1] = workArray[i];
      count[digit]--;
      steps.push({
        array: [...output.map(v => v || 0)],
        active: [count[digit]],
        swapped: true,
        sorted: [...sorted],
        message: `Placed ${workArray[i]} at position ${count[digit]} based on digit ${digit}`
      });
    }
    
    // Copy to workArray
    for (let i = 0; i < n; i++) {
      workArray[i] = output[i];
    }
    
    steps.push({
      array: [...workArray],
      active: [],
      swapped: false,
      sorted: [...sorted],
      message: `Completed sorting by ${digitPlace === 1 ? 'ones' : digitPlace === 10 ? 'tens' : digitPlace === 100 ? 'hundreds' : `${digitPlace}s`} digit`
    });
    
    digitPlace *= 10;
  }
  
  // Mark all as sorted
  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push({
    array: [...workArray],
    active: [],
    swapped: false,
    sorted: allSorted,
    message: "Radix Sort completed! Array is now fully sorted."
  });
  
  return steps;
}
