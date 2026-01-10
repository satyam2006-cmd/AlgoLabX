import React from 'react';
import { motion } from 'framer-motion';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'learn', label: 'Learn', icon: '📚' },
    { id: 'compare', label: 'Compare', icon: '⚖️' },
    { id: 'experiment', label: 'Experiment', icon: '🔬' },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900/80 backdrop-blur-lg border-r border-gray-700/50 p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-2">AlgoLabX</h2>
        <p className="text-gray-400 text-sm">Virtual Algorithm Lab</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </motion.button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
