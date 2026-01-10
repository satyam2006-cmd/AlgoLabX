// BFS Traversal Step Generator
// Returns an array of steps for visualization
export function* bfsSteps(arr) {
  const n = arr.length;
  const visited = new Array(n).fill(false);
  const queue = [];
  const result = [];
  
  // Start BFS from node 0
  queue.push(0);
  visited[0] = true;
  
  yield { 
    array: [...arr], 
    active: [0], 
    swapped: false, 
    description: "Starting BFS from node 0" 
  };
  
  while (queue.length > 0) {
    const current = queue.shift();
    result.push(current);
    
    yield { 
      array: [...arr], 
      active: [current], 
      swapped: false, 
      description: `Visiting node ${current}` 
    };
    
    // Visit neighbors (simplified graph structure)
    for (let neighbor = current + 1; neighbor < Math.min(current + 3, n); neighbor++) {
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        queue.push(neighbor);
        
        yield { 
          array: [...arr], 
          active: [current, neighbor], 
          swapped: true, 
          description: `Adding neighbor ${neighbor} to queue` 
        };
      }
    }
    
    // Create visualization state
    const visState = arr.map((val, i) => visited[i] ? val : -1);
    yield { 
      array: visState, 
      active: [], 
      swapped: false, 
      description: `Visited nodes: [${result.join(', ')}]` 
    };
  }
  
  yield { array: arr, active: [], swapped: false, description: `BFS Traversal completed: [${result.join(', ')}]` };
}

// Get all steps as an array
export function getBfsSteps(arr) {
  const generator = bfsSteps(arr);
  const steps = [];
  let step = generator.next();
  
  while (!step.done) {
    steps.push(step.value);
    step = generator.next();
  }
  
  return steps;
}
