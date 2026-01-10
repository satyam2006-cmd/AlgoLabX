// Dijkstra's Algorithm Step Generator
// Returns an array of steps for visualization
export function* dijkstraSteps(arr) {
  const n = arr.length;
  const distances = new Array(n).fill(Infinity);
  const visited = new Array(n).fill(false);
  const previous = new Array(n).fill(-1);
  
  // Start from node 0
  distances[0] = 0;
  
  yield { 
    array: [...distances], 
    active: [0], 
    swapped: false, 
    description: "Starting Dijkstra's algorithm from node 0" 
  };
  
  for (let iteration = 0; iteration < n; iteration++) {
    // Find unvisited node with minimum distance
    let minDist = Infinity;
    let current = -1;
    
    for (let i = 0; i < n; i++) {
      if (!visited[i] && distances[i] < minDist) {
        minDist = distances[i];
        current = i;
      }
    }
    
    if (current === -1) break;
    
    visited[current] = true;
    
    yield { 
      array: [...distances], 
      active: [current], 
      swapped: false, 
      description: `Selected node ${current} with distance ${minDist}` 
    };
    
    // Update distances to neighbors
    for (let neighbor = current + 1; neighbor < Math.min(current + 3, n); neighbor++) {
      const weight = Math.abs(arr[neighbor] - arr[current]);
      if (!visited[neighbor] && distances[current] + weight < distances[neighbor]) {
        distances[neighbor] = distances[current] + weight;
        previous[neighbor] = current;
        
        yield { 
          array: [...distances], 
          active: [current, neighbor], 
          swapped: true, 
          description: `Updated distance to node ${neighbor}: ${distances[neighbor]}` 
        };
      }
    }
    
    yield { 
      array: [...distances], 
      active: [], 
      swapped: false, 
      description: `Iteration ${iteration + 1} complete` 
    };
  }
  
  yield { array: distances, active: [], swapped: false, description: `Dijkstra's algorithm completed. Final distances: [${distances.map(d => d === Infinity ? '∞' : d).join(', ')}]` };
}

// Get all steps as an array
export function getDijkstraSteps(arr) {
  const generator = dijkstraSteps(arr);
  const steps = [];
  let step = generator.next();
  
  while (!step.done) {
    steps.push(step.value);
    step = generator.next();
  }
  
  return steps;
}