// Bellman-Ford Shortest Path Algorithm Step Generator
// Returns an array of steps for interactive visualization
import _ from 'lodash';

export function bellmanFordSteps(inputNodes) {
    let nodes = inputNodes;
    let allEdges = [];

    // Fallback for demo graph
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

    // Extract edges
    nodes.forEach(node => {
        if (node.children) {
            node.children.forEach(childId => {
                allEdges.push({
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
    const V = nodes.length;

    nodes.forEach(node => {
        distances[node.id] = Infinity;
        previous[node.id] = null;
    });

    if (V === 0) return [];
    const sourceId = nodes[0].id;
    distances[sourceId] = 0;

    // Initial Step
    steps.push({
        nodes,
        edges: allEdges,
        distances: { ...distances },
        previous: { ...previous },
        current: null,
        message: `Initializing Bellman-Ford from Node ${sourceId}. Preparing for ${V - 1} iterations of edge relaxation.`,
        shortestPath: []
    });

    // Relax edges V-1 times
    for (let i = 1; i < V; i++) {
        steps.push({
            nodes,
            edges: allEdges,
            distances: { ...distances },
            previous: { ...previous },
            current: null,
            message: `Starting Iteration ${i} of ${V - 1}.`,
            shortestPath: []
        });

        for (const edge of allEdges) {
            const u = edge.from;
            const v = edge.to;
            const weight = edge.weight;

            steps.push({
                nodes,
                edges: allEdges,
                distances: { ...distances },
                previous: { ...previous },
                current: u,
                activeEdge: edge,
                checking: v,
                message: `Pass ${i}: Checking edge ${u} -> ${v} (weight: ${weight})`,
                shortestPath: []
            });

            if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
                distances[v] = distances[u] + weight;
                previous[v] = u;

                // For Bellman-Ford visualization, we show the path to 'v' as it updates
                const path = [];
                let temp = v;
                while (temp !== null) {
                    path.unshift(temp);
                    temp = previous[temp];
                }

                steps.push({
                    nodes,
                    edges: allEdges,
                    distances: { ...distances },
                    previous: { ...previous },
                    current: u,
                    activeEdge: edge,
                    updating: v,
                    message: `Iteration ${i}: Relaxed edge ${u} -> ${v}. New distance to ${v} is ${distances[v]}`,
                    shortestPath: path
                });
            }
        }
    }

    // Check for negative cycles
    for (const edge of allEdges) {
        const u = edge.from;
        const v = edge.to;
        const weight = edge.weight;
        if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
            steps.push({
                nodes,
                edges: allEdges,
                distances: { ...distances },
                current: u,
                activeEdge: edge,
                error: true,
                message: "Negative weight cycle detected! Distances are not stable.",
                shortestPath: []
            });
            return steps;
        }
    }

    // Find a representative target node (furthest reachable) for final visualization
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
        edges: allEdges,
        distances: { ...distances },
        previous: { ...previous },
        current: null,
        message: `Bellman-Ford complete. Highlighted shortest path to Node ${targetId}.`,
        shortestPath: finalPathNodes
    });

    return steps;
}
