// Comprehensive Searching Algorithms Collection
// All algorithms return step-by-step visualization data

// Binary Search
export function binarySearchSteps(arr) {
    const steps = [];

    // Binary search requires sorted array
    const sortedArr = [...arr].sort((a, b) => a - b);
    const target = sortedArr[0]; // Use first element as target for demonstration

    steps.push({
        array: [...sortedArr],
        active: [],
        swapped: false,
        message: `Starting Binary Search for target: ${target}`
    });

    let left = 0;
    let right = sortedArr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        steps.push({
            array: [...sortedArr],
            active: [mid],
            swapped: false,
            message: `Searching in range [${left}, ${right}], mid = ${mid}`
        });

        if (sortedArr[mid] === target) {
            steps.push({
                array: [...sortedArr],
                active: [mid],
                swapped: true,
                targetIndex: mid,
                message: `Found target ${target} at position ${mid}!`
            });
            break;
        } else if (sortedArr[mid] < target) {
            steps.push({
                array: [...sortedArr],
                active: [mid],
                swapped: false,
                message: `${sortedArr[mid]} < ${target}, searching right half`
            });
            left = mid + 1;
        } else {
            steps.push({
                array: [...sortedArr],
                active: [mid],
                swapped: false,
                message: `${sortedArr[mid]} > ${target}, searching left half`
            });
            right = mid - 1;
        }
    }

    if (left > right) {
        steps.push({
            array: [...sortedArr],
            active: [],
            swapped: false,
            message: `Target ${target} not found in array`
        });
    }

    steps.push({
        array: [...sortedArr],
        active: [],
        swapped: false,
        message: "Binary Search completed"
    });

    return steps;
}

// Linear Search
export function linearSearchSteps(arr) {
    const steps = [];
    const target = arr[0]; // Use first element as target for demonstration

    steps.push({
        array: [...arr],
        active: [],
        swapped: false,
        message: `Starting Linear Search for target: ${target}`
    });

    for (let i = 0; i < arr.length; i++) {
        steps.push({
            array: [...arr],
            active: [i],
            swapped: false,
            message: `Checking element at position ${i}: ${arr[i]}`
        });

        if (arr[i] === target) {
            steps.push({
                array: [...arr],
                active: [i],
                swapped: true,
                targetIndex: i,
                message: `Found target ${target} at position ${i}!`
            });
            break;
        }
    }

    steps.push({
        array: [...arr],
        active: [],
        swapped: false,
        message: "Linear Search completed"
    });

    return steps;
}

// Jump Search
export function jumpSearchSteps(arr) {
    const steps = [];
    const sortedArr = [...arr].sort((a, b) => a - b);
    const target = sortedArr[0];
    const n = sortedArr.length;
    const step = Math.floor(Math.sqrt(n));

    steps.push({
        array: [...sortedArr],
        active: [],
        swapped: false,
        message: `Starting Jump Search for target: ${target}, step size: ${step}`
    });

    let prev = 0;
    let current = step;

    // Find the block where target might be
    while (current < n && sortedArr[current] < target) {
        steps.push({
            array: [...sortedArr],
            active: [prev, current],
            swapped: false,
            message: `Jumping from ${prev} to ${current}, value: ${sortedArr[current]}`
        });

        prev = current;
        current += step;
    }

    // Linear search within the block
    for (let i = prev; i <= Math.min(current, n - 1); i++) {
        steps.push({
            array: [...sortedArr],
            active: [i],
            swapped: false,
            message: `Linear search in block, checking position ${i}: ${sortedArr[i]}`
        });

        if (sortedArr[i] === target) {
            steps.push({
                array: [...sortedArr],
                active: [i],
                swapped: true,
                targetIndex: i,
                message: `Found target ${target} at position ${i}!`
            });
            break;
        }
    }

    steps.push({
        array: [...sortedArr],
        active: [],
        swapped: false,
        message: "Jump Search completed"
    });

    return steps;
}

// Interpolation Search
export function interpolationSearchSteps(arr) {
    const steps = [];
    const sortedArr = [...arr].sort((a, b) => a - b);
    const target = sortedArr[Math.floor(sortedArr.length / 2)]; // Use middle element as target

    steps.push({
        array: [...sortedArr],
        active: [],
        swapped: false,
        message: `Starting Interpolation Search for target: ${target}`
    });

    let low = 0;
    let high = sortedArr.length - 1;

    while (low <= high && target >= sortedArr[low] && target <= sortedArr[high]) {
        if (low === high) {
            if (sortedArr[low] === target) {
                steps.push({
                    array: [...sortedArr],
                    active: [low],
                    swapped: true,
                    targetIndex: low,
                    message: `Found target ${target} at position ${low}!`
                });
            }
            break;
        }

        // Calculate position using interpolation formula
        const pos = low + Math.floor(((target - sortedArr[low]) * (high - low)) / (sortedArr[high] - sortedArr[low]));

        steps.push({
            array: [...sortedArr],
            active: [pos],
            swapped: false,
            message: `Interpolated position: ${pos}, value: ${sortedArr[pos]}`
        });

        if (sortedArr[pos] === target) {
            steps.push({
                array: [...sortedArr],
                active: [pos],
                swapped: true,
                targetIndex: pos,
                message: `Found target ${target} at position ${pos}!`
            });
            break;
        } else if (sortedArr[pos] < target) {
            steps.push({
                array: [...sortedArr],
                active: [pos],
                swapped: false,
                message: `${sortedArr[pos]} < ${target}, searching right half`
            });
            low = pos + 1;
        } else {
            steps.push({
                array: [...sortedArr],
                active: [pos],
                swapped: false,
                message: `${sortedArr[pos]} > ${target}, searching left half`
            });
            high = pos - 1;
        }
    }

    steps.push({
        array: [...sortedArr],
        active: [],
        swapped: false,
        message: "Interpolation Search completed"
    });

    return steps;
}

// Exponential Search
export function exponentialSearchSteps(arr) {
    const steps = [];
    const sortedArr = [...arr].sort((a, b) => a - b);
    const target = sortedArr[Math.floor(sortedArr.length / 2)];
    const n = sortedArr.length;

    steps.push({
        array: [...sortedArr],
        active: [],
        swapped: false,
        message: `Starting Exponential Search for target: ${target}`
    });

    // If target is at first position
    if (sortedArr[0] === target) {
        steps.push({
            array: [...sortedArr],
            active: [0],
            swapped: true,
            targetIndex: 0,
            message: `Found target ${target} at position 0!`
        });
        return steps;
    }

    // Find range for binary search
    let i = 1;
    while (i < n && sortedArr[i] <= target) {
        steps.push({
            array: [...sortedArr],
            active: [i],
            swapped: false,
            message: `Checking position ${i}: ${sortedArr[i]}`
        });
        i *= 2;
    }

    // Binary search in the found range
    let left = i / 2;
    let right = Math.min(i, n - 1);

    steps.push({
        array: [...sortedArr],
        active: [left, right],
        swapped: false,
        message: `Binary search in range [${left}, ${right}]`
    });

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        steps.push({
            array: [...sortedArr],
            active: [mid],
            swapped: false,
            message: `Binary search mid = ${mid}, value: ${sortedArr[mid]}`
        });

        if (sortedArr[mid] === target) {
            steps.push({
                array: [...sortedArr],
                active: [mid],
                swapped: true,
                targetIndex: mid,
                message: `Found target ${target} at position ${mid}!`
            });
            break;
        } else if (sortedArr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    steps.push({
        array: [...sortedArr],
        active: [],
        swapped: false,
        message: "Exponential Search completed"
    });

    return steps;
}

// Helper functions to get all steps
export function getBinarySearchSteps(arr) {
    // Expect arr format: [sorted_array..., target]
    // Last element is the target to search for
    const steps = [];

    if (arr.length < 2) {
        steps.push({
            array: [],
            active: [],
            pointers: { low: -1, mid: -1, high: -1 },
            discarded: [],
            message: "Invalid input: need array and target"
        });
        return steps;
    }

    const target = arr[arr.length - 1];
    // Binary Search requires sorted array. We sort it just in case, though the user should ideally provide one.
    const sortedArr = arr.slice(0, -1).sort((a, b) => a - b);
    const discarded = [];

    steps.push({
        array: [...sortedArr],
        pointers: { low: 0, mid: -1, high: sortedArr.length - 1 },
        discarded: [],
        targetValue: target,
        message: `Starting Binary Search on sorted array for target: ${target}`
    });

    let left = 0;
    let right = sortedArr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        steps.push({
            array: [...sortedArr],
            pointers: { low: left, mid: mid, high: right },
            discarded: [...discarded],
            targetValue: target,
            message: `Comparing mid index ${mid} (value: ${sortedArr[mid]}) with target ${target}`
        });

        if (sortedArr[mid] === target) {
            steps.push({
                array: [...sortedArr],
                pointers: { low: left, mid: mid, high: right },
                discarded: [...discarded],
                targetIndex: mid,
                targetValue: target,
                found: true,
                message: `Match Found! ${target} is at index ${mid}.`
            });
            return steps;
        } else if (sortedArr[mid] < target) {
            // Discard left half including mid
            for (let i = left; i <= mid; i++) {
                if (!discarded.includes(i)) discarded.push(i);
            }
            left = mid + 1;
            steps.push({
                array: [...sortedArr],
                pointers: { low: left, mid: mid, high: right },
                discarded: [...discarded],
                targetValue: target,
                message: `${sortedArr[mid]} < ${target}. Discarding left half. Search range is now [${left}, ${right}].`
            });
        } else {
            // Discard right half including mid
            for (let i = mid; i <= right; i++) {
                if (!discarded.includes(i)) discarded.push(i);
            }
            right = mid - 1;
            steps.push({
                array: [...sortedArr],
                pointers: { low: left, mid: mid, high: right },
                discarded: [...discarded],
                targetValue: target,
                message: `${sortedArr[mid]} > ${target}. Discarding right half. Search range is now [${left}, ${right}].`
            });
        }
    }

    steps.push({
        array: [...sortedArr],
        pointers: { low: left, mid: -1, high: right },
        discarded: [...discarded],
        targetValue: target,
        found: false,
        message: `Target ${target} not found in the array.`
    });

    return steps;
}

export function getLinearSearchSteps(arr) {
    // Expect arr format: [array..., target]
    // Last element is the target to search for
    const steps = [];

    if (arr.length < 2) {
        steps.push({
            array: [],
            active: [],
            failed: [],
            targetValue: null,
            message: "Invalid input: need array and target"
        });
        return steps;
    }

    const target = arr[arr.length - 1];
    const searchArr = arr.slice(0, -1);
    const failed = [];

    steps.push({
        array: [...searchArr],
        active: [],
        failed: [],
        targetValue: target,
        message: `Starting Linear Search for target: ${target}`
    });

    for (let i = 0; i < searchArr.length; i++) {
        steps.push({
            array: [...searchArr],
            active: [i],
            failed: [...failed],
            targetValue: target,
            message: `Checking element ${searchArr[i]} at index ${i}`
        });

        if (searchArr[i] === target) {
            steps.push({
                array: [...searchArr],
                active: [i],
                failed: [...failed],
                targetIndex: i,
                targetValue: target,
                found: true,
                message: `Match Found! ${target} is at index ${i}!`
            });
            return steps;
        }

        failed.push(i);
        steps.push({
            array: [...searchArr],
            active: [i],
            failed: [...failed],
            targetValue: target,
            message: `${searchArr[i]} does not match ${target}. Moving to next index.`
        });
    }

    steps.push({
        array: [...searchArr],
        active: [],
        failed: [...failed],
        targetValue: target,
        found: false,
        message: `Target ${target} not found in the array.`
    });

    return steps;
}

export function getJumpSearchSteps(arr) {
    // Expect arr format: [sorted_array..., target]
    const steps = [];

    if (arr.length < 2) {
        steps.push({
            array: [],
            active: [],
            swapped: false,
            message: "Invalid input: need array and target"
        });
        return steps;
    }

    const target = arr[arr.length - 1];
    const sortedArr = arr.slice(0, -1).sort((a, b) => a - b);
    const n = sortedArr.length;
    const step = Math.floor(Math.sqrt(n));

    steps.push({
        array: [...sortedArr],
        active: [],
        swapped: false,
        message: `Starting Jump Search for target: ${target}, step size: ${step}`
    });

    let prev = 0;
    let current = step;

    while (current < n && sortedArr[Math.min(current, n - 1)] < target) {
        steps.push({
            array: [...sortedArr],
            active: [prev, Math.min(current, n - 1)],
            swapped: false,
            message: `Jumping from index ${prev} to ${current}`
        });
        prev = current;
        current += step;
    }

    for (let i = prev; i <= Math.min(current, n - 1); i++) {
        steps.push({
            array: [...sortedArr],
            active: [i],
            swapped: false,
            message: `Linear search from index ${prev}, checking ${sortedArr[i]}`
        });

        if (sortedArr[i] === target) {
            steps.push({
                array: [...sortedArr],
                active: [i],
                swapped: true,
                targetIndex: i,
                message: `Found target ${target} at index ${i}!`
            });
            return steps;
        }
    }

    steps.push({
        array: [...sortedArr],
        active: [],
        swapped: false,
        message: `Target ${target} not found in the array`
    });

    return steps;
}

export function getInterpolationSearchSteps(arr) {
    // Expect arr format: [sorted_array..., target]
    const steps = [];

    if (arr.length < 2) {
        steps.push({
            array: [],
            active: [],
            swapped: false,
            message: "Invalid input: need array and target"
        });
        return steps;
    }

    const target = arr[arr.length - 1];
    const sortedArr = arr.slice(0, -1).sort((a, b) => a - b);

    steps.push({
        array: [...sortedArr],
        active: [],
        swapped: false,
        message: `Starting Interpolation Search for target: ${target}`
    });

    let left = 0;
    let right = sortedArr.length - 1;

    while (left <= right && target >= sortedArr[left] && target <= sortedArr[right]) {
        if (left === right) {
            if (sortedArr[left] === target) {
                steps.push({
                    array: [...sortedArr],
                    active: [left],
                    swapped: true,
                    targetIndex: left,
                    message: `Found target ${target} at index ${left}!`
                });
            } else {
                steps.push({
                    array: [...sortedArr],
                    active: [],
                    swapped: false,
                    message: `Target ${target} not found in the array`
                });
            }
            return steps;
        }

        const pos = left + Math.floor(((target - sortedArr[left]) * (right - left)) / (sortedArr[right] - sortedArr[left]));

        steps.push({
            array: [...sortedArr],
            active: [pos],
            swapped: false,
            message: `Interpolated position: ${pos} (value: ${sortedArr[pos]})`
        });

        if (sortedArr[pos] === target) {
            steps.push({
                array: [...sortedArr],
                active: [pos],
                swapped: true,
                targetIndex: pos,
                message: `Found target ${target} at index ${pos}!`
            });
            return steps;
        } else if (sortedArr[pos] < target) {
            left = pos + 1;
            steps.push({
                array: [...sortedArr],
                active: [pos],
                swapped: false,
                message: `${sortedArr[pos]} < ${target}, search right side`
            });
        } else {
            right = pos - 1;
            steps.push({
                array: [...sortedArr],
                active: [pos],
                swapped: false,
                message: `${sortedArr[pos]} > ${target}, search left side`
            });
        }
    }

    steps.push({
        array: [...sortedArr],
        active: [],
        swapped: false,
        message: `Target ${target} not found in the array`
    });

    return steps;
}

export function getExponentialSearchSteps(arr) {
    // Expect arr format: [sorted_array..., target]
    const steps = [];

    if (arr.length < 2) {
        steps.push({
            array: [],
            active: [],
            swapped: false,
            message: "Invalid input: need array and target"
        });
        return steps;
    }

    const target = arr[arr.length - 1];
    const sortedArr = arr.slice(0, -1).sort((a, b) => a - b);
    const n = sortedArr.length;

    steps.push({
        array: [...sortedArr],
        active: [],
        swapped: false,
        message: `Starting Exponential Search for target: ${target}`
    });

    if (sortedArr[0] === target) {
        steps.push({
            array: [...sortedArr],
            active: [0],
            swapped: true,
            targetIndex: 0,
            message: `Found target ${target} at index 0!`
        });
        return steps;
    }

    let i = 1;
    while (i < n && sortedArr[i] <= target) {
        steps.push({
            array: [...sortedArr],
            active: [i],
            swapped: false,
            message: `Checking index ${i} (value: ${sortedArr[i]})`
        });
        i = i * 2;
    }

    const left = i / 2;
    const right = Math.min(i, n - 1);

    steps.push({
        array: [...sortedArr],
        active: [left, right],
        swapped: false,
        message: `Found range [${left}, ${right}], performing binary search`
    });

    for (let j = left; j <= right; j++) {
        steps.push({
            array: [...sortedArr],
            active: [j],
            swapped: false,
            message: `Linear search in range, checking ${sortedArr[j]}`
        });

        if (sortedArr[j] === target) {
            steps.push({
                array: [...sortedArr],
                active: [j],
                swapped: true,
                targetIndex: j,
                message: `Found target ${target} at index ${j}!`
            });
            return steps;
        }
    }

    steps.push({
        array: [...sortedArr],
        active: [],
        swapped: false,
        message: `Target ${target} not found in the array`
    });

    return steps;
}
