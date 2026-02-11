# AlgoLabX - Interactive Algorithm Visualizer

A comprehensive web application for visualizing and learning algorithms through interactive step-by-step animations. Built with React, Vite, and Tailwind CSS.

## 🚀 Features

### 📊 Algorithm Categories

- **Sorting Algorithms**: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort, Shell Sort, Counting Sort, Radix Sort, Bucket Sort, Cocktail Sort, Comb Sort, Gnome Sort, Odd-Even Sort
- **Search Algorithms**: Binary Search, Linear Search, Jump Search, Interpolation Search, Exponential Search, Ternary Search, Fibonacci Search, Sentinel Search, Two-Pointer Search
- **Graph Algorithms**: BFS Traversal, DFS Traversal, Dijkstra's Algorithm, Bellman-Ford, Floyd-Warshall, Prim's MST, Kruskal's MST, Topological Sort, Cycle Detection
- **Dynamic Programming**: 0/1 Knapsack, Longest Common Subsequence, Edit Distance, Coin Change, Matrix Chain Multiplication, Rod Cutting, Longest Increasing Subsequence, Fibonacci DP

### 🤖 AI Powered Tools

- **AI DSA Mentor**: An intelligent teaching assistant powered by LLaMA 3 (via Groq) to solve doubts, explain code, and recommend data structures.
  - **Doubt Solver**: Get conceptual explanations and real-world analogies.
  - **Code Explainer**: Identification of algorithms and optimization tips for your code snippets.
  - **DS Recommender**: Personalized data structure recommendations based on problem requirements.

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
- **Backend (AI)**: Flask (Python) with Groq SDK
- **LLM**: LLaMA 3.3 70B (via Groq API)
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS for modern, responsive design
- **Animations**: Framer Motion for smooth transitions
- **Architecture**: Component-based with SmartVisualizer pattern and proxied API routes

## 📁 Project Structure

```text
src/
├── algorithms/           # Algorithm implementations
│   ├── comprehensiveAlgorithms.js  # Central algorithm registry
│   ├── comprehensiveSorting.js     # Core sorting algorithms
│   ├── comprehensiveSearching.js   # Core searching algorithms
│   ├── additionalSorting.js        # Extended sorting algorithms
│   ├── additionalSearching.js      # Extended searching algorithms
│   ├── graph/                      # Graph algorithms
│   │   ├── bfsSteps.js
│   │   ├── dfsSteps.js
│   │   ├── dijkstraSteps.js
│   │   └── additionalGraphAlgorithms.js  # Bellman-Ford, Floyd-Warshall, MST, etc.
│   └── dp/                         # Dynamic programming
│       ├── knapsackSteps.js
│       └── additionalDPAlgorithms.js     # LCS, Edit Distance, Coin Change, etc.
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
├── engine/              # Core functionality
│   ├── stepPlayer.js               # Animation controller
│   └── pyodideRunner.js            # Python execution
├── backend/             # AI Mentor API (Flask)
│   ├── app.py                      # Main Flask server
│   ├── prompts.py                  # Structured AI prompts
│   ├── requirements.txt            # Python dependencies
│   └── .env                        # API keys (Groq)
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

1. Install dependencies:

```bash
npm install
```

1. Start the development server:

```bash
npm run dev
```

1. Open your browser and navigate to `http://localhost:5173`

### 🤖 Setting up AI Mentor (Backend)

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install requirements:

   ```bash
   pip install -r requirements.txt
   ```

4. Configure your API key:
   - Create a `.env` file in the `backend/` directory.
   - Add your Groq API key: `GROQ_API_KEY=your_key_here`

5. Start the backend:

   ```bash
   python app.py
   ```

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
- **Shell Sort**: O(n log² n) - Improved insertion sort with gap sequences
- **Counting Sort**: O(n+k) - Non-comparison based
- **Radix Sort**: O(d×(n+k)) - Digit by digit sorting
- **Bucket Sort**: O(n+k) - Distribution-based sorting
- **Cocktail Sort**: O(n²) - Bidirectional bubble sort
- **Comb Sort**: O(n²) - Improved bubble sort with shrinking gap
- **Gnome Sort**: O(n²) - Simple sorting similar to insertion sort
- **Odd-Even Sort**: O(n²) - Parallel-friendly sorting

#### Search Algorithms

- **Binary Search**: O(log n) - Requires sorted array
- **Linear Search**: O(n) - Sequential search
- **Jump Search**: O(√n) - Block-based search
- **Interpolation Search**: O(log log n) - Position-based search
- **Exponential Search**: O(log n) - Range-based search
- **Ternary Search**: O(log₃ n) - Divides array into three parts
- **Fibonacci Search**: O(log n) - Uses Fibonacci numbers to divide array
- **Sentinel Search**: O(n) - Optimized linear search
- **Two-Pointer Search**: O(n) - Finds pairs with given sum

#### Graph Algorithms

- **BFS**: O(V+E) - Level-order traversal
- **DFS**: O(V+E) - Depth-order traversal
- **Dijkstra**: O((V+E) log V) - Single-source shortest path
- **Bellman-Ford**: O(VE) - Handles negative edge weights
- **Floyd-Warshall**: O(V³) - All-pairs shortest path
- **Prim's MST**: O((V+E) log V) - Minimum spanning tree (greedy)
- **Kruskal's MST**: O(E log E) - Minimum spanning tree (union-find)
- **Topological Sort**: O(V+E) - Linear ordering of DAG vertices
- **Cycle Detection**: O(V+E) - Detects cycles in directed graphs

#### Dynamic Programming

- **0/1 Knapsack**: O(nW) - Optimization problem solving
- **Longest Common Subsequence**: O(mn) - Find longest common subsequence
- **Edit Distance**: O(mn) - Minimum string transformations
- **Coin Change**: O(n×amount) - Minimum coins for amount
- **Matrix Chain Multiplication**: O(n³) - Optimal parenthesization
- **Rod Cutting**: O(n²) - Maximize profit by cutting rod
- **Longest Increasing Subsequence**: O(n²) - Find longest increasing sequence
- **Fibonacci DP**: O(n) - Computing Fibonacci using DP

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

- **70+ files** in the codebase
- **18,000+ lines** of code
- **40+ algorithms** implemented
- **4 specialized visualizers**
- **Complete step-by-step animations** for all algorithms

---

**AlgoLabX** - Making algorithms visual and interactive! 🚀

Built with ❤️ by [satyam2006-cmd](https://github.com/satyam2006-cmd)
