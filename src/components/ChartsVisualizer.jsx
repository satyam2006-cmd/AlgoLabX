import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ChartsVisualizer = ({ 
  comparisonData = [], 
  algorithmNames = [],
  chartType = 'line',
  metrics = ['time', 'steps', 'comparisons']
}) => {
  // Prepare data for charts
  const prepareLineChartData = () => {
    return comparisonData.map((item, index) => ({
      inputSize: item.inputSize,
      ...algorithmNames.reduce((acc, name, i) => {
        acc[name] = item.algorithms[i]?.[metrics[0]] || 0;
        return acc;
      }, {})
    }));
  };

  const prepareBarChartData = () => {
    return algorithmNames.map((name, index) => ({
      name,
      time: comparisonData[comparisonData.length - 1]?.algorithms[index]?.time || 0,
      steps: comparisonData[comparisonData.length - 1]?.algorithms[index]?.steps || 0,
      comparisons: comparisonData[comparisonData.length - 1]?.algorithms[index]?.comparisons || 0
    }));
  };

  const preparePieChartData = () => {
    const latestData = comparisonData[comparisonData.length - 1];
    if (!latestData) return [];
    
    return algorithmNames.map((name, index) => ({
      name,
      value: latestData.algorithms[index]?.[metrics[0]] || 0
    }));
  };

  const COLORS = [
    '#3b82f6', // blue-500
    '#10b981', // green-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#8b5cf6', // purple-500
    '#ec4899', // pink-500
    '#06b6d4', // cyan-500
    '#f97316', // orange-500
  ];

  const lineChartData = prepareLineChartData();
  const barChartData = prepareBarChartData();
  const pieChartData = preparePieChartData();

  if (!comparisonData || comparisonData.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700/50">
        <p className="text-gray-400">No comparison data available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-6 bg-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700/50">
      <h2 className="text-2xl font-bold text-white">Algorithm Performance Comparison</h2>
      
      {/* Chart Type Selector */}
      <div className="flex space-x-4">
        <button
          onClick={() => {}}
          className={`px-4 py-2 rounded-lg transition-colors ${
            chartType === 'line' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Line Chart
        </button>
        <button
          onClick={() => {}}
          className={`px-4 py-2 rounded-lg transition-colors ${
            chartType === 'bar' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Bar Chart
        </button>
        <button
          onClick={() => {}}
          className={`px-4 py-2 rounded-lg transition-colors ${
            chartType === 'pie' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Pie Chart
        </button>
      </div>

      {/* Charts Container */}
      <div className="w-full max-w-6xl">
        {chartType === 'line' && (
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-4 text-center">Performance Over Input Size</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="inputSize" 
                  stroke="#9ca3af"
                  label={{ value: 'Input Size', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  stroke="#9ca3af"
                  label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Legend 
                  wrapperStyle={{ color: '#f3f4f6' }}
                />
                {algorithmNames.map((name, index) => (
                  <Line
                    key={name}
                    type="monotone"
                    dataKey={name}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartType === 'bar' && (
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-4 text-center">Algorithm Metrics Comparison</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af"
                />
                <YAxis 
                  stroke="#9ca3af"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Legend 
                  wrapperStyle={{ color: '#f3f4f6' }}
                />
                <Bar dataKey="time" fill={COLORS[0]} name="Time (ms)" />
                <Bar dataKey="steps" fill={COLORS[1]} name="Steps" />
                <Bar dataKey="comparisons" fill={COLORS[2]} name="Comparisons" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartType === 'pie' && (
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-4 text-center">Performance Distribution</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Algorithm Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        {algorithmNames.map((name, index) => (
          <div key={name} className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <span className="text-gray-300">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartsVisualizer;
