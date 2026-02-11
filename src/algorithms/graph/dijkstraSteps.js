// Dijkstra's Algorithm Step Generator
// Returns an array of steps with proper graph visualization data
export function dijkstraSteps(inputNodes) {
  let nodes = inputNodes;
  let edges = [];

  // Fallback for simple input or empty graph
  if (!nodes || nodes.length === 0 || typeof nodes[0] !== 'object') {
    const nodeCount = 6;
    nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * 2 * Math.PI;
      const radius = 150;
      nodes.push({
        id: i,
        label: String.fromCharCode(65 + i),
        x: 250 + radius * Math.cos(angle),
        y: 200 + radius * Math.sin(angle),
        children: [(i + 1) % nodeCount],
        weights: { [(i + 1) % nodeCount]: Math.floor(Math.random() * 10) + 1 }
      });
    }
  }

  // Extract edges from nodes
  nodes.forEach(node => {
    if (node.children) {
      node.children.forEach(childId => {
        edges.push({
          from: node.id,
          to: childId,
          weight: (node.weights && node.weights[childId]) || 1
        });
      });
    }
  });

  const steps = [];
  const distances = {};
  const previous = {};
  const visited = new Set();
  const unvisited = new Set();

  nodes.forEach(node => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
    unvisited.add(node.id);
  });

  if (nodes.length === 0) return [];
  const sourceId = nodes[0].id; // Use first node as source
  distances[sourceId] = 0;

  // Initial Step
  steps.push({
    nodes,
    edges,
    distances: { ...distances },
    previous: { ...previous },
    visited: Array.from(visited),
    current: null,
    activeEdge: null,
    message: `Initializing Dijkstra from Node ${sourceId}: dist=0, others=∞`,
    shortestPath: []
  });

  while (unvisited.size > 0) {
    let currentId = null;
    let minDistance = Infinity;

    for (const nodeId of unvisited) {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        currentId = nodeId;
      }
    }

    if (currentId === null) break;

    unvisited.delete(currentId);

    steps.push({
      nodes,
      edges,
      distances: { ...distances },
      previous: { ...previous },
      visited: Array.from(visited),
      current: currentId,
      activeEdge: null,
      message: `Selected Node ${currentId} (dist: ${minDistance}) as current work node.`,
      shortestPath: []
    });

    // Relax neighbors
    const neighbors = edges.filter(e => e.from === currentId);

    for (const edge of neighbors) {
      const neighborId = edge.to;

      if (!unvisited.has(neighborId)) continue;

      const weight = edge.weight;
      const alt = distances[currentId] + weight;

      steps.push({
        nodes,
        edges,
        distances: { ...distances },
        previous: { ...previous },
        visited: Array.from(visited),
        current: currentId,
        activeEdge: edge,
        checking: neighborId,
        message: `Checking edge ${currentId} -> ${neighborId}: ${distances[currentId]} + ${weight} = ${alt}`,
        shortestPath: [] // Path isn't "best" yet while checking
      });

      if (alt < distances[neighborId]) {
        distances[neighborId] = alt;
        previous[neighborId] = currentId;

        const path = [];
        let temp = neighborId;
        while (temp !== null) {
          path.unshift(temp);
          temp = previous[temp];
        }

        steps.push({
          nodes,
          edges,
          distances: { ...distances },
          previous: { ...previous },
          visited: Array.from(visited),
          current: currentId,
          activeEdge: edge,
          updating: neighborId,
          message: `Update! New shortest distance to ${neighborId} is ${alt}`,
          shortestPath: path
        });
      }
    }

    visited.add(currentId);

    // Calculate current path for visualization
    const currentPath = [];
    let temp = currentId;
    while (temp !== null) {
      currentPath.unshift(temp);
      temp = previous[temp];
    }

    steps.push({
      nodes,
      edges,
      distances: { ...distances },
      previous: { ...previous },
      visited: Array.from(visited),
      current: currentId,
      message: `Node ${currentId} finalized.`,
      shortestPath: currentPath
    });
  }

  // Find furthest reachable node for demo path
  let targetId = nodes[0].id;
  let maxD = -1;
  Object.entries(distances).forEach(([id, d]) => {
    if (d !== Infinity && d > maxD) {
      maxD = d;
      targetId = parseInt(id);
    }
  });

  const finalPathNodes = [];
  let curr = targetId;
  if (distances[targetId] !== Infinity) {
    while (curr !== null) {
      finalPathNodes.unshift(curr);
      curr = previous[curr];
    }
  }

  steps.push({
    nodes,
    edges,
    distances: { ...distances },
    previous: { ...previous },
    visited: Array.from(visited),
    current: null,
    message: `Dijkstra complete. Highlighted shortest path to Node ${targetId}.`,
    shortestPath: finalPathNodes
  });

  return steps;
}
