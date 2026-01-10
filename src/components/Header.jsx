import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ setActiveTab, setSelectedAlgorithm }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchData = [
    // Tabs
    { id: 'home', label: 'Home / Dashboard', category: 'Navigation', type: 'tab' },
    { id: 'learn', label: 'Learn Algorithms', category: 'Navigation', type: 'tab' },
    { id: 'compare', label: 'Compare Algorithms', category: 'Navigation', type: 'tab' },
    { id: 'experiment', label: 'Experiment / Sandbox', category: 'Navigation', type: 'tab' },

    // Algorithms (Learn Tab)
    { id: 'bubble', label: 'Bubble Sort', category: 'Sorting', type: 'algo' },
    { id: 'quick', label: 'Quick Sort', category: 'Sorting', type: 'algo' },
    { id: 'merge', label: 'Merge Sort', category: 'Sorting', type: 'algo' },
    { id: 'insertion', label: 'Insertion Sort', category: 'Sorting', type: 'algo' },
    { id: 'selection', label: 'Selection Sort', category: 'Sorting', type: 'algo' },
    { id: 'heap', label: 'Heap Sort', category: 'Sorting', type: 'algo' },
    { id: 'binary', label: 'Binary Search', category: 'Searching', type: 'algo' },
    { id: 'linear', label: 'Linear Search', category: 'Searching', type: 'algo' },
    { id: 'bfs', label: 'BFS Traversal', category: 'Graph', type: 'algo' },
    { id: 'dfs', label: 'DFS Traversal', category: 'Graph', type: 'algo' },
    { id: 'dijkstra', label: 'Dijkstra Pathfinding', category: 'Graph', type: 'algo' },
    { id: 'knapsack', label: 'Knapsack Problem', category: 'DP', type: 'algo' },
  ];

  const filteredSuggestions = searchQuery.trim() === ''
    ? []
    : searchData.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 6);

  const handleSelect = (item) => {
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
  };

  const handleKeyDown = (e) => {
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
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-16 bg-dark-900/80 border-b border-white flex items-center justify-between px-6 sticky top-0 z-50 backdrop-blur-xl"
    >
      {/* Left Section - Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
          LabX
        </h1>
        <span className="text-gray-600">–</span>
        <span className="text-white text-sm font-medium">Dashboard</span>
      </div>

      {/* Center Section - Advanced Search */}
      <div className="max-w-md w-full px-8 relative">
        <div className="w-full relative group">
          <input
            type="text"
            placeholder="Search algorithms... (e.g., 'bubble', 'graph')"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            className="w-full bg-dark-800/50 border border-white rounded-xl py-2.5 pl-10 pr-4 text-dark-200 text-sm placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300 group-hover:bg-dark-800/80"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white group-hover:text-white transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-8 right-8 mt-2 bg-dark-900 border border-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100] backdrop-blur-2xl"
            >
              {filteredSuggestions.map((item, index) => (
                <button
                  key={`${item.id}-${index}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all ${selectedIndex === index
                    ? 'bg-dark-800/80 text-dark-50'
                    : 'text-white hover:bg-dark-800/40'
                    }`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-[10px] text-white uppercase tracking-wider">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.type === 'algo' ? (
                      <span className="px-2 py-0.5 rounded-md bg-dark-800 text-[10px] text-white border border-dark-700/30">Algorithm</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-[10px] text-emerald-400 border border-emerald-500/20">Page</span>
                    )}
                    {selectedIndex === index && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-3">
        <motion.a
          href="https://github.com/satyam2006-cmd/AlgoLabX"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-xl bg-dark-800/50 border border-white flex items-center justify-center text-white hover:text-yellow-400 transition-colors"
          title="Star on GitHub"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </motion.a>

        <motion.a
          href="https://github.com/satyam2006-cmd/AlgoLabX"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-xl bg-dark-800/50 border border-dark-700/50 flex items-center justify-center text-white hover:text-dark-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
        </motion.a>

        <motion.a
          href="https://github.com/satyam2006-cmd/AlgoLabX/graphs/contributors"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-dark-500 to-dark-700 text-dark-50 font-medium border border-white shadow-lg cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="text-sm">Contributors</span>
        </motion.a>
      </div>
    </motion.div>
  );
};

export default Header;
