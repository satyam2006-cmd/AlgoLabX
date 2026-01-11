// Additional Sorting Algorithms
// Shell Sort, Bucket Sort, Cocktail Shaker Sort, Comb Sort, Gnome Sort, Odd-Even Sort

// Shell Sort - Improved insertion sort with gap sequence
export function getShellSortSteps(inputArr) {
  const arr = [...inputArr];
  const steps = [];
  const n = arr.length;

  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Starting Shell Sort - an optimized insertion sort using gap sequences"
  });

  // Handle empty array explicitly for consistency with other sorting algorithms
  if (n === 0) {
    steps.push({
      array: [...arr],
      active: [],
      swapped: false,
      message: "Shell Sort completed! Array is now sorted."
    });
    return steps;
  }
  // Start with a big gap, then reduce
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    steps.push({
      array: [...arr],
      active: [],
      swapped: false,
      message: `Using gap size: ${gap}`
    });

    // Perform gapped insertion sort
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;

      steps.push({
        array: [...arr],
        active: [i],
        swapped: false,
        message: `Inserting element ${temp} at index ${i} with gap ${gap}`
      });

      while (j >= gap && arr[j - gap] > temp) {
        steps.push({
          array: [...arr],
          active: [j, j - gap],
          swapped: false,
          message: `Comparing ${arr[j - gap]} > ${temp}`
        });

        arr[j] = arr[j - gap];
        
        steps.push({
          array: [...arr],
          active: [j, j - gap],
          swapped: true,
          message: `Shifted ${arr[j]} from index ${j - gap} to ${j}`
        });

        j -= gap;
      }

      arr[j] = temp;
      if (j !== i) {
        steps.push({
          array: [...arr],
          active: [j],
          swapped: true,
          message: `Placed ${temp} at index ${j}`
        });
      }
    }
  }

  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Shell Sort completed! Array is now sorted."
  });

  return steps;
}

// Bucket Sort - Distributes elements into buckets then sorts each bucket
export function getBucketSortSteps(inputArr) {
  const arr = [...inputArr];
  const steps = [];
  const n = arr.length;

  if (n <= 0) return [{ array: arr, active: [], swapped: false, message: "Empty array" }];

  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Starting Bucket Sort - distributes elements into buckets"
  });

  // Find min and max
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const bucketCount = Math.ceil(Math.sqrt(n));
  const bucketSize = Math.ceil((max - min + 1) / bucketCount);

  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: `Creating ${bucketCount} buckets, range: ${min}-${max}, bucket size: ${bucketSize}`
  });

  // Create buckets
  const buckets = Array.from({ length: bucketCount }, () => []);

  // Distribute elements into buckets
  for (let i = 0; i < n; i++) {
    const bucketIdx = Math.min(Math.floor((arr[i] - min) / bucketSize), bucketCount - 1);
    buckets[bucketIdx].push(arr[i]);
    
    steps.push({
      array: [...arr],
      active: [i],
      swapped: false,
      message: `Placing ${arr[i]} into bucket ${bucketIdx}`
    });
  }

  // Sort each bucket and collect
  let index = 0;
  for (let i = 0; i < bucketCount; i++) {
    if (buckets[i].length > 0) {
      steps.push({
        array: [...arr],
        active: [],
        swapped: false,
        message: `Sorting bucket ${i}: [${buckets[i].join(', ')}]`
      });

      // Sort bucket using insertion sort
      buckets[i].sort((a, b) => a - b);

      steps.push({
        array: [...arr],
        active: [],
        swapped: false,
        message: `Bucket ${i} sorted: [${buckets[i].join(', ')}]`
      });

      // Place back into array
      for (const val of buckets[i]) {
        arr[index] = val;
        steps.push({
          array: [...arr],
          active: [index],
          swapped: true,
          message: `Placed ${val} at index ${index} from bucket ${i}`
        });
        index++;
      }
    }
  }

  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Bucket Sort completed! Array is now sorted."
  });

  return steps;
}

// Cocktail Shaker Sort (Bidirectional Bubble Sort)
export function getCocktailSortSteps(inputArr) {
  const arr = [...inputArr];
  const steps = [];
  let swapped = true;
  let start = 0;
  let end = arr.length - 1;

  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Starting Cocktail Shaker Sort - bidirectional bubble sort"
  });

  while (swapped) {
    swapped = false;

    // Forward pass (left to right)
    steps.push({
      array: [...arr],
      active: [],
      swapped: false,
      message: `Forward pass: scanning from index ${start} to ${end}`
    });

    for (let i = start; i < end; i++) {
      steps.push({
        array: [...arr],
        active: [i, i + 1],
        swapped: false,
        message: `Comparing ${arr[i]} and ${arr[i + 1]}`
      });

      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
        steps.push({
          array: [...arr],
          active: [i, i + 1],
          swapped: true,
          message: `Swapped ${arr[i + 1]} and ${arr[i]}`
        });
      }
    }

    if (!swapped) break;

    swapped = false;
    end--;

    // Backward pass (right to left)
    steps.push({
      array: [...arr],
      active: [],
      swapped: false,
      message: `Backward pass: scanning from index ${end} to ${start}`
    });

    for (let i = end - 1; i >= start; i--) {
      steps.push({
        array: [...arr],
        active: [i, i + 1],
        swapped: false,
        message: `Comparing ${arr[i]} and ${arr[i + 1]}`
      });

      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
        steps.push({
          array: [...arr],
          active: [i, i + 1],
          swapped: true,
          message: `Swapped ${arr[i + 1]} and ${arr[i]}`
        });
      }
    }

    start++;
  }

  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Cocktail Shaker Sort completed! Array is now sorted."
  });

  return steps;
}

// Comb Sort - Improved bubble sort with shrinking gap
export function getCombSortSteps(inputArr) {
  const arr = [...inputArr];
  const steps = [];
  const n = arr.length;
  const shrinkFactor = 1.3;
  let gap = n;
  let sorted = false;

  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Starting Comb Sort - bubble sort with shrinking gap"
  });

  while (!sorted) {
    // Update gap
    gap = Math.floor(gap / shrinkFactor);
    if (gap <= 1) {
      gap = 1;
      sorted = true;
    }

    steps.push({
      array: [...arr],
      active: [],
      swapped: false,
      message: `Using gap: ${gap}`
    });

    // Compare elements with current gap
    for (let i = 0; i + gap < n; i++) {
      steps.push({
        array: [...arr],
        active: [i, i + gap],
        swapped: false,
        message: `Comparing ${arr[i]} and ${arr[i + gap]} (gap: ${gap})`
      });

      if (arr[i] > arr[i + gap]) {
        [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
        sorted = false;
        steps.push({
          array: [...arr],
          active: [i, i + gap],
          swapped: true,
          message: `Swapped ${arr[i + gap]} and ${arr[i]}`
        });
      }
    }
  }

  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Comb Sort completed! Array is now sorted."
  });

  return steps;
}

// Gnome Sort - Simple sorting similar to insertion sort
export function getGnomeSortSteps(inputArr) {
  const arr = [...inputArr];
  const steps = [];
  let index = 0;

  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Starting Gnome Sort - a simple sorting algorithm"
  });

  while (index < arr.length) {
    if (index === 0) {
      index++;
    }

    steps.push({
      array: [...arr],
      active: [index - 1, index],
      swapped: false,
      message: `At index ${index}, comparing ${arr[index - 1]} and ${arr[index]}`
    });

    if (arr[index] >= arr[index - 1]) {
      index++;
    } else {
      [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
      steps.push({
        array: [...arr],
        active: [index - 1, index],
        swapped: true,
        message: `Swapped ${arr[index]} and ${arr[index - 1]}, moving back`
      });
      index--;
    }
  }

  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Gnome Sort completed! Array is now sorted."
  });

  return steps;
}

// Odd-Even Sort (Brick Sort) - Parallel sorting algorithm
export function getOddEvenSortSteps(inputArr) {
  const arr = [...inputArr];
  const steps = [];
  const n = arr.length;
  let sorted = false;

  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Starting Odd-Even Sort - parallel-friendly sorting"
  });

  while (!sorted) {
    sorted = true;

    // Odd phase
    steps.push({
      array: [...arr],
      active: [],
      swapped: false,
      message: "Odd phase: comparing pairs at odd indices"
    });

    for (let i = 1; i < n - 1; i += 2) {
      steps.push({
        array: [...arr],
        active: [i, i + 1],
        swapped: false,
        message: `Comparing ${arr[i]} and ${arr[i + 1]}`
      });

      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        sorted = false;
        steps.push({
          array: [...arr],
          active: [i, i + 1],
          swapped: true,
          message: `Swapped ${arr[i + 1]} and ${arr[i]}`
        });
      }
    }

    // Even phase
    steps.push({
      array: [...arr],
      active: [],
      swapped: false,
      message: "Even phase: comparing pairs at even indices"
    });

    for (let i = 0; i < n - 1; i += 2) {
      steps.push({
        array: [...arr],
        active: [i, i + 1],
        swapped: false,
        message: `Comparing ${arr[i]} and ${arr[i + 1]}`
      });

      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        sorted = false;
        steps.push({
          array: [...arr],
          active: [i, i + 1],
          swapped: true,
          message: `Swapped ${arr[i + 1]} and ${arr[i]}`
        });
      }
    }
  }

  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    message: "Odd-Even Sort completed! Array is now sorted."
  });

  return steps;
}
