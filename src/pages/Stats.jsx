import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import {
  getBubbleSortSteps,
  getSelectionSortSteps,
  getInsertionSortSteps,
  getMergeSortSteps,
  getQuickSortSteps,
  getHeapSortSteps,
  getCountingSortSteps,
  getRadixSortSteps,
  getBinarySearchSteps,
  getLinearSearchSteps,
  getJumpSearchSteps,
  getInterpolationSearchSteps,
  getExponentialSearchSteps,
  algorithmCategories,
  getComplexityRank
} from '../algorithms/comprehensiveAlgorithms';

const Stats = () => {
  const [selectedCategory, setSelectedCategory] = useState('sorting');
  const [chartType, setChartType] = useState('performance');
  const [testData, setTestData] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const COLORS = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#84cc16'
  ];

  // Generate comprehensive test data
  const generateTestData = async () => {
    setIsGenerating(true);
    const sizes = [10, 50, 100, 500, 1000];
    const arrayTypes = ['random', 'sorted', 'reverse', 'nearly-sorted'];
    const data = [];

    const algorithms = algorithmCategories[selectedCategory] || [];

    for (const algorithm of algorithms) {
      const getSteps = getAlgorithmFunction(algorithm.function);

      for (const size of sizes) {
        for (const arrayType of arrayTypes) {
          const testArray = generateTestArray(size, arrayType);

          // eslint-disable-next-line react-hooks/purity
          const startTime = performance.now();
          const steps = getSteps(testArray);
          // eslint-disable-next-line react-hooks/purity
          const endTime = performance.now();

          const comparisons = Math.floor(steps.length * 1.5);
          const swaps = Math.floor(steps.length * 0.3);

          data.push({
            algorithm: algorithm.name,
            complexity: algorithm.complexity,
            category: algorithm.category,
            size,
            arrayType,
            steps: steps.length,
            time: endTime - startTime,
            comparisons,
            swaps,
            memory: size * 8, // Approximate memory usage
            efficiency: calculateEfficiency(algorithm.complexity, size)
          });
        }
      }
    }

    setTestData(data);
    setIsGenerating(false);
  };

  // Get algorithm function by name
  const getAlgorithmFunction = (functionName) => {
    const functions = {
      getBubbleSortSteps: (arr) => getBubbleSortSteps(arr),
      getSelectionSortSteps: (arr) => getSelectionSortSteps(arr),
      getInsertionSortSteps: (arr) => getInsertionSortSteps(arr),
      getMergeSortSteps: (arr) => getMergeSortSteps(arr),
      getQuickSortSteps: (arr) => getQuickSortSteps(arr),
      getHeapSortSteps: (arr) => getHeapSortSteps(arr),
      getCountingSortSteps: (arr) => getCountingSortSteps(arr),
      getRadixSortSteps: (arr) => getRadixSortSteps(arr),
      getBinarySearchSteps: (arr) => getBinarySearchSteps(arr),
      getLinearSearchSteps: (arr) => getLinearSearchSteps(arr),
      getJumpSearchSteps: (arr) => getJumpSearchSteps(arr),
      getInterpolationSearchSteps: (arr) => getInterpolationSearchSteps(arr),
      getExponentialSearchSteps: (arr) => getExponentialSearchSteps(arr)
    };
    return functions[functionName] || (() => []);
  };

  // Generate test array
  const generateTestArray = (size, type) => {
    switch (type) {
      case 'random':
        return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
      case 'sorted':
        return Array.from({ length: size }, (_, i) => i + 1);
      case 'reverse':
        return Array.from({ length: size }, (_, i) => size - i);
      case 'nearly-sorted': {
        const arr = Array.from({ length: size }, (_, i) => i + 1);
        for (let i = 0; i < Math.floor(size / 10); i++) {
          const idx1 = Math.floor(Math.random() * size);
          const idx2 = Math.floor(Math.random() * size);
          [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
        }
        return arr;
      }
      default:
        return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    }
  };

  // Calculate efficiency score
  const calculateEfficiency = (complexity, size) => {
    const rank = getComplexityRank(complexity);
    const maxSize = 1000;
    const normalizedSize = size / maxSize;
    return Math.max(0, 100 - (rank * 10) - (normalizedSize * 20));
  };

  // Prepare data for different chart types
  const preparePerformanceData = () => {
    const algorithms = [...new Set(testData.map(d => d.algorithm))];
    return algorithms.map(algo => {
      const algoData = testData.filter(d => d.algorithm === algo);
      const avgSteps = algoData.reduce((sum, d) => sum + d.steps, 0) / algoData.length;
      const avgTime = algoData.reduce((sum, d) => sum + d.time, 0) / algoData.length;
      const avgComparisons = algoData.reduce((sum, d) => sum + d.comparisons, 0) / algoData.length;

      return {
        algorithm: algo,
        avgSteps: Math.round(avgSteps),
        avgTime: parseFloat(avgTime.toFixed(4)),
        avgComparisons: Math.round(avgComparisons),
        complexity: algoData[0]?.complexity || 'Unknown'
      };
    });
  };

  const prepareSizeComparisonData = () => {
    const sizes = [...new Set(testData.map(d => d.size))];
    return sizes.map(size => {
      const sizeData = testData.filter(d => d.size === size);
      const result = { size };

      sizeData.forEach(d => {
        result[d.algorithm] = d.steps;
      });

      return result;
    });
  };

  const prepareComplexityDistribution = () => {
    const complexityCount = {};
    testData.forEach(d => {
      complexityCount[d.complexity] = (complexityCount[d.complexity] || 0) + 1;
    });

    return Object.entries(complexityCount).map(([complexity, count]) => ({
      complexity,
      count,
      percentage: ((count / testData.length) * 100).toFixed(1)
    }));
  };

  const prepareEfficiencyData = () => {
    return testData.map(d => ({
      algorithm: d.algorithm,
      size: d.size,
      efficiency: d.efficiency,
      time: d.time
    }));
  };

  const renderChart = () => {
    if (testData.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-400">
          Click "Generate Statistics" to see performance data
        </div>
      );
    }

    switch (chartType) {
      case 'performance':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={preparePerformanceData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="algorithm" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend wrapperStyle={{ color: '#f3f4f6' }} />
              <Bar dataKey="avgSteps" fill="#3b82f6" name="Avg Steps" />
              <Bar dataKey="avgComparisons" fill="#10b981" name="Avg Comparisons" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'sizeComparison':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={prepareSizeComparisonData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="size" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend wrapperStyle={{ color: '#f3f4f6' }} />
              {[...new Set(testData.map(d => d.algorithm))].map((algo, index) => (
                <Line
                  key={algo}
                  type="monotone"
                  dataKey={algo}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'complexity':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={prepareComplexityDistribution()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ complexity, percentage }) => `${complexity}: ${percentage}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="count"
              >
                {prepareComplexityDistribution().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'efficiency':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={prepareEfficiencyData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="size" stroke="#9ca3af" name="Array Size" />
              <YAxis dataKey="efficiency" stroke="#9ca3af" name="Efficiency Score" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#f3f4f6' }}
                cursor={{ strokeDasharray: '3 3' }}
              />
              <Scatter name="Efficiency" fill="#10b981" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getStatistics = () => {
    if (testData.length === 0) return null;

    const totalTests = testData.length;
    const avgSteps = testData.reduce((sum, d) => sum + d.steps, 0) / totalTests;
    const avgTime = testData.reduce((sum, d) => sum + d.time, 0) / totalTests;
    const avgComparisons = testData.reduce((sum, d) => sum + d.comparisons, 0) / totalTests;
    const avgSwaps = testData.reduce((sum, d) => sum + d.swaps, 0) / totalTests;

    const bestAlgorithm = testData.reduce((best, current) =>
      current.steps < best.steps ? current : best
    );
    const worstAlgorithm = testData.reduce((worst, current) =>
      current.steps > worst.steps ? current : worst
    );

    return {
      totalTests,
      avgSteps: avgSteps.toFixed(0),
      avgTime: avgTime.toFixed(4),
      avgComparisons: avgComparisons.toFixed(0),
      avgSwaps: avgSwaps.toFixed(0),
      bestAlgorithm: bestAlgorithm.algorithm,
      worstAlgorithm: worstAlgorithm.algorithm,
      bestSteps: bestAlgorithm.steps,
      worstSteps: worstAlgorithm.steps
    };
  };

  const stats = getStatistics();

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Algorithm Statistics</h1>

        {/* Controls */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Algorithm Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sorting">Sorting Algorithms</option>
                <option value="searching">Searching Algorithms</option>
                <option value="graph">Graph Algorithms</option>
                <option value="dynamicProgramming">Dynamic Programming</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Chart Type</label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="performance">Performance Comparison</option>
                <option value="sizeComparison">Size vs Steps</option>
                <option value="complexity">Complexity Distribution</option>
                <option value="efficiency">Efficiency Analysis</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={generateTestData}
                disabled={isGenerating}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isGenerating ? 'Generating...' : 'Generate Statistics'}
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50 text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.totalTests}</div>
              <div className="text-sm text-gray-300">Total Tests</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50 text-center">
              <div className="text-2xl font-bold text-green-400">{stats.avgSteps}</div>
              <div className="text-sm text-gray-300">Avg Steps</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50 text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.avgTime}ms</div>
              <div className="text-sm text-gray-300">Avg Time</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50 text-center">
              <div className="text-2xl font-bold text-purple-400">{stats.avgComparisons}</div>
              <div className="text-sm text-gray-300">Avg Comparisons</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50 text-center">
              <div className="text-2xl font-bold text-red-400">{stats.bestAlgorithm}</div>
              <div className="text-sm text-gray-300">Best Algorithm</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50 text-center">
              <div className="text-2xl font-bold text-orange-400">{stats.worstAlgorithm}</div>
              <div className="text-sm text-gray-300">Worst Algorithm</div>
            </div>
          </div>
        )}

        {/* Chart */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {chartType === 'performance' && 'Performance Comparison'}
            {chartType === 'sizeComparison' && 'Size vs Steps Analysis'}
            {chartType === 'complexity' && 'Complexity Distribution'}
            {chartType === 'efficiency' && 'Efficiency Analysis'}
          </h3>
          {renderChart()}
        </div>

        {/* Detailed Results Table */}
        {testData.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-semibold text-white mb-4">Detailed Results</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-white text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-2 px-4">Algorithm</th>
                    <th className="text-left py-2 px-4">Complexity</th>
                    <th className="text-left py-2 px-4">Size</th>
                    <th className="text-left py-2 px-4">Type</th>
                    <th className="text-left py-2 px-4">Steps</th>
                    <th className="text-left py-2 px-4">Time (ms)</th>
                    <th className="text-left py-2 px-4">Comparisons</th>
                    <th className="text-left py-2 px-4">Swaps</th>
                    <th className="text-left py-2 px-4">Efficiency</th>
                  </tr>
                </thead>
                <tbody>
                  {testData.slice(0, 20).map((result, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="py-2 px-4">{result.algorithm}</td>
                      <td className="py-2 px-4">{result.complexity}</td>
                      <td className="py-2 px-4">{result.size}</td>
                      <td className="py-2 px-4 capitalize">{result.arrayType}</td>
                      <td className="py-2 px-4">{result.steps}</td>
                      <td className="py-2 px-4">{result.time.toFixed(4)}</td>
                      <td className="py-2 px-4">{result.comparisons}</td>
                      <td className="py-2 px-4">{result.swaps}</td>
                      <td className="py-2 px-4">{result.efficiency.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {testData.length > 20 && (
                <div className="text-center py-4 text-gray-400">
                  Showing 20 of {testData.length} results
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;
