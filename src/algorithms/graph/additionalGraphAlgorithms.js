// Additional Graph Algorithms
// Bellman-Ford, Floyd-Warshall, Prim's MST, Kruskal's MST, Topological Sort, Cycle Detection

// Helper to create nodes and edges from default graph
function createGraphData() {
  const nodes = [
    { id: 0, value: 'A', label: 'A', x: 0, y: 0 },
    { id: 1, value: 'B', label: 'B', x: 0, y: 0 },
    { id: 2, value: 'C', label: 'C', x: 0, y: 0 },
    { id: 3, value: 'D', label: 'D', x: 0, y: 0 },
    { id: 4, value: 'E', label: 'E', x: 0, y: 0 },
    { id: 5, value: 'F', label: 'F', x: 0, y: 0 }
  ];
  
  const edges = [
    { from: 0, to: 1, weight: 4, label: '4' },
    { from: 0, to: 2, weight: 2, label: '2' },
    { from: 1, to: 2, weight: 1, label: '1' },
    { from: 1, to: 3, weight: 5, label: '5' },
    { from: 2, to: 3, weight: 8, label: '8' },
    { from: 2, to: 4, weight: 10, label: '10' },
    { from: 3, to: 4, weight: 2, label: '2' },
    { from: 3, to: 5, weight: 6, label: '6' },
    { from: 4, to: 5, weight: 3, label: '3' }
  ];
  
  return { nodes, edges };
}

// Bellman-Ford Algorithm - Single source shortest path (handles negative weights)
export function getBellmanFordSteps() {
  const { nodes, edges } = createGraphData();
  const steps = [];
  const n = nodes.length;
  
  // Initialize distances
  const distances = Array(n).fill(Infinity);
  distances[0] = 0;
  const visited = Array(n).fill(false);
  visited[0] = true;

  steps.push({
    nodes: [...nodes],
    edges: [...edges],
    visited: [...visited],
    current: 0,
    active: [0],
    message: `Starting Bellman-Ford from node 0. Initialize distances: [${distances.map(d => d === Infinity ? '∞' : d).join(', ')}]`
  });

  // Relax all edges |V| - 1 times
  for (let i = 0; i < n - 1; i++) {
    steps.push({
      nodes: [...nodes],
      edges: [...edges],
      visited: distances.map(d => d !== Infinity),
      current: -1,
      active: [],
      message: `Iteration ${i + 1} of ${n - 1}: Relaxing all edges`
    });

    let updated = false;
    for (const edge of edges) {
      const { from, to, weight } = edge;

      steps.push({
        nodes: [...nodes],
        edges: [...edges],
        visited: distances.map(d => d !== Infinity),
        current: from,
        active: [from, to],
        message: `Checking edge ${from} → ${to} (weight: ${weight}). Dist[${from}]=${distances[from] === Infinity ? '∞' : distances[from]}`
      });

      if (distances[from] !== Infinity && distances[from] + weight < distances[to]) {
        distances[to] = distances[from] + weight;
        updated = true;

        steps.push({
          nodes: [...nodes],
          edges: [...edges],
          visited: distances.map(d => d !== Infinity),
          current: to,
          active: [to],
          message: `Updated distance to node ${to}: ${distances[from]} + ${weight} = ${distances[to]}`
        });
      }
    }

    if (!updated) {
      steps.push({
        nodes: [...nodes],
        edges: [...edges],
        visited: distances.map(d => d !== Infinity),
        current: -1,
        active: [],
        message: `No updates in iteration ${i + 1}, converged early!`
      });
      break;
    }
  }

  steps.push({
    nodes: [...nodes],
    edges: [...edges],
    visited: Array(n).fill(true),
    current: -1,
    active: [],
    message: `✅ Bellman-Ford complete! Distances: [${distances.map(d => d === Infinity ? '∞' : d).join(', ')}]`
  });

  return steps;
}

// Floyd-Warshall Algorithm - All pairs shortest path
export function getFloydWarshallSteps() {
  const { nodes, edges } = createGraphData();
  const steps = [];
  const n = nodes.length;

  // Create adjacency matrix
  const dist = Array(n).fill(null).map(() => Array(n).fill(Infinity));
  for (let i = 0; i < n; i++) dist[i][i] = 0;

  // Fill in edge weights
  edges.forEach(({ from, to, weight }) => {
    dist[from][to] = weight;
  });

  steps.push({
    nodes: [...nodes],
    edges: [...edges],
    visited: Array(n).fill(false),
    current: -1,
    active: [],
    message: "Starting Floyd-Warshall. Initialized distance matrix from edges."
  });

  // Floyd-Warshall main loop
  for (let k = 0; k < n; k++) {
    const visited = Array(n).fill(false);
    visited[k] = true;

    steps.push({
      nodes: [...nodes],
      edges: [...edges],
      visited: [...visited],
      current: k,
      active: [k],
      message: `Using node ${k} as intermediate vertex`
    });

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
          const newDist = dist[i][k] + dist[k][j];
          
          if (newDist < dist[i][j]) {
            const visitedNodes = Array(n).fill(false);
            visitedNodes[i] = true;
            visitedNodes[k] = true;
            visitedNodes[j] = true;

            steps.push({
              nodes: [...nodes],
              edges: [...edges],
              visited: visitedNodes,
              current: k,
              active: [i, k, j],
              message: `Path ${i}→${k}→${j}: ${dist[i][k]} + ${dist[k][j]} = ${newDist} < ${dist[i][j] === Infinity ? '∞' : dist[i][j]}`
            });

            dist[i][j] = newDist;
          }
        }
      }
    }
  }

  steps.push({
    nodes: [...nodes],
    edges: [...edges],
    visited: Array(n).fill(true),
    current: -1,
    active: [],
    message: "✅ Floyd-Warshall complete! All pairs shortest paths computed."
  });

  return steps;
}

// Prim's Algorithm - Minimum Spanning Tree
export function getPrimMSTSteps() {
  const { nodes, edges } = createGraphData();
  const steps = [];
  const n = nodes.length;

  // Build adjacency list (undirected)
  const adjList = Array(n).fill(null).map(() => []);
  edges.forEach(({ from, to, weight }) => {
    adjList[from].push({ node: to, weight });
    adjList[to].push({ node: from, weight });
  });

  const inMST = Array(n).fill(false);
  const key = Array(n).fill(Infinity);
  const mstEdges = [];

  key[0] = 0;

  steps.push({
    nodes: [...nodes],
    edges: [...edges],
    visited: [...inMST],
    current: 0,
    active: [0],
    message: "Starting Prim's MST from node 0"
  });

  for (let count = 0; count < n; count++) {
    // Find minimum key vertex not in MST
    let minKey = Infinity;
    let u = -1;

    for (let v = 0; v < n; v++) {
      if (!inMST[v] && key[v] < minKey) {
        minKey = key[v];
        u = v;
      }
    }

    if (u === -1) break;

    inMST[u] = true;

    steps.push({
      nodes: [...nodes],
      edges: [...edges],
      visited: [...inMST],
      current: u,
      active: [u],
      shortestPath: mstEdges.flatMap(e => [e.from, e.to]),
      message: `Added node ${u} to MST (key: ${key[u]})`
    });

    // Update keys of adjacent vertices
    for (const { node: v, weight } of adjList[u]) {
      if (!inMST[v] && weight < key[v]) {
        key[v] = weight;

        steps.push({
          nodes: [...nodes],
          edges: [...edges],
          visited: [...inMST],
          current: u,
          active: [u, v],
          message: `Updated key[${v}] = ${weight} (edge from ${u})`
        });
      }
    }
  }

  steps.push({
    nodes: [...nodes],
    edges: [...edges],
    visited: Array(n).fill(true),
    current: -1,
    active: [],
    message: `✅ Prim's MST complete!`
  });

  return steps;
}

// Kruskal's Algorithm - Minimum Spanning Tree
export function getKruskalMSTSteps() {
  const { nodes, edges } = createGraphData();
  const steps = [];
  const n = nodes.length;

  // Union-Find data structure
  const parent = Array(n).fill(null).map((_, i) => i);
  const rank = Array(n).fill(0);

  const find = (x) => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };

  const union = (x, y) => {
    const rootX = find(x);
    const rootY = find(y);
    if (rootX !== rootY) {
      if (rank[rootX] < rank[rootY]) parent[rootX] = rootY;
      else if (rank[rootX] > rank[rootY]) parent[rootY] = rootX;
      else { parent[rootY] = rootX; rank[rootX]++; }
      return true;
    }
    return false;
  };

  // Sort edges by weight
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  const mstNodes = new Set();

  steps.push({
    nodes: [...nodes],
    edges: [...edges],
    visited: Array(n).fill(false),
    current: -1,
    active: [],
    message: `Starting Kruskal's MST. Edges sorted: ${sortedEdges.map(e => `${e.from}-${e.to}(${e.weight})`).join(', ')}`
  });

  let edgeCount = 0;
  for (const edge of sortedEdges) {
    const { from, to, weight } = edge;

    const visited = Array(n).fill(false);
    mstNodes.forEach(node => visited[node] = true);

    steps.push({
      nodes: [...nodes],
      edges: [...edges],
      visited: [...visited],
      current: from,
      active: [from, to],
      message: `Considering edge ${from}-${to} (weight: ${weight})`
    });

    if (find(from) !== find(to)) {
      union(from, to);
      mstNodes.add(from);
      mstNodes.add(to);
      edgeCount++;

      const visited = Array(n).fill(false);
      mstNodes.forEach(node => visited[node] = true);

      steps.push({
        nodes: [...nodes],
        edges: [...edges],
        visited: [...visited],
        current: -1,
        active: [from, to],
        message: `✓ Added edge ${from}-${to} to MST (no cycle)`
      });

      if (edgeCount === n - 1) break;
    } else {
      steps.push({
        nodes: [...nodes],
        edges: [...edges],
        visited: Array(n).fill(false),
        current: -1,
        active: [from, to],
        message: `✗ Rejected edge ${from}-${to} (would create cycle)`
      });
    }
  }

  steps.push({
    nodes: [...nodes],
    edges: [...edges],
    visited: Array(n).fill(true),
    current: -1,
    active: [],
    message: `✅ Kruskal's MST complete!`
  });

  return steps;
}

// Topological Sort using DFS
export function getTopologicalSortSteps() {
  // DAG for topological sort
  const nodes = [
    { id: 0, value: 'A', label: 'A', x: 0, y: 0 },
    { id: 1, value: 'B', label: 'B', x: 0, y: 0 },
    { id: 2, value: 'C', label: 'C', x: 0, y: 0 },
    { id: 3, value: 'D', label: 'D', x: 0, y: 0 },
    { id: 4, value: 'E', label: 'E', x: 0, y: 0 },
    { id: 5, value: 'F', label: 'F', x: 0, y: 0 }
  ];
  
  const edges = [
    { from: 0, to: 1, weight: 1, label: '' },
    { from: 0, to: 2, weight: 1, label: '' },
    { from: 1, to: 3, weight: 1, label: '' },
    { from: 2, to: 3, weight: 1, label: '' },
    { from: 3, to: 4, weight: 1, label: '' },
    { from: 4, to: 5, weight: 1, label: '' }
  ];

  const steps = [];
  const n = nodes.length;

  // Build adjacency list
  const adjList = Array(n).fill(null).map(() => []);
  edges.forEach(({ from, to }) => {
    adjList[from].push(to);
  });

  const visited = Array(n).fill(false);
  const stack = [];
  const result = [];

  steps.push({
    nodes: [...nodes],
    edges: [...edges],
    visited: [...visited],
    current: -1,
    active: [],
    message: "Starting Topological Sort using DFS"
  });

  const dfs = (node) => {
    visited[node] = true;
    
    steps.push({
      nodes: [...nodes],
      edges: [...edges],
      visited: [...visited],
      current: node,
      active: [node],
      message: `Visiting node ${node}`
    });

    for (const neighbor of adjList[node]) {
      if (!visited[neighbor]) {
        steps.push({
          nodes: [...nodes],
          edges: [...edges],
          visited: [...visited],
          current: node,
          active: [node, neighbor],
          message: `Going to unvisited neighbor ${neighbor}`
        });
        dfs(neighbor);
      }
    }

    stack.push(node);
    steps.push({
      nodes: [...nodes],
      edges: [...edges],
      visited: [...visited],
      current: node,
      active: [node],
      message: `Finished ${node}, pushed to stack. Stack: [${stack.join(', ')}]`
    });
  };

  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      dfs(i);
    }
  }

  // Reverse stack to get topological order
  while (stack.length > 0) {
    result.push(stack.pop());
  }

  steps.push({
    nodes: [...nodes],
    edges: [...edges],
    visited: Array(n).fill(true),
    current: -1,
    active: [],
    message: `✅ Topological Sort complete! Order: ${result.join(' → ')}`
  });

  return steps;
}

// Detect Cycle in Directed Graph using DFS
export function getCycleDetectionSteps() {
  const { nodes, edges } = createGraphData();
  const steps = [];
  const n = nodes.length;

  // Build adjacency list
  const adjList = Array(n).fill(null).map(() => []);
  edges.forEach(({ from, to }) => {
    adjList[from].push(to);
  });

  const WHITE = 0; // Not visited
  const GRAY = 1;  // Being processed (in current DFS path)
  const BLACK = 2; // Completely processed

  const color = Array(n).fill(WHITE);
  let hasCycle = false;

  steps.push({
    nodes: [...nodes],
    edges: [...edges],
    visited: Array(n).fill(false),
    current: -1,
    active: [],
    message: "Starting Cycle Detection using DFS coloring"
  });

  const dfs = (node) => {
    color[node] = GRAY;

    steps.push({
      nodes: [...nodes],
      edges: [...edges],
      visited: color.map(c => c !== WHITE),
      current: node,
      active: [node],
      message: `Processing ${node} (marked GRAY - in current path)`
    });

    for (const neighbor of adjList[node]) {
      if (color[neighbor] === GRAY) {
        hasCycle = true;
        steps.push({
          nodes: [...nodes],
          edges: [...edges],
          visited: color.map(c => c !== WHITE),
          current: node,
          active: [node, neighbor],
          message: `🔴 CYCLE DETECTED! Edge ${node} → ${neighbor} is a back edge`
        });
        return true;
      }

      if (color[neighbor] === WHITE) {
        steps.push({
          nodes: [...nodes],
          edges: [...edges],
          visited: color.map(c => c !== WHITE),
          current: node,
          active: [node, neighbor],
          message: `Checking unvisited neighbor ${neighbor}`
        });

        if (dfs(neighbor)) return true;
      }
    }

    color[node] = BLACK;
    steps.push({
      nodes: [...nodes],
      edges: [...edges],
      visited: color.map(c => c !== WHITE),
      current: node,
      active: [node],
      message: `Finished ${node} (marked BLACK - completely processed)`
    });

    return false;
  };

  for (let i = 0; i < n; i++) {
    if (color[i] === WHITE) {
      if (dfs(i)) break;
    }
  }

  if (!hasCycle) {
    steps.push({
      nodes: [...nodes],
      edges: [...edges],
      visited: Array(n).fill(true),
      current: -1,
      active: [],
      message: "✅ No cycle detected! Graph is acyclic (DAG)."
    });
  }

  return steps;
}
