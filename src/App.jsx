import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Compare from './pages/Compare';
import Experiment from './pages/Experiment';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'learn':
        return (
          <Learn
            selectedAlgorithm={selectedAlgorithm}
            setSelectedAlgorithm={setSelectedAlgorithm}
          />
        );
      case 'compare':
        return <Compare />;
      case 'experiment':
        return <Experiment />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-dark-50">
      {/* Background Gradient Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-dark-700/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-dark-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-dark-500/5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Main Layout */}
      <div className="flex h-screen relative z-10">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 lg:hidden z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar - Hidden on mobile, visible on lg */}
        <div className={`fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={(tabId) => {
              setActiveTab(tabId);
              setSidebarOpen(false);
            }}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            setActiveTab={setActiveTab}
            setSelectedAlgorithm={setSelectedAlgorithm}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <main className="flex-1 overflow-y-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
