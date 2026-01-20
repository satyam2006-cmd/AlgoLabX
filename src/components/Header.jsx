import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ setActiveTab, setSelectedAlgorithm, sidebarOpen, setSidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Comprehensive algorithm data with complexity and descriptions
  const searchData = useMemo(() => [
    // Navigation Tabs
    { id: 'home', label: 'Home / Dashboard', category: 'Navigation', type: 'tab', complexity: '', description: 'Go to the main dashboard' },
    { id: 'learn', label: 'Learn Algorithms', category: 'Navigation', type: 'tab', complexity: '', description: 'Interactive algorithm visualization' },
    { id: 'compare', label: 'Compare Algorithms', category: 'Navigation', type: 'tab', complexity: '', description: 'Compare algorithms side-by-side' },
    { id: 'experiment', label: 'Experiment / Sandbox', category: 'Navigation', type: 'tab', complexity: '', description: 'Write and test your own algorithms' },

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

  // Smart filtering - search in label, category, complexity, and description
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

  const handleSelect = useCallback((item) => {
    if (item.type === 'tab') {
      setActiveTab(item.id);
    } else if (item.type === 'algo') {
      setActiveTab('learn');
      setTimeout(() => {
        setSelectedAlgorithm(item.id);
      }, 0);
    }
    setSearchQuery('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  }, [setActiveTab, setSelectedAlgorithm]);

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
      case 'navigation': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-14 sm:h-16 bg-dark-900/80 border-b border-white flex items-center justify-between px-3 sm:px-6 sticky top-0 z-50 backdrop-blur-xl gap-3"
    >
      {/* Menu Button - Visible only on mobile/tablet */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 hover:bg-dark-800 rounded-lg transition-colors flex-shrink-0 lg:hidden"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Left Section - Title (hidden on mobile for more search space) */}
      <div className="hidden sm:flex items-center gap-2 sm:gap-4 min-w-0 flex-shrink-0">
        <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent truncate">
          LabX
        </h1>
        <span className="text-gray-600 hidden sm:inline">–</span>
        <span className="text-white text-xs sm:text-sm font-medium hidden sm:inline">Dashboard</span>
      </div>

      {/* Center Section - Search Bar */}
      <div className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-2 sm:mx-4">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search algorithms, complexity..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            className="w-full bg-dark-800/60 border border-white rounded-xl py-2 pl-9 sm:pl-10 pr-8 text-dark-200 text-xs sm:text-sm placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all duration-300"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500 group-focus-within:text-white transition-colors"
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
              className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-dark-500 hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

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
              <div className="max-h-80 overflow-y-auto">
                {filteredSuggestions.map((item, index) => (
                  <button
                    key={`${item.id}-${index}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex flex-col px-3 sm:px-4 py-2.5 text-left transition-all border-b border-white/5 last:border-b-0 ${selectedIndex === index
                      ? 'bg-dark-700/80'
                      : 'hover:bg-dark-800/60'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className={`font-medium text-xs sm:text-sm truncate ${selectedIndex === index ? 'text-dark-50' : 'text-dark-300'}`}>
                        {item.label}
                      </span>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {item.complexity && (
                          <span className="px-1.5 py-0.5 rounded bg-dark-600/50 text-[9px] sm:text-[10px] font-mono text-dark-400">
                            {item.complexity}
                          </span>
                        )}
                        <span className={`px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium border ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                      </div>
                    </div>
                    {item.description && (
                      <span className="text-[10px] sm:text-xs text-dark-500 truncate">
                        {item.description}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="px-3 py-1.5 bg-dark-800/50 border-t border-white/10">
                <p className="text-[9px] sm:text-[10px] text-dark-500">
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
              <div className="px-4 py-4 text-center">
                <p className="text-dark-500 text-xs sm:text-sm">No results for "{searchQuery}"</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <motion.a
          href="https://github.com/satyam2006-cmd/AlgoLabX"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-dark-800/50 border border-white flex items-center justify-center text-white hover:text-yellow-400 transition-all"
          title="Star on GitHub"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </motion.a>

        {/* GitHub Icon - Hidden on mobile */}
        <motion.a
          href="https://github.com/satyam2006-cmd/AlgoLabX"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden sm:flex w-10 h-10 rounded-xl bg-dark-800/50 border border-dark-700/50 items-center justify-center text-white hover:text-dark-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
        </motion.a>

        {/* Contributors - Hidden on mobile */}
        <motion.a
          href="https://github.com/satyam2006-cmd/AlgoLabX/graphs/contributors"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          className="hidden sm:flex items-center gap-3 px-4 py-1.5 rounded-xl bg-gradient-to-br from-dark-500 to-dark-700 text-dark-50 font-medium border border-white shadow-lg cursor-pointer"
        >
          <span className="text-sm">Contributors</span>
          <div className="w-8 h-8 rounded-full border border-white/40 overflow-hidden bg-white/10">
            <img
              src="https://avatars.githubusercontent.com/u/188743121?v=4"
              alt="Developer Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.a>
      </div>
    </motion.div>
  );
};

export default Header;
