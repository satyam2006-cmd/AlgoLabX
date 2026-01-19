import React, { useState, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';

const AlgorithmSearch = ({ onSelect, algorithms, placeholder = "Search algorithms...", showComplexity = true, showHint = true, hintText = "" }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Memoized comprehensive algorithm data with complexity and descriptions
  const defaultAlgorithms = useMemo(() => [
    // Sorting - Simple O(n²)
    { id: 'bubble', label: 'Bubble Sort', category: 'Sorting', type: 'algo', complexity: 'O(n²)', description: 'Compare adjacent elements and swap if out of order' },
    { id: 'selection', label: 'Selection Sort', category: 'Sorting', type: 'algo', complexity: 'O(n²)', description: 'Find minimum element and place at beginning' },
    { id: 'insertion', label: 'Insertion Sort', category: 'Sorting', type: 'algo', complexity: 'O(n²)', description: 'Build sorted array one element at a time' },
    { id: 'cocktail', label: 'Cocktail Sort', category: 'Sorting', type: 'algo', complexity: 'O(n²)', description: 'Bidirectional bubble sort' },
    { id: 'gnome', label: 'Gnome Sort', category: 'Sorting', type: 'algo', complexity: 'O(n²)', description: 'Similar to insertion sort with swaps' },
    { id: 'comb', label: 'Comb Sort', category: 'Sorting', type: 'algo', complexity: 'O(n²)', description: 'Improved bubble sort with gap sequence' },
    { id: 'oddeven', label: 'Odd-Even Sort', category: 'Sorting', type: 'algo', complexity: 'O(n²)', description: 'Parallel sorting comparing odd-even pairs' },
    // Sorting - Efficient O(n log n)
    { id: 'merge', label: 'Merge Sort', category: 'Sorting', type: 'algo', complexity: 'O(n log n)', description: 'Divide and conquer, merge sorted halves' },
    { id: 'quick', label: 'Quick Sort', category: 'Sorting', type: 'algo', complexity: 'O(n log n)', description: 'Partition around pivot element' },
    { id: 'heap', label: 'Heap Sort', category: 'Sorting', type: 'algo', complexity: 'O(n log n)', description: 'Uses binary heap data structure' },
    { id: 'shell', label: 'Shell Sort', category: 'Sorting', type: 'algo', complexity: 'O(n log² n)', description: 'Generalized insertion sort with gaps' },
    // Sorting - Non-comparison
    { id: 'counting', label: 'Counting Sort', category: 'Sorting', type: 'algo', complexity: 'O(n + k)', description: 'Count occurrences of each element' },
    { id: 'radix', label: 'Radix Sort', category: 'Sorting', type: 'algo', complexity: 'O(d(n + k))', description: 'Sort by individual digits' },
    { id: 'bucket', label: 'Bucket Sort', category: 'Sorting', type: 'algo', complexity: 'O(n + k)', description: 'Distribute into buckets, then sort' },
    // Searching
    { id: 'binary', label: 'Binary Search', category: 'Searching', type: 'algo', complexity: 'O(log n)', description: 'Divide sorted array in half each step' },
    { id: 'linear', label: 'Linear Search', category: 'Searching', type: 'algo', complexity: 'O(n)', description: 'Check each element sequentially' },
    { id: 'jump', label: 'Jump Search', category: 'Searching', type: 'algo', complexity: 'O(√n)', description: 'Jump ahead by fixed steps, then linear' },
    { id: 'interpolation', label: 'Interpolation Search', category: 'Searching', type: 'algo', complexity: 'O(log log n)', description: 'Estimate position based on value' },
    { id: 'exponential', label: 'Exponential Search', category: 'Searching', type: 'algo', complexity: 'O(log n)', description: 'Find range exponentially, then binary' },
    { id: 'ternary', label: 'Ternary Search', category: 'Searching', type: 'algo', complexity: 'O(log₃ n)', description: 'Divide into three parts instead of two' },
    { id: 'fibonacci', label: 'Fibonacci Search', category: 'Searching', type: 'algo', complexity: 'O(log n)', description: 'Use Fibonacci numbers to divide array' },
    { id: 'sentinel', label: 'Sentinel Search', category: 'Searching', type: 'algo', complexity: 'O(n)', description: 'Linear search with sentinel optimization' },
    { id: 'twopointer', label: 'Two Pointer Search', category: 'Searching', type: 'algo', complexity: 'O(n)', description: 'Two pointers converging from both ends' },
    // Graph
    { id: 'bfs', label: 'BFS Traversal', category: 'Graph', type: 'algo', complexity: 'O(V + E)', description: 'Explore neighbors level by level' },
    { id: 'dfs', label: 'DFS Traversal', category: 'Graph', type: 'algo', complexity: 'O(V + E)', description: 'Explore as deep as possible first' },
    { id: 'dijkstra', label: 'Dijkstra\'s Algorithm', category: 'Graph', type: 'algo', complexity: 'O((V+E) log V)', description: 'Shortest path from source to all nodes' },
    { id: 'bellmanford', label: 'Bellman-Ford', category: 'Graph', type: 'algo', complexity: 'O(VE)', description: 'Shortest path with negative weights' },
    { id: 'floydwarshall', label: 'Floyd-Warshall', category: 'Graph', type: 'algo', complexity: 'O(V³)', description: 'All-pairs shortest paths' },
    { id: 'prim', label: 'Prim\'s MST', category: 'Graph', type: 'algo', complexity: 'O((V+E) log V)', description: 'Minimum spanning tree from a vertex' },
    { id: 'kruskal', label: 'Kruskal\'s MST', category: 'Graph', type: 'algo', complexity: 'O(E log E)', description: 'MST by sorting edges, union-find' },
    { id: 'topological', label: 'Topological Sort', category: 'Graph', type: 'algo', complexity: 'O(V + E)', description: 'Linear ordering of DAG vertices' },
    { id: 'cycledetect', label: 'Cycle Detection', category: 'Graph', type: 'algo', complexity: 'O(V + E)', description: 'Detect cycles using three-color DFS' },
    // DP
    { id: 'knapsack', label: '0/1 Knapsack', category: 'DP', type: 'algo', complexity: 'O(nW)', description: 'Maximize value under weight constraint' },
    { id: 'lcs', label: 'Longest Common Subsequence', category: 'DP', type: 'algo', complexity: 'O(mn)', description: 'Find longest common subsequence' },
    { id: 'editdistance', label: 'Edit Distance', category: 'DP', type: 'algo', complexity: 'O(mn)', description: 'Min operations to transform strings' },
    { id: 'coinchange', label: 'Coin Change', category: 'DP', type: 'algo', complexity: 'O(n×amount)', description: 'Min coins to make amount' },
    { id: 'matrixchain', label: 'Matrix Chain Multiplication', category: 'DP', type: 'algo', complexity: 'O(n³)', description: 'Optimal matrix multiplication order' },
    { id: 'rodcutting', label: 'Rod Cutting', category: 'DP', type: 'algo', complexity: 'O(n²)', description: 'Maximize profit from cutting rod' },
    { id: 'lis', label: 'Longest Increasing Subsequence', category: 'DP', type: 'algo', complexity: 'O(n²)', description: 'Find longest increasing subsequence' },
    { id: 'fibonaccidp', label: 'Fibonacci DP', category: 'DP', type: 'algo', complexity: 'O(n)', description: 'Fibonacci using memoization/tabulation' },
  ], []);

  const searchData = algorithms || defaultAlgorithms;

  // Memoized smart filtering - search in label, category, complexity, and description
  const filteredSuggestions = useMemo(() => {
    if (searchQuery.trim() === '') return [];
    const query = searchQuery.toLowerCase();
    return searchData.filter(item => (
      item.label.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      (item.complexity && item.complexity.toLowerCase().includes(query)) ||
      (item.description && item.description.toLowerCase().includes(query))
    )).slice(0, 8);
  }, [searchQuery, searchData]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleSelect = useCallback((item) => {
    if (onSelect) {
      onSelect(item);
    }
    setSearchQuery('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  }, [onSelect]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
        handleSelect(filteredSuggestions[selectedIndex]);
      } else if (filteredSuggestions.length > 0) {
        handleSelect(filteredSuggestions[0]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredSuggestions.length - 1));
      setShowSuggestions(true);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  }, [selectedIndex, filteredSuggestions, handleSelect]);

  const getCategoryColor = useCallback((category) => {
    switch (category.toLowerCase()) {
      case 'sorting': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'searching': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'graph': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'dp': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative group">
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={handleKeyDown}
          className="w-full bg-dark-800/60 border border-white/20 rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 text-dark-200 text-sm placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all duration-300"
        />
        <svg
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-dark-500 group-focus-within:text-white transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setShowSuggestions(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-dark-500 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Hint text */}
      {showHint && hintText && !showSuggestions && (
        <p className="text-dark-500 text-xs mt-1.5 px-1">{hintText}</p>
      )}

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-dark-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="max-h-96 overflow-y-auto">
              {filteredSuggestions.map((item, index) => (
                <button
                  key={`${item.id}-${index}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex flex-col px-4 py-3 text-left transition-all border-b border-white/5 last:border-b-0 ${
                    selectedIndex === index
                      ? 'bg-dark-700/80'
                      : 'hover:bg-dark-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`font-medium text-sm truncate ${selectedIndex === index ? 'text-dark-50' : 'text-dark-300'}`}>
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {showComplexity && item.complexity && (
                        <span className="px-1.5 py-0.5 rounded bg-dark-600/50 text-[10px] font-mono text-dark-400">
                          {item.complexity}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                  {item.description && (
                    <span className="text-xs text-dark-500 truncate">
                      {item.description}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="px-4 py-2 bg-dark-800/50 border-t border-white/10">
              <p className="text-[10px] text-dark-500">
                <span className="text-dark-400">↑↓</span> Navigate • <span className="text-dark-400">Enter</span> Select • <span className="text-dark-400">Esc</span> Close
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      <AnimatePresence>
        {showSuggestions && searchQuery.trim() !== '' && filteredSuggestions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-dark-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="px-4 py-6 text-center">
              <p className="text-dark-500 text-sm">No algorithms found for "{searchQuery}"</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlgorithmSearch;
