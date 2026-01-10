# AlgoLabX - Interactive Algorithm Visualizer

A comprehensive web application for visualizing and learning algorithms through interactive step-by-step animations. Built with React, Vite, and Tailwind CSS.

## 🚀 Features

### 📊 Algorithm Categories
- **Sorting Algorithms**: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort, Counting Sort, Radix Sort
- **Search Algorithms**: Binary Search, Linear Search, Jump Search, Interpolation Search, Exponential Search
- **Graph Algorithms**: BFS Traversal, DFS Traversal, Dijkstra's Algorithm
- **Dynamic Programming**: 0/1 Knapsack Problem

### 🎨 Specialized Visualizers
- **ArrayVisualizer**: Bar chart visualizations for sorting and searching algorithms
- **GraphVisualizer**: Node-edge graph visualizations with grid layout
- **DPVisualizer**: Table-based visualizations for dynamic programming
- **SearchVisualizer**: Pointer-based visualizations for search algorithms
- **SmartVisualizer**: Intelligent routing to appropriate visualizer based on algorithm type

### ⚡ Interactive Features
- **Step-by-step Animation**: Watch algorithms execute step by step
- **Speed Control**: Adjust animation speed for better understanding
- **Custom Input**: Provide your own arrays and data
- **Random Generation**: Generate random test data
- **Traversal Order Display**: See the exact order of operations
- **Shortest Path Highlighting**: Visual representation of optimal paths (Dijkstra)

### 🎯 Learning Tools
- **Algorithm Descriptions**: Detailed explanations for each algorithm
- **Complexity Analysis**: Time and space complexity information
- **Interactive Controls**: Play, pause, step forward, step backward, reset
- **Real-time Messages**: Understand what's happening at each step

## 🛠️ Technology Stack

- **Frontend**: React 18 with hooks
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS for modern, responsive design
- **Animations**: Framer Motion for smooth transitions
- **Architecture**: Component-based with SmartVisualizer pattern

## 📁 Project Structure

```
src/
├── algorithms/           # Algorithm implementations
│   ├── comprehensiveAlgorithms.js  # Central algorithm registry
│   ├── comprehensiveSorting.js     # All sorting algorithms
│   ├── comprehensiveSearching.js   # All searching algorithms
│   ├── graph/                      # Graph algorithms
│   │   ├── bfsSteps.js
│   │   ├── dfsSteps.js
│   │   └── dijkstraSteps.js
│   └── dp/                         # Dynamic programming
│       └── knapsackSteps.js
├── components/          # React components
│   ├── SmartVisualizer.jsx         # Main visualizer router
│   ├── GraphVisualizer.jsx         # Graph visualization
│   ├── ArrayVisualizer.jsx         # Array visualization
│   ├── DPVisualizer.jsx            # DP table visualization
│   └── SearchVisualizer.jsx        # Search visualization
├── pages/               # Application pages
│   ├── Learn.jsx                    # Main learning interface
│   ├── Compare.jsx                  # Algorithm comparison
│   ├── Home.jsx                     # Landing page
│   └── Experiment.jsx               # Python experimentation
└── engine/              # Core functionality
    ├── stepPlayer.js               # Animation controller
    └── pyodideRunner.js            # Python execution
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/satyam2006-cmd/AlgoLabX.git
cd AlgoLabX
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 📖 Usage Guide

### Learning Algorithms
1. Navigate to the **Learn** tab
2. Select an algorithm from the dropdown menu
3. Choose between:
   - **Random Array**: Generate test data automatically
   - **Custom Array**: Input your own data
4. For search algorithms, specify the target value
5. Click **Play** to start the animation
6. Use controls to pause, step forward/backward, or reset

### Understanding Visualizations
- **Sorting**: Watch bars compare and swap positions
- **Searching**: See pointers move through the array
- **Graphs**: Follow node traversal with edge weights
- **DP**: Observe table filling process

### Algorithm Categories

#### Sorting Algorithms
- **Bubble Sort**: O(n²) - Simple comparison-based sorting
- **Selection Sort**: O(n²) - Selects minimum element repeatedly
- **Insertion Sort**: O(n²) - Builds sorted array one element at a time
- **Merge Sort**: O(n log n) - Divide and conquer approach
- **Quick Sort**: O(n log n) - Partition-based sorting
- **Heap Sort**: O(n log n) - Uses heap data structure
- **Counting Sort**: O(n+k) - Non-comparison based
- **Radix Sort**: O(d×(n+k)) - Digit by digit sorting

#### Search Algorithms
- **Binary Search**: O(log n) - Requires sorted array
- **Linear Search**: O(n) - Sequential search
- **Jump Search**: O(√n) - Block-based search
- **Interpolation Search**: O(log log n) - Position-based search
- **Exponential Search**: O(log n) - Range-based search

#### Graph Algorithms
- **BFS**: O(V+E) - Level-order traversal
- **DFS**: O(V+E) - Depth-order traversal
- **Dijkstra**: O((V+E) log V) - Shortest path finding

#### Dynamic Programming
- **0/1 Knapsack**: O(nW) - Optimization problem solving

## 🎨 Design Features

### SmartVisualizer System
The `SmartVisualizer` component automatically routes to the appropriate visualizer based on algorithm type:
- `sorting` → `ArrayVisualizer`
- `searching` → `SearchVisualizer`
- `graph` → `GraphVisualizer`
- `dp` → `DPVisualizer`

### Step-Based Animation
All algorithms generate a series of steps containing:
- Current state of data structures
- Active elements being processed
- Messages explaining the operation
- Metadata for visualization

### Responsive Design
- Mobile-friendly interface
- Adaptive layouts for different screen sizes
- Touch-friendly controls

## 🔧 Customization

### Adding New Algorithms
1. Implement the algorithm in the appropriate category file
2. Generate step data following the established format
3. Register the algorithm in `comprehensiveAlgorithms.js`
4. Add the algorithm to the UI dropdown

### Creating New Visualizers
1. Create a new component following the existing pattern
2. Add routing logic to `SmartVisualizer`
3. Define the expected data structure for steps

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for the lightning-fast build tool
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for smooth animations

## 📊 Project Statistics

- **61 files** in the codebase
- **13,416+ lines** of code
- **18+ algorithms** implemented
- **4 specialized visualizers**
- **Complete step-by-step animations** for all algorithms

---

**AlgoLabX** - Making algorithms visual and interactive! 🚀

Built with ❤️ by [satyam2006-cmd](https://github.com/satyam2006-cmd)
