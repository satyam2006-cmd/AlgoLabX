import React from 'react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="flex-1 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-white mb-6">
          Welcome to AlgoLabX
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50"
          >
            <h3 className="text-xl font-semibold text-blue-400 mb-3">📚 Learn</h3>
            <p className="text-gray-300">
              Visualize and understand algorithms step-by-step with interactive animations.
            </p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50"
          >
            <h3 className="text-xl font-semibold text-green-400 mb-3">⚖️ Compare</h3>
            <p className="text-gray-300">
              Compare different algorithms side-by-side to analyze their performance.
            </p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50"
          >
            <h3 className="text-xl font-semibold text-purple-400 mb-3">🔬 Experiment</h3>
            <p className="text-gray-300">
              Write and test your own algorithms with real-time performance metrics.
            </p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50"
          >
            <h3 className="text-xl font-semibold text-orange-400 mb-3">🚀 Features</h3>
            <p className="text-gray-300">
              Python execution in browser, performance analysis, and beautiful visualizations.
            </p>
          </motion.div>
        </div>
        
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-2xl font-semibold text-white mb-4">Getting Started</h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center">
              <span className="text-blue-400 mr-2">▸</span>
              Start with <span className="text-blue-400 font-medium">Learn</span> to understand algorithm fundamentals
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">▸</span>
              Use <span className="text-green-400 font-medium">Compare</span> to analyze algorithm efficiency
            </li>
            <li className="flex items-center">
              <span className="text-purple-400 mr-2">▸</span>
              Try <span className="text-purple-400 font-medium">Experiment</span> to write custom algorithms
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
