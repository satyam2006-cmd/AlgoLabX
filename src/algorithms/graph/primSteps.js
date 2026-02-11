// Prim's Minimum Spanning Tree Algorithm Step Generator
// Returns an array of steps for interactive visualization
import _ from 'lodash';

export function primSteps(inputNodes) {
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

    // Extract all available edges (undirected)
    const edgeDict = {};
    nodes.forEach(node => {
        if (node.children) {
            node.children.forEach(childId => {
                const id1 = Math.min(node.id, childId);
                const id2 = Math.max(node.id, childId);
                const edgeKey = `${id1}-${id2}`;
                if (!edgeDict[edgeKey]) {
                    edgeDict[edgeKey] = {
                        from: node.id,
                        to: childId,
                        weight: (node.weights && node.weights[childId]) || 1
                    };
                }
            });
        }
    });
    allEdges = Object.values(edgeDict);

    const steps = [];
    const mstEdges = [];
    const visited = new Set();
    const unvisited = new Set(nodes.map(n => n.id));
    const distances = {}; // Min weight to connect to tree
    const parent = {};

    nodes.forEach(node => {
        distances[node.id] = Infinity;
        parent[node.id] = null;
    });

    if (nodes.length === 0) return [];
    const startId = nodes[0].id;
    distances[startId] = 0;

    // Initial Step
    steps.push({
        nodes,
        edges: allEdges,
        visited: Array.from(visited),
        mstEdges: [],
        current: null,
        message: `Initializing Prim's Algorithm from Node ${startId}.`,
        distances: { ...distances }
    });

    while (unvisited.size > 0) {
        // Pick node with min distance
        let currentId = null;
        let minD = Infinity;
        for (const id of unvisited) {
            if (distances[id] < minD) {
                minD = distances[id];
                currentId = id;
            }
        }

        if (currentId === null) break; // Remaining nodes unreachable

        unvisited.delete(currentId);
        visited.add(currentId);

        // If it has a parent, add edge to MST
        if (parent[currentId] !== null) {
            mstEdges.push({ from: parent[currentId], to: currentId, weight: distances[currentId] });
        }

        steps.push({
            nodes,
            edges: allEdges,
            visited: Array.from(visited),
            mstEdges: [...mstEdges],
            current: currentId,
            message: `Node ${currentId} added to MST${parent[currentId] !== null ? ` via edge from ${parent[currentId]}` : ''}.`,
            distances: { ...distances }
        });

        // Relax neighbors
        const neighbors = allEdges.filter(e => e.from === currentId || e.to === currentId);
        for (const edge of neighbors) {
            const neighborId = edge.from === currentId ? edge.to : edge.from;
            if (!unvisited.has(neighborId)) continue;

            const weight = edge.weight;

            steps.push({
                nodes,
                edges: allEdges,
                visited: Array.from(visited),
                mstEdges: [...mstEdges],
                current: currentId,
                activeEdge: edge,
                checking: neighborId,
                message: `Checking edge to ${neighborId} (weight: ${weight}). Current min to connect: ${distances[neighborId]}`,
                distances: { ...distances }
            });

            if (weight < distances[neighborId]) {
                distances[neighborId] = weight;
                parent[neighborId] = currentId;

                steps.push({
                    nodes,
                    edges: allEdges,
                    visited: Array.from(visited),
                    mstEdges: [...mstEdges],
                    current: currentId,
                    activeEdge: edge,
                    updating: neighborId,
                    message: `Update! New cheapest way to connect ${neighborId} is weight ${weight}.`,
                    distances: { ...distances }
                });
            }
        }
    }

    steps.push({
        nodes,
        edges: allEdges,
        visited: Array.from(visited),
        mstEdges: [...mstEdges],
        current: null,
        message: `Prim's MST complete. Total edges: ${mstEdges.length}`,
        distances: { ...distances }
    });

    return steps;
}
