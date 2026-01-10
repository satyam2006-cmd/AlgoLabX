// DFS Traversal Step Generator
// Returns an array of steps for visualization
export function* dfsSteps(arr) {
  const n = arr.length;
  const visited = new Array(n).fill(false);
  const result = [];
  
  function* dfs(node) {
    visited[node] = true;
    result.push(node);
    
    yield { 
      array: [...arr], 
      active: [node], 
      swapped: false, 
      description: `Visiting node ${node}` 
    };
    
    // Visit neighbors (simplified graph structure)
    for (let neighbor = node + 1; neighbor < Math.min(node + 3, n); neighbor++) {
      if (!visited[neighbor]) {
        yield { 
          array: [...arr], 
          active: [node, neighbor], 
          swapped: true, 
          description: `Exploring neighbor ${neighbor} from node ${node}` 
        };
        yield* dfs(neighbor);
      }
    }
    
    // Create visualization state
    const visState = arr.map((val, i) => visited[i] ? val : -1);
    yield { 
      array: visState, 
      active: [], 
      swapped: false, 
      description: `Current path: [${result.join(', ')}]` 
    };
  }
  
  yield* dfs(0);
  
  yield { array: arr, active: [], swapped: false, description: `DFS Traversal completed: [${result.join(', ')}]` };
}

// Get all steps as an array
export function getDfsSteps(arr) {
  const generator = dfsSteps(arr);
  const steps = [];
  let step = generator.next();
  
  while (!step.done) {
    steps.push(step.value);
    step = generator.next();
  }
  
  return steps;
}
