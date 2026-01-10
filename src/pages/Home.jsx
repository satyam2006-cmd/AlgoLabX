import React from 'react';
import { motion } from 'framer-motion';

// Icon Components
const BookOpenIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ScaleIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>
);

const BeakerIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const TargetIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const RocketIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ChartBarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const FolderIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const CubeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const Home = ({ setActiveTab }) => {
  const features = [
    {
      id: 'learn',
      title: 'Learn',
      description: 'Visualize and understand algorithms step-by-step with interactive animations.',
      icon: BookOpenIcon,
      gradient: 'from-gray-500 to-dark-700',
      stat: '20+',
      statLabel: 'Algorithms'
    },
    {
      id: 'compare',
      title: 'Compare',
      description: 'Compare different algorithms side-by-side to analyze their performance.',
      icon: ScaleIcon,
      gradient: 'from-green-500 to-dark-700',
      stat: '5',
      statLabel: 'Categories'
    },
    {
      id: 'experiment',
      title: 'Experiment',
      description: 'Write and test your own algorithms with real-time performance metrics.',
      icon: BeakerIcon,
      gradient: 'from-purple-600 to-dark-800',
      stat: '∞',
      statLabel: 'Possibilities'
    },
    {
      id: 'visualize',
      title: 'Visualize',
      description: 'Beautiful visualizations for arrays, graphs, trees, and dynamic programming.',
      icon: SparklesIcon,
      gradient: 'from-yellow-400 to-dark-600',
      stat: '4',
      statLabel: 'Visualizers'
    }
  ];

  const quickStats = [
    { value: '20+', label: 'Algorithms', icon: CubeIcon },
    { value: '5', label: 'Categories', icon: FolderIcon },
    { value: '4', label: 'Visualizers', icon: ChartBarIcon },
    { value: '100%', label: 'Interactive', icon: TargetIcon }
  ];

  const steps = [
    { step: 1, title: 'Learn', desc: 'Understand algorithm fundamentals', color: 'gray' },
    { step: 2, title: 'Compare', desc: 'Analyze algorithm efficiency', color: 'emerald' },
    { step: 3, title: 'Experiment', desc: 'Write custom algorithms', color: 'purple' }
  ];

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-800/80 to-dark-900/80 border border-white p-8 md:p-12">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-dark-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-dark-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4" />

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-700/40 border border-white text-white text-sm font-medium mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Virtual Algorithm Laboratory
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-bold text-dark-50 mb-4 leading-tight">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-dark-10 to-dark-50 bg-clip-text text-slate-50">
                  AlgoLabX
                </span>
              </h1>

              <p className="text-white text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
                Your interactive playground for learning, comparing, and experimenting with algorithms.
                Experience the power of visual learning.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('learn')}
                  className="px-6 py-3 bg-gradient-to-r from-dark-500 to-dark-600 rounded-xl font-semibold text-dark-50 shadow-lg border border-white transition-all duration-300 hover:shadow-xl flex items-center gap-2"
                >
                  Get Started
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('experiment')}
                  className="px-6 py-3 bg-dark-800/50 border border-white rounded-xl font-medium text-dark-200 transition-all duration-300 hover:bg-dark-700/50 hover:border-white"
                >
                  Explore Algorithms
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-5 rounded-xl bg-dark-800/40 border border-white hover:border-white transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-white">
                    <Icon />
                  </div>
                  <span className="text-2xl font-bold text-dark-100">
                    {stat.value}
                  </span>
                </div>
                <p className="text-white text-sm">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-semibold text-dark-100 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-dark-600 to-dark-800 flex items-center justify-center text-dark-200 border border-white">
              <TargetIcon />
            </span>
            Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group relative p-6 rounded-2xl bg-gradient-to-br from-dark-800/60 to-dark-900/60 border border-white overflow-hidden transition-all duration-300 hover:border-white hover:shadow-xl"
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-dark-600/0 to-dark-600/0 group-hover:from-dark-600/5 group-hover:to-dark-700/5 transition-all duration-500" />

                  <div className="relative z-10 flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg flex-shrink-0 border border-white`}>
                      <Icon />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-dark-100">
                          {feature.title}
                        </h3>
                        <div className="text-right">
                          <span className="text-xl font-bold text-dark-200">{feature.stat}</span>
                          <p className="text-xs text-white">{feature.statLabel}</p>
                        </div>
                      </div>
                      <p className="text-white text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Getting Started Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-6 rounded-2xl bg-dark-800/30 border border-white"
        >
          <h2 className="text-2xl font-semibold text-dark-100 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-dark-500 to-dark-700 flex items-center justify-center text-white border border-white">
              <RocketIcon />
            </span>
            Getting Started
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color === 'gray' ? 'from-gray-500 to-gray-700' :
                  item.color === 'emerald' ? 'from-dark-500 to-dark-700' :
                    'from-dark-600 to-dark-800'
                  } flex items-center justify-center font-bold text-white shadow-lg flex-shrink-0 border border-white`}>
                  {item.step}
                </div>
                <div>
                  <h4 className={`font-semibold mb-1 ${item.color === 'gray' ? 'text-yellow-200' :
                    item.color === 'emerald' ? 'text-emerald-400' :
                      'text-purple-400'
                    }`}>
                    {item.title}
                  </h4>
                  <p className="text-white text-sm">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
