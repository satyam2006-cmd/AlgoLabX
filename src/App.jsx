import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Compare from './pages/Compare';
import Experiment from './pages/Experiment';
import MergeSortPage from './pages/MergeSortPage';
import HeapPage from './pages/HeapPage';
import AIMentor from './pages/AIMentor';

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const location = useLocation(); // Unused


  // Helper to determine active tab for passing to Sidebar if we want to keep props there, 
  // but better to let Sidebar handle it. 
  // However, the original structure passed activeTab to Sidebar. 
  // I will refactor Sidebar to use useLocation internally, so I don't need to pass it.

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
        {/* Sidebar Overlay - Active only on mobile/tablet when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
            tabIndex={-1}
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setSidebarOpen(false);
              }
            }}
          />
        )}

        {/* Sidebar - Permanent on desktop, toggleable on mobile */}
        <div className={`fixed lg:static inset-y-0 left-0 z-[70] transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}>
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            setSelectedAlgorithm={setSelectedAlgorithm}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home onAlgorithmSelect={setSelectedAlgorithm} />} />
              <Route
                path="/learn"
                element={
                  <Learn
                    selectedAlgorithm={selectedAlgorithm}
                    setSelectedAlgorithm={setSelectedAlgorithm}
                  />
                }
              />
              <Route path="/compare" element={<Compare />} />
              <Route path="/experiment" element={<Experiment />} />
              <Route path="/merge-sort" element={<MergeSortPage />} />
              <Route path="/heap" element={<HeapPage />} />
              <Route path="/ai-mentor" element={<AIMentor />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
