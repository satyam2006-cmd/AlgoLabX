// Additional Search Algorithms
// Ternary Search, Fibonacci Search, Sentinel Linear Search, Two-Pointer Search, Sublist Search

// Ternary Search - Divide array into 3 parts
export function getTernarySearchSteps(inputArr) {
  // Last element is the target
  const target = inputArr[inputArr.length - 1];
  const arr = [...inputArr.slice(0, -1)].sort((a, b) => a - b);
  const steps = [];

  steps.push({
    array: [...arr],
    active: [],
    target: target,
    found: false,
    message: `Starting Ternary Search for target: ${target}`
  });

  steps.push({
    array: [...arr],
    active: [],
    target: target,
    found: false,
    message: "Array must be sorted for Ternary Search"
  });

  let left = 0;
  let right = arr.length - 1;
  let found = false;

  while (left <= right) {
    const mid1 = left + Math.floor((right - left) / 3);
    const mid2 = right - Math.floor((right - left) / 3);

    steps.push({
      array: [...arr],
      active: [mid1, mid2],
      left: left,
      right: right,
      target: target,
      found: false,
      message: `Dividing into 3 parts: left=${left}, mid1=${mid1}, mid2=${mid2}, right=${right}`
    });

    if (arr[mid1] === target) {
      found = true;
      steps.push({
        array: [...arr],
        active: [mid1],
        target: target,
        found: true,
        foundIndex: mid1,
        message: `Found ${target} at index ${mid1} (first midpoint)!`
      });
      break;
    }

    if (arr[mid2] === target) {
      found = true;
      steps.push({
        array: [...arr],
        active: [mid2],
        target: target,
        found: true,
        foundIndex: mid2,
        message: `Found ${target} at index ${mid2} (second midpoint)!`
      });
      break;
    }

    if (target < arr[mid1]) {
      steps.push({
        array: [...arr],
        active: [mid1],
        target: target,
        found: false,
        message: `${target} < ${arr[mid1]}, searching left third [${left}...${mid1 - 1}]`
      });
      right = mid1 - 1;
    } else if (target > arr[mid2]) {
      steps.push({
        array: [...arr],
        active: [mid2],
        target: target,
        found: false,
        message: `${target} > ${arr[mid2]}, searching right third [${mid2 + 1}...${right}]`
      });
      left = mid2 + 1;
    } else {
      steps.push({
        array: [...arr],
        active: [mid1, mid2],
        target: target,
        found: false,
        message: `${arr[mid1]} < ${target} < ${arr[mid2]}, searching middle third [${mid1 + 1}...${mid2 - 1}]`
      });
      left = mid1 + 1;
      right = mid2 - 1;
    }
  }

  if (!found) {
    steps.push({
      array: [...arr],
      active: [],
      target: target,
      found: false,
      message: `Target ${target} not found in the array`
    });
  }

  return steps;
}

// Fibonacci Search - Uses Fibonacci numbers to divide array
export function getFibonacciSearchSteps(inputArr) {
  // Last element is the target
  const target = inputArr[inputArr.length - 1];
  const arr = [...inputArr.slice(0, -1)].sort((a, b) => a - b);
  const steps = [];
  const n = arr.length;

  steps.push({
    array: [...arr],
    active: [],
    target: target,
    found: false,
    message: `Starting Fibonacci Search for target: ${target}`
  });

  // Find smallest Fibonacci number >= n
  let fibM2 = 0; // (m-2)th Fibonacci
  let fibM1 = 1; // (m-1)th Fibonacci
  let fibM = fibM2 + fibM1; // mth Fibonacci

  while (fibM < n) {
    fibM2 = fibM1;
    fibM1 = fibM;
    fibM = fibM2 + fibM1;
  }

  steps.push({
    array: [...arr],
    active: [],
    target: target,
    found: false,
    message: `Fibonacci numbers: F(m-2)=${fibM2}, F(m-1)=${fibM1}, F(m)=${fibM}`
  });

  let offset = -1;
  let found = false;

  while (fibM > 1) {
    const i = Math.min(offset + fibM2, n - 1);

    steps.push({
      array: [...arr],
      active: [i],
      target: target,
      found: false,
      message: `Checking index ${i}: arr[${i}] = ${arr[i]}`
    });

    if (arr[i] < target) {
      steps.push({
        array: [...arr],
        active: [i],
        target: target,
        found: false,
        message: `${arr[i]} < ${target}, moving to right portion`
      });
      fibM = fibM1;
      fibM1 = fibM2;
      fibM2 = fibM - fibM1;
      offset = i;
    } else if (arr[i] > target) {
      steps.push({
        array: [...arr],
        active: [i],
        target: target,
        found: false,
        message: `${arr[i]} > ${target}, moving to left portion`
      });
      fibM = fibM2;
      fibM1 = fibM1 - fibM2;
      fibM2 = fibM - fibM1;
    } else {
      found = true;
      steps.push({
        array: [...arr],
        active: [i],
        target: target,
        found: true,
        foundIndex: i,
        message: `Found ${target} at index ${i}!`
      });
      break;
    }
  }

  if (!found && fibM1 === 1 && offset + 1 < n && arr[offset + 1] === target) {
    steps.push({
      array: [...arr],
      active: [offset + 1],
      target: target,
      found: true,
      foundIndex: offset + 1,
      message: `Found ${target} at index ${offset + 1}!`
    });
  } else if (!found) {
    steps.push({
      array: [...arr],
      active: [],
      target: target,
      found: false,
      message: `Target ${target} not found in the array`
    });
  }

  return steps;
}

// Sentinel Linear Search - Optimized linear search
export function getSentinelSearchSteps(inputArr) {
  // Last element is the target
  const target = inputArr[inputArr.length - 1];
  const arr = [...inputArr.slice(0, -1)];
  const steps = [];
  const n = arr.length;

  steps.push({
    array: [...arr],
    active: [],
    target: target,
    found: false,
    message: `Starting Sentinel Linear Search for target: ${target}`
  });

  // Save the last element and place sentinel
  const last = arr[n - 1];
  arr[n - 1] = target;

  steps.push({
    array: [...arr],
    active: [n - 1],
    target: target,
    found: false,
    message: `Placed sentinel ${target} at the end of array`
  });

  let i = 0;
  while (arr[i] !== target) {
    steps.push({
      array: [...arr],
      active: [i],
      target: target,
      found: false,
      message: `Checking index ${i}: ${arr[i]} != ${target}`
    });
    i++;
  }

  // Restore the last element
  arr[n - 1] = last;

  if (i < n - 1 || last === target) {
    steps.push({
      array: [...arr],
      active: [i < n - 1 ? i : n - 1],
      target: target,
      found: true,
      foundIndex: i < n - 1 ? i : n - 1,
      message: `Found ${target} at index ${i < n - 1 ? i : n - 1}!`
    });
  } else {
    steps.push({
      array: [...arr],
      active: [],
      target: target,
      found: false,
      message: `Target ${target} not found in the array`
    });
  }

  return steps;
}

// Two-Pointer Search (for finding pair with given sum)
export function getTwoPointerSearchSteps(inputArr) {
  // Last element is the target sum
  const targetSum = inputArr[inputArr.length - 1];
  const arr = [...inputArr.slice(0, -1)].sort((a, b) => a - b);
  const steps = [];

  steps.push({
    array: [...arr],
    pointers: { left: 0, right: arr.length - 1 },
    currentSum: null,
    targetValue: targetSum,
    found: false,
    message: `Starting Two-Pointer Search for pair with sum: ${targetSum}`
  });

  let left = 0;
  let right = arr.length - 1;
  let found = false;

  while (left < right) {
    const currentSum = arr[left] + arr[right];

    steps.push({
      array: [...arr],
      pointers: { left, right },
      currentSum,
      targetValue: targetSum,
      found: false,
      message: `Checking: ${arr[left]} + ${arr[right]} = ${currentSum}`
    });

    if (currentSum === targetSum) {
      found = true;
      steps.push({
        array: [...arr],
        pointers: { left, right },
        currentSum,
        targetValue: targetSum,
        found: true,
        message: `Match Found! Pair (${arr[left]}, ${arr[right]}) sums to ${targetSum}.`
      });
      break;
    } else if (currentSum < targetSum) {
      steps.push({
        array: [...arr],
        pointers: { left, right },
        currentSum,
        targetValue: targetSum,
        found: false,
        action: 'move_left',
        message: `${currentSum} < ${targetSum}. Increasing left pointer to increase sum.`
      });
      left++;
    } else {
      steps.push({
        array: [...arr],
        pointers: { left, right },
        currentSum,
        targetValue: targetSum,
        found: false,
        action: 'move_right',
        message: `${currentSum} > ${targetSum}. Decreasing right pointer to reduce sum.`
      });
      right--;
    }
  }

  if (!found) {
    steps.push({
      array: [...arr],
      pointers: { left: -1, right: -1 },
      currentSum: null,
      targetValue: targetSum,
      found: false,
      message: `No pair found with sum ${targetSum}.`
    });
  }

  return steps;
}

// Sublist Search - Search for a sublist in a list
export function getSublistSearchSteps(inputArr) {
  // Assume last 3 elements form the pattern to search
  const patternSize = Math.min(3, Math.floor(inputArr.length / 2));
  const pattern = inputArr.slice(-patternSize);
  const arr = inputArr.slice(0, -patternSize);
  const steps = [];

  steps.push({
    array: [...arr],
    active: [],
    pattern: pattern,
    found: false,
    message: `Starting Sublist Search for pattern: [${pattern.join(', ')}]`
  });

  let found = false;

  for (let i = 0; i <= arr.length - pattern.length; i++) {
    steps.push({
      array: [...arr],
      active: Array.from({ length: pattern.length }, (_, k) => i + k),
      pattern: pattern,
      found: false,
      message: `Checking starting position ${i}`
    });

    let match = true;
    for (let j = 0; j < pattern.length; j++) {
      if (arr[i + j] !== pattern[j]) {
        steps.push({
          array: [...arr],
          active: [i + j],
          pattern: pattern,
          found: false,
          message: `Mismatch at index ${i + j}: ${arr[i + j]} != ${pattern[j]}`
        });
        match = false;
        break;
      }
    }

    if (match) {
      found = true;
      steps.push({
        array: [...arr],
        active: Array.from({ length: pattern.length }, (_, k) => i + k),
        pattern: pattern,
        found: true,
        foundIndex: i,
        message: `Pattern found starting at index ${i}!`
      });
      break;
    }
  }

  if (!found) {
    steps.push({
      array: [...arr],
      active: [],
      pattern: pattern,
      found: false,
      message: "Pattern not found in the array"
    });
  }

  return steps;
}
