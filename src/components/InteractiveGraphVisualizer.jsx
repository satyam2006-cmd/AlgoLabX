import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

const InteractiveGraphVisualizer = ({
    currentStep,
    onGraphChange,
    initialNodes = [],
    graphType = 'undirected'
}) => {
    const containerRef = useRef(null);
    const [nodes, setNodes] = useState(initialNodes);
    const [dragEdge, setDragEdge] = useState(null);
    const [editingEdge, setEditingEdge] = useState(null);
    const [weightInput, setWeightInput] = useState("");
    const [localFinalPath, setLocalFinalPath] = useState(null);
    const [copyStatus, setCopyStatus] = useState(false);

    // Reset copy status after 2 seconds
    useEffect(() => {
        if (copyStatus) {
            const timer = setTimeout(() => setCopyStatus(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copyStatus]);

    // Reset local path when steps change
    useEffect(() => {
        setLocalFinalPath(null);
    }, [currentStep]);
    const [currentId, setCurrentId] = useState(() => {
        if (initialNodes.length === 0) return 1;
        return Math.max(...initialNodes.map(n => n.id)) + 1;
    });

    // Sync state with initialNodes when not running algorithm
    useEffect(() => {
        if (!currentStep && initialNodes !== nodes) {
            setNodes(initialNodes);
            if (initialNodes.length > 0) {
                setCurrentId(Math.max(...initialNodes.map(n => n.id)) + 1);
            } else {
                setCurrentId(1);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialNodes, currentStep]);

    // Sync state with props when currentStep changes (during algorithm run)
    useEffect(() => {
        if (currentStep && currentStep.nodes) {
            setNodes(currentStep.nodes);
        }
    }, [currentStep]);

    const handleGraphUpdate = useCallback((newNodes) => {
        setNodes(newNodes);
        if (onGraphChange) onGraphChange(newNodes);
    }, [onGraphChange]);

    const addNode = useCallback((x, y) => {
        if (currentStep) return;

        // Perceptual check to avoid adding nodes exactly on top of each other
        const tooClose = nodes.some(n => Math.hypot(n.x - x, n.y - y) < 40);
        if (tooClose) return;

        const newNode = {
            id: currentId,
            x,
            y,
            size: 15,
            children: [],
            parents: [],
            selected: false,
            visited: false,
            current: false,
            visitedFrom: null,
            visitIndex: null,
            articulationPoint: false,
            lowLink: null,
            group: null,
            childVisitCount: 0,
            weights: {} // id -> weight
        };

        const newNodes = [...nodes, newNode];
        setCurrentId(currentId + 1);
        handleGraphUpdate(newNodes);
    }, [nodes, currentId, currentStep, handleGraphUpdate]);

    const updateNodePosition = useCallback((id, x, y) => {
        const newNodes = nodes.map(n => n.id === id ? { ...n, x, y } : n);
        handleGraphUpdate(newNodes);
    }, [nodes, handleGraphUpdate]);

    const addEdge = useCallback((fromId, toId) => {
        if (fromId === toId) return;

        const fromNode = nodes.find(n => n.id === fromId);
        if (!fromNode || fromNode.children.includes(toId)) return;

        const newNodes = nodes.map(n => {
            if (n.id === fromId) {
                const children = [...n.children, toId];
                const parents = graphType === 'undirected' ? [...n.parents, toId] : n.parents;
                const weights = { ...n.weights, [toId]: 1 };
                return { ...n, children, parents, weights, selected: false };
            }
            if (n.id === toId) {
                const parents = [...n.parents, fromId];
                const children = graphType === 'undirected' ? [...n.children, fromId] : n.children;
                const weights = graphType === 'undirected' ? { ...n.weights, [fromId]: 1 } : n.weights;
                return { ...n, parents, children, weights };
            }
            return n;
        });

        handleGraphUpdate(newNodes);
    }, [nodes, graphType, handleGraphUpdate]);

    const updateEdgeWeight = useCallback((fromId, toId, weight) => {
        const newNodes = nodes.map(n => {
            if (n.id === fromId) {
                return { ...n, weights: { ...n.weights, [toId]: weight } };
            }
            if (graphType === 'undirected' && n.id === toId) {
                return { ...n, weights: { ...n.weights, [fromId]: weight } };
            }
            return n;
        });
        handleGraphUpdate(newNodes);
    }, [nodes, graphType, handleGraphUpdate]);

    const deleteNode = useCallback((id) => {
        if (currentStep) return;
        const newNodes = nodes
            .filter(n => n.id !== id)
            .map(n => ({
                ...n,
                children: n.children.filter(childId => childId !== id),
                parents: n.parents.filter(parentId => parentId !== id),
                weights: _.omit(n.weights, [id.toString()])
            }));
        handleGraphUpdate(newNodes);
    }, [nodes, currentStep, handleGraphUpdate]);

    useEffect(() => {
        if (!containerRef.current) return;

        const svg = d3.select(containerRef.current);
        svg.selectAll("*").remove();

        // markers for arrows
        const defs = svg.append('defs');

        // Normal arrow
        defs.append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '0 0 12 8')
            .attr('refX', 22)
            .attr('refY', 4)
            .attr('markerWidth', 10)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M 0,0 V 8 L12,4 Z')
            .attr('fill', '#4b5563');

        // Dragging arrow
        defs.append('marker')
            .attr('id', 'arrowhead-dragging')
            .attr('viewBox', '0 0 12 8')
            .attr('refX', 10)
            .attr('refY', 4)
            .attr('markerWidth', 10)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M 0,0 V 8 L12,4 Z')
            .attr('fill', '#3b82f6');

        // Traversed arrow
        defs.append('marker')
            .attr('id', 'arrowhead-traversed')
            .attr('viewBox', '0 0 12 8')
            .attr('refX', 22)
            .attr('refY', 4)
            .attr('markerWidth', 10)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M 0,0 V 8 L12,4 Z')
            .attr('fill', '#3b82f6');

        // Shortest Path arrow
        defs.append('marker')
            .attr('id', 'arrowhead-shortest')
            .attr('viewBox', '0 0 12 8')
            .attr('refX', 22)
            .attr('refY', 4)
            .attr('markerWidth', 10)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M 0,0 V 8 L12,4 Z')
            .attr('fill', '#f59e0b');

        // Add node click listener to the SVG itself
        svg.on('click', (event) => {
            if (event.target !== containerRef.current) return; // Only if clicking the background
            setEditingEdge(null);
            const [x, y] = d3.pointer(event);
            addNode(x, y);
        });

        // Draw Components (Polygons for SCCs/Bipartite components if provided)
        if (currentStep && currentStep.sccs) {
            currentStep.sccs.forEach(component => {
                if (component.length === 1) {
                    const node = nodes.find(n => n.id === component[0]);
                    if (node) {
                        svg.append('circle')
                            .attr('cx', node.x)
                            .attr('cy', node.y)
                            .attr('r', 25)
                            .attr('fill', '#3b82f6')
                            .attr('opacity', 0.2);
                    }
                } else {
                    const points = component.map(id => {
                        const node = nodes.find(n => n.id === id);
                        return node ? `${node.x},${node.y}` : null;
                    }).filter(p => p).join(' ');

                    svg.append('polygon')
                        .attr('points', points)
                        .attr('fill', '#3b82f6')
                        .attr('opacity', 0.15)
                        .attr('stroke', '#3b82f6')
                        .attr('stroke-width', 30)
                        .attr('stroke-linejoin', 'round');
                }
            });
        }

        // Draw Edges
        nodes.forEach(node => {
            node.children.forEach(childId => {
                const child = nodes.find(n => n.id === childId);
                if (!child) return;

                // For undirected graphs, only draw each edge once (from lower ID to higher ID)
                if (graphType === 'undirected' && node.id > child.id) return;

                const isTraversed = currentStep && (
                    (currentStep.activeEdge && (
                        (currentStep.activeEdge.from === node.id && currentStep.activeEdge.to === child.id) ||
                        (currentStep.activeEdge.from === child.id && currentStep.activeEdge.to === node.id)
                    )) ||
                    (child.visitedFrom === node.id)
                );

                const isShortestPath = (localFinalPath || (currentStep && currentStep.shortestPath)) &&
                    (localFinalPath || currentStep.shortestPath).some((id, idx) =>
                        (id === node.id && (localFinalPath || currentStep.shortestPath)[idx + 1] === child.id) ||
                        (id === child.id && (localFinalPath || currentStep.shortestPath)[idx + 1] === node.id)
                    );

                const isMST = currentStep && currentStep.mstEdges &&
                    currentStep.mstEdges.some(e =>
                        (e.from === node.id && e.to === child.id) ||
                        (e.from === child.id && e.to === node.id)
                    );

                const markerId = (isShortestPath || isMST) ? 'arrowhead-shortest' : (isTraversed ? 'arrowhead-traversed' : 'arrowhead');

                // Hit area for edge clicking
                svg.append('line')
                    .attr('x1', node.x)
                    .attr('y1', node.y)
                    .attr('x2', child.x)
                    .attr('y2', child.y)
                    .attr('stroke', 'transparent')
                    .attr('stroke-width', 20)
                    .attr('class', 'cursor-pointer')
                    .on('click', (event) => {
                        event.stopPropagation();
                        if (currentStep) return;
                        const [mx, my] = d3.pointer(event, containerRef.current);
                        const weight = node.weights[child.id] || "1";
                        setEditingEdge({ from: node.id, to: child.id, x: mx, y: my });
                        setWeightInput(weight.toString());
                    });

                svg.append('line')
                    .attr('x1', node.x)
                    .attr('y1', node.y)
                    .attr('x2', child.x)
                    .attr('y2', child.y)
                    .attr('stroke', (isShortestPath || isMST) ? '#f59e0b' : (isTraversed ? '#3b82f6' : '#4b5563'))
                    .attr('stroke-width', (isShortestPath || isMST) ? 5 : (isTraversed ? 3 : 2))
                    .attr('marker-end', graphType === 'directed' ? `url(#${markerId})` : null)
                    .attr('opacity', (currentStep && child.visited && child.visitedFrom !== node.id && !isShortestPath && !isMST) ? 0.4 : 1)
                    .attr('pointer-events', 'none');

                // Weight Label
                const weight = node.weights[child.id];
                if (weight !== undefined) {
                    const midX = (node.x + child.x) / 2;
                    const midY = (node.y + child.y) / 2;

                    // Offset label slightly so it's not directly on the line
                    const dx = child.x - node.x;
                    const dy = child.y - node.y;
                    const len = Math.sqrt(dx * dx + dy * dy) || 1;
                    const ox = -dy / len * 15;
                    const oy = dx / len * 15;

                    svg.append('text')
                        .attr('x', midX + ox)
                        .attr('y', midY + oy)
                        .attr('text-anchor', 'middle')
                        .attr('fill', isShortestPath ? '#f59e0b' : (isTraversed ? '#3b82f6' : '#9ca3af'))
                        .attr('font-size', '12px')
                        .attr('font-weight', 'bold')
                        .attr('pointer-events', 'none')
                        .text(weight);
                }
            });
        });

        // Draw Nodes
        const nodeGroups = svg.selectAll('.node-group')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class', 'node-group cursor-pointer');

        nodeGroups.append('circle')
            .attr('id', d => `node-${d.id}`)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', 15)
            .attr('fill', d => {
                if (currentStep) {
                    if (d.id === currentStep.current) return '#3b82f6';
                    if (currentStep.visited && currentStep.visited.includes(d.id)) {
                        // For MST, visited nodes are part of the tree
                        if (currentStep.mstEdges) return '#f59e0b';
                        return '#4b5563';
                    }
                    if (currentStep.articulationPoints && currentStep.articulationPoints.includes(d.id)) return '#ef4444';
                    if (currentStep.colors && currentStep.colors[d.id] === 0) return '#10b981';
                    if (currentStep.colors && currentStep.colors[d.id] === 1) return '#f59e0b';
                }
                return d.selected ? '#3b82f6' : '#1f2937';
            })
            .attr('stroke-width', 2)
            .on('click', (event, d) => {
                // If algorithm is finished (no current node) and we have previous pointers
                if (currentStep && !currentStep.current && currentStep.previous) {
                    const path = [];
                    let curr = d.id;
                    if (currentStep.distances[curr] !== Infinity) {
                        while (curr !== null && curr !== undefined) {
                            path.unshift(curr);
                            curr = currentStep.previous[curr];
                            if (path.length > nodes.length) break; // Safety
                        }
                        setLocalFinalPath(path);
                    }
                }
            })
            .on('contextmenu', (event, d) => {
                event.preventDefault();
                event.stopPropagation();
                deleteNode(d.id);
            })
            .on('mouseover', function () { d3.select(this).attr('stroke-width', 4); })
            .on('mouseout', function () { d3.select(this).attr('stroke-width', 2); })
            .call(d3.drag()
                .on('start', (event, d) => {
                    if (currentStep) return;
                    // Visual selection feedback
                    const newNodes = nodes.map(n => n.id === d.id ? { ...n, selected: true } : { ...n, selected: false });
                    setNodes(newNodes);
                    setDragEdge({ from: d.id, x1: d.x, y1: d.y, x2: d.x, y2: d.y });
                })
                .on('drag', (event, d) => {
                    if (currentStep) return;
                    const [mx, my] = d3.pointer(event, containerRef.current);

                    // Snapping logic
                    let x2 = mx;
                    let y2 = my;
                    const target = nodes.find(n => n.id !== d.id && Math.hypot(n.x - mx, n.y - my) < 25);
                    if (target) {
                        x2 = target.x;
                        y2 = target.y;
                    }

                    setDragEdge(prev => ({ ...prev, x2, y2 }));
                })
                .on('end', (event, d) => {
                    if (currentStep) return;
                    const [mx, my] = d3.pointer(event, containerRef.current);

                    const targetNode = nodes.find(n => n.id !== d.id && Math.hypot(n.x - mx, n.y - my) < 25);

                    if (targetNode) {
                        addEdge(d.id, targetNode.id);
                    } else {
                        // If moved significantly, update position
                        if (Math.hypot(d.x - mx, d.y - my) > 10) {
                            updateNodePosition(d.id, mx, my);
                        }
                    }

                    // Deselect
                    const newNodes = nodes.map(n => ({ ...n, selected: false }));
                    setNodes(newNodes);
                    setDragEdge(null);
                })
            );

        nodeGroups.append('text')
            .attr('x', d => d.x)
            .attr('y', d => d.y + 5) // Centered vertically (approx)
            .attr('text-anchor', 'middle')
            .attr('fill', '#ffffff')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .attr('pointer-events', 'none')
            .text(d => {
                if (currentStep && currentStep.distances) {
                    const dist = currentStep.distances[d.id];
                    if (dist !== undefined) {
                        return dist === Infinity ? "∞" : dist;
                    }
                }
                return d.id;
            });


        // Visit Index Labels (from BFS/DFS traversalOrder)
        if (currentStep && currentStep.traversalOrder) {
            currentStep.traversalOrder.forEach((id, idx) => {
                const node = nodes.find(n => n.id === id);
                if (node) {
                    svg.append('text')
                        .attr('x', node.x - 18)
                        .attr('y', node.y + 18)
                        .attr('fill', '#ef4444')
                        .attr('font-size', '10px')
                        .attr('font-weight', 'bold')
                        .attr('pointer-events', 'none')
                        .text(idx + 1);
                }
            });
        }

        // Draw dragging edge
        if (dragEdge) {
            svg.append('line')
                .attr('x1', dragEdge.x1)
                .attr('y1', dragEdge.y1)
                .attr('x2', dragEdge.x2)
                .attr('y2', dragEdge.y2)
                .attr('stroke', '#3b82f6')
                .attr('stroke-width', 2)
                .attr('marker-end', 'url(#arrowhead-dragging)')
                .attr('stroke-dasharray', '5,5');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodes, dragEdge, currentStep, updateNodePosition, addEdge, addNode, graphType]);

    return (
        <div className="relative w-full h-[450px] bg-[#0a0a0a] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
            <svg
                ref={containerRef}
                className="w-full h-full touch-none"
            />
            <div className="absolute top-6 right-6 flex flex-col items-end gap-3 pointer-events-none select-none">
                {!currentStep && (
                    <>
                        <div className="px-4 py-3 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 text-[11px] text-white/50 shadow-2xl space-y-1 text-right">
                            <p className="font-bold text-white/90 mb-1 tracking-wider uppercase">Interactive Graph Builder</p>
                            <p><span className="text-white/80">Click Canvas</span> to place a node •</p>
                            <p><span className="text-white/80">Drag Node to Node</span> to create an edge •</p>
                            <p><span className="text-white/80">Click Edge</span> to edit weight/cost •</p>
                            <p><span className="text-white/80">Right Click Node</span> to delete •</p>
                            <p><span className="text-white/80">Drag to Space</span> to move a node •</p>
                        </div>
                    </>
                )}

                <button
                    onClick={() => {
                        try {
                            const graphData = JSON.stringify(nodes);
                            const encoded = btoa(unescape(encodeURIComponent(graphData)));
                            const url = new URL(window.location.href);
                            url.searchParams.set('graph', encoded);
                            navigator.clipboard.writeText(url.toString());
                            setCopyStatus(true);
                        } catch (e) {
                            console.error("Failed to share graph:", e);
                        }
                    }}
                    className={`px-5 py-2 ${copyStatus ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/20'} text-xs font-medium rounded-xl border transition-all pointer-events-auto backdrop-blur-sm shadow-lg active:scale-95 flex items-center gap-2`}
                >
                    {copyStatus ? (
                        <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                            Link Copied!
                        </>
                    ) : "Share Village link"}
                </button>

                {!currentStep && (
                    <button
                        onClick={() => { if (onGraphChange) onGraphChange([]); }}
                        className="px-5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-xl border border-red-500/20 transition-all pointer-events-auto backdrop-blur-sm shadow-lg active:scale-95"
                    >
                        Reset Environment
                    </button>
                )}
            </div>

            {editingEdge && (
                <div
                    className="absolute z-50 flex items-center gap-2 p-2 bg-black/80 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200"
                    style={{
                        left: editingEdge.x,
                        top: editingEdge.y,
                        transform: 'translate(-50%, -50%)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <input
                        autoFocus
                        type="number"
                        value={weightInput}
                        onChange={(e) => setWeightInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const val = parseInt(weightInput);
                                if (!isNaN(val)) updateEdgeWeight(editingEdge.from, editingEdge.to, val);
                                setEditingEdge(null);
                            }
                            if (e.key === 'Escape') setEditingEdge(null);
                        }}
                        className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="Cost"
                    />
                    <button
                        onClick={() => {
                            const val = parseInt(weightInput);
                            if (!isNaN(val)) updateEdgeWeight(editingEdge.from, editingEdge.to, val);
                            setEditingEdge(null);
                        }}
                        className="p-1 px-3 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-bold rounded-lg transition-all active:scale-95"
                    >
                        SET
                    </button>
                    <button
                        onClick={() => setEditingEdge(null)}
                        className="p-1 px-2 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-[10px] font-bold rounded-lg transition-all"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
};

export default InteractiveGraphVisualizer;
