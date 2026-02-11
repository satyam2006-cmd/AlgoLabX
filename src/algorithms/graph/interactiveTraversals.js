// BFS Step Generator for Interactive Graph
export function* bfsInteractiveSteps(nodes, startNodeId = 0) {
    const n = nodes.length;
    if (n === 0 || typeof nodes[0] !== 'object') return;

    const adj = {};
    nodes.forEach(node => {
        adj[node.id] = node.children;
    });

    const startId = nodes.some(n => n.id === startNodeId) ? startNodeId : nodes[0].id;
    const visited = new Set();
    const inQueue = new Set();
    const queue = [startId];
    inQueue.add(startId);
    const traversalOrder = [];

    yield {
        nodes,
        visited: Array.from(visited),
        inQueue: Array.from(inQueue),
        queue: [...queue],
        message: `Starting BFS from Node ${startId}.`
    };

    while (queue.length > 0) {
        const u = queue.shift();
        inQueue.delete(u);
        visited.add(u);
        traversalOrder.push(u);

        yield {
            nodes,
            current: u,
            visited: Array.from(visited),
            inQueue: Array.from(inQueue),
            queue: [...queue],
            message: `Visiting Node ${u}. Checking neighbors...`
        };

        for (const v of adj[u]) {
            if (!visited.has(v) && !inQueue.has(v)) {
                inQueue.add(v);
                queue.push(v);
                yield {
                    nodes,
                    current: u,
                    activeEdge: { from: u, to: v },
                    visited: Array.from(visited),
                    inQueue: Array.from(inQueue),
                    queue: [...queue],
                    message: `Adding unvisited neighbor ${v} to queue.`
                };
            }
        }
    }

    yield {
        nodes,
        visited: Array.from(visited),
        traversalOrder: [...traversalOrder],
        message: `BFS complete. Order: [${traversalOrder.join(', ')}]`
    };
}

export const getBfsInteractiveSteps = (nodes) => {
    const generator = bfsInteractiveSteps(nodes);
    const steps = [];
    let step = generator.next();
    while (!step.done) {
        steps.push(step.value);
        step = generator.next();
    }
    return steps;
};

// DFS Step Generator for Interactive Graph
export function* dfsInteractiveSteps(nodes, startNodeId = 0) {
    const n = nodes.length;
    if (n === 0 || typeof nodes[0] !== 'object') return;

    const adj = {};
    nodes.forEach(node => {
        adj[node.id] = node.children;
    });

    const startId = nodes.some(n => n.id === startNodeId) ? startNodeId : nodes[0].id;
    const visited = new Set();
    const traversalOrder = [];

    yield {
        nodes,
        visited: Array.from(visited),
        message: `Starting DFS from Node ${startId}.`
    };

    const dfs = function* (u) {
        visited.add(u);
        traversalOrder.push(u);

        yield {
            nodes,
            current: u,
            visited: Array.from(visited),
            message: `Visiting Node ${u}.`
        };

        const neighbors = adj[u] || [];
        for (const v of neighbors) {
            if (!visited.has(v)) {
                yield {
                    nodes,
                    current: u,
                    activeEdge: { from: u, to: v },
                    visited: Array.from(visited),
                    message: `Moving to unvisited neighbor ${v}.`
                };
                yield* dfs(v);
                yield {
                    nodes,
                    current: u,
                    visited: Array.from(visited),
                    message: `Backtracking to Node ${u}.`
                };
            }
        }
    };

    yield* dfs(startId);

    yield {
        nodes,
        visited: Array.from(visited),
        traversalOrder: [...traversalOrder],
        message: `DFS complete. Order: [${traversalOrder.join(', ')}]`
    };
}

export const getDfsInteractiveSteps = (nodes) => {
    const generator = dfsInteractiveSteps(nodes);
    const steps = [];
    let step = generator.next();
    while (!step.done) {
        steps.push(step.value);
        step = generator.next();
    }
    return steps;
};
