import React from 'react';
import { motion } from 'framer-motion';

// Icon Components
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const BookIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ScaleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>
);

const BeakerIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const LightBulbIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const BoltIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: HomeIcon },
    { id: 'learn', label: 'Learn', icon: BookIcon },
    { id: 'compare', label: 'Compare', icon: ScaleIcon },
    { id: 'experiment', label: 'Experiment', icon: BeakerIcon },
  ];

  return (
    <div className="w-72 h-screen bg-dark-900/95 backdrop-blur-xl border-r border-dark-700/20 flex flex-col">
      {/* Brand Section */}
      <div className="p-6 border-b border-dark-700/10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dark-500 to-dark-700 flex items-center justify-center shadow-lg border border-dark-500/20 text-dark-200">
            <BoltIcon />
          </div>
          <div>
            <h2 className="text-lg font-bold text-dark-50">AlgoLabX</h2>
            <p className="text-dark-400 text-xs font-medium">Virtual Algorithm Lab</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 p-4">
        <p className="text-dark-500 text-xs font-semibold uppercase tracking-wider mb-4 px-3">
          Navigation
        </p>
        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === item.id
                  ? 'bg-gradient-to-r from-dark-600/50 to-dark-700/50 text-dark-100 border border-dark-600/30 shadow-lg'
                  : 'text-dark-300 hover:bg-dark-800/30 hover:text-dark-100 border border-transparent'
                  }`}
              >
                <Icon />
                <span className="font-medium">{item.label}</span>
                {activeTab === item.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-dark-300"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="my-6 h-px bg-gradient-to-r from-transparent via-dark-700/50 to-transparent" />

        {/* Quick Stats */}
        <p className="text-dark-500 text-xs font-semibold uppercase tracking-wider mb-4 px-3">
          Quick Stats
        </p>
        <div className="space-y-3 px-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-400">Algorithms</span>
            <span className="text-dark-200 font-semibold">20+</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-400">Categories</span>
            <span className="text-dark-200 font-semibold">5</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-400">Visualizers</span>
            <span className="text-dark-200 font-semibold">4</span>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="p-4 border-t border-dark-700/10">
        <div className="p-4 rounded-xl bg-gradient-to-br from-dark-750/60 to-dark-800/60 border border-dark-700/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-dark-600/40 flex items-center justify-center text-dark-300">
              <LightBulbIcon />
            </div>
            <span className="text-dark-200 text-sm font-medium">Pro Tip</span>
          </div>
          <p className="text-dark-400 text-xs leading-relaxed">
            Try the Experiment tab to write and test your own algorithms!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
