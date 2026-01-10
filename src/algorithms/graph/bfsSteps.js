// BFS Traversal Step Generator
// Returns an array of steps with proper graph visualization data
export function bfsSteps(input) {
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
  
  const visited = new Array(n).fill(false);
  const queue = [];
  const traversalOrder = [];
  
  // Initial state
  steps.push({
    nodes: [...nodes],
    edges: [...edges],
    visited: [...visited],
    current: -1,
    active: [],
    message: "Starting BFS Traversal from node 0"
  });
  
  // Start BFS from node 0
  queue.push(0);
  visited[0] = true;
  
  steps.push({
    nodes: [...nodes],
    edges: [...edges],
    visited: [...visited],
    current: 0,
    active: [0],
    message: "Added node 0 to queue"
  });
  
  while (queue.length > 0) {
    const current = queue.shift();
    traversalOrder.push(current);
    
    steps.push({
      nodes: [...nodes],
      edges: [...edges],
      visited: [...visited],
      current: current,
      active: [current],
      message: `Visiting node ${current}`
    });
    
    // Visit all neighbors
    const neighbors = edges.filter(e => e.from === current).map(e => e.to);
    for (const neighbor of neighbors) {
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        queue.push(neighbor);
        
        steps.push({
          nodes: [...nodes],
          edges: [...edges],
          visited: [...visited],
          current: current,
          active: [current, neighbor],
          message: `Discovered neighbor ${neighbor}, added to queue`
        });
      }
    }
    
    steps.push({
      nodes: [...nodes],
      edges: [...edges],
      visited: [...visited],
      current: current,
      active: [current],
      message: `Finished exploring node ${current}. Traversal order: [${traversalOrder.join(', ')}]`
    });
  }
  
  // Final state
  steps.push({
    nodes: [...nodes],
    edges: [...edges],
    visited: [...visited],
    current: -1,
    active: [],
    message: `BFS completed. Traversal order: [${traversalOrder.join(', ')}]`
  });
  
  return steps;
}
