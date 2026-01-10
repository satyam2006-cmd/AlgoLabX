// Dijkstra's Algorithm Step Generator
// Returns an array of steps with proper graph visualization data
export function dijkstraSteps(input) {
  const arr = [...input];
  const steps = [];
  const n = arr.length;
  
  // Create graph with nodes and edges
  const nodes = arr.map((value, index) => ({
    id: index,
    value: value,
    label: `Node ${index}`,
    x: 0, // Will be calculated by visualizer
    y: 0  // Will be calculated by visualizer
  }));
  
  const edges = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < Math.min(i + 3, n); j++) {
      edges.push({
        from: i,
        to: j,
        weight: Math.abs(arr[j] - arr[i]),
        label: `${Math.abs(arr[j] - arr[i])}`
      });
    }
  }
  
  const distances = new Array(n).fill(Infinity);
  const visited = new Array(n).fill(false);
  const previous = new Array(n).fill(-1);
  
  // Initial state
  steps.push({
    nodes: [...nodes],
    edges: [...edges],
    visited: [...visited],
    current: -1,
    active: [],
    distances: [...distances],
    shortestPath: [],
    message: "Starting Dijkstra's Algorithm from node 0"
  });
  
  // Start from node 0
  distances[0] = 0;
  
  steps.push({
    nodes: [...nodes],
    edges: [...edges],
    visited: [...visited],
    current: 0,
    active: [0],
    distances: [...distances],
    message: "Set distance to source node 0 as 0"
  });
  
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
    
    steps.push({
      nodes: [...nodes],
      edges: [...edges],
      visited: [...visited],
      current: current,
      active: [current],
      distances: [...distances],
      shortestPath: [],
      message: `Selected node ${current} with minimum distance ${minDist}`
    });
    
    // Update distances to neighbors
    const neighbors = edges.filter(e => e.from === current);
    for (const edge of neighbors) {
      const neighbor = edge.to;
      const weight = edge.weight;
      
      if (!visited[neighbor]) {
        const newDist = distances[current] + weight;
        
        if (newDist < distances[neighbor]) {
          steps.push({
            nodes: [...nodes],
            edges: [...edges],
            visited: [...visited],
            current: current,
            active: [current, neighbor],
            distances: [...distances],
            message: `Found shorter path to node ${neighbor}: ${newDist} < ${distances[neighbor]}`
          });
          
          distances[neighbor] = newDist;
          previous[neighbor] = current;
          
          steps.push({
            nodes: [...nodes],
            edges: [...edges],
            visited: [...visited],
            current: current,
            active: [current, neighbor],
            distances: [...distances],
            message: `Updated distance to node ${neighbor} to ${newDist}`
          });
        }
      }
    }
    
    steps.push({
      nodes: [...nodes],
      edges: [...edges],
      visited: [...visited],
      current: current,
      active: [],
      distances: [...distances],
      message: `Iteration ${iteration + 1} complete`
    });
  }
  
  // Final state
  const finalDistances = distances.map(d => d === Infinity ? '∞' : d);
  
  // Reconstruct shortest paths from node 0
  const shortestPaths = [];
  for (let i = 1; i < n; i++) {
    if (distances[i] < Infinity) {
      const path = [];
      let current = i;
      while (current !== -1) {
        path.unshift(current);
        current = previous[current];
      }
      shortestPaths.push(path);
    }
  }
  
  steps.push({
    nodes: [...nodes],
    edges: [...edges],
    visited: [...visited],
    current: -1,
    active: [],
    distances: [...distances],
    shortestPath: shortestPaths[0] || [],
    message: `Dijkstra's completed. Final distances: [${finalDistances.join(', ')}]`
  });
  
  return steps;
}
