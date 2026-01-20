// Pyodide Runner for executing Python code in browser
let pyodide = null;
let isPyodideLoading = false;

export const loadPyodide = async () => {
  if (pyodide) return pyodide;
  if (isPyodideLoading) {
    // Wait for loading to complete
    while (isPyodideLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return pyodide;
  }

  isPyodideLoading = true;
  try {
    pyodide = await window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
    });

    // Install commonly used packages
    await pyodide.loadPackage(['micropip']);

    isPyodideLoading = false;
    return pyodide;
  } catch (error) {
    isPyodideLoading = false;
    throw error;
  }
};

export const runPythonCode = async (code, input = []) => {
  if (!pyodide) {
    await loadPyodide();
  }

  try {
    console.log('Input array:', input);
    console.log('User code:', code);

    // Test with a simple Python execution first
    console.log('Testing basic Python execution...');
    const testResult = pyodide.runPython('print("Hello from Python"); 2 + 2');
    console.log('Test result:', testResult);

    // Prepare the Python code with helper functions
    const wrappedCode = `
import time
import sys

# Global variables for tracking
steps = 0
states = []

def step():
    global steps
    steps += 1

def record(arr):
    if isinstance(arr, list):
        states.append(arr.copy())

def get_obj_size(obj):
    size = sys.getsizeof(obj)
    if isinstance(obj, list):
        for item in obj:
            size += sys.getsizeof(item)
    return size

# User's solve function
${code}

# Main execution logic
def main():
    global steps, states
    steps = 0
    states = []
    
    start_time = time.perf_counter()
    
    try:
        input_arr = ${JSON.stringify(input)}
        result = solve(input_arr)
        
        end_time = time.perf_counter()
        time_taken = end_time - start_time
        
        # Estimate memory based on recorded states and result
        total_memory = get_obj_size(result)
        for s in states:
            total_memory += get_obj_size(s)
            
        return {
            'output': result,
            'time_taken': float(time_taken),
            'memory_used': float(total_memory),
            'steps': int(steps),
            'states': states,
            'error': None
        }
    except Exception as e:
        end_time = time.perf_counter()
        time_taken = end_time - start_time
        
        return {
            'output': None,
            'time_taken': float(time_taken),
            'memory_used': 0,
            'steps': int(steps),
            'states': states,
            'error': str(e)
        }

result = main()
result
`;

    const jsStartTime = performance.now();

    // Run the code
    const pythonResult = pyodide.runPython(wrappedCode);

    const jsEndTime = performance.now();
    const jsDuration = (jsEndTime - jsStartTime) / 1000; // in seconds
    console.log('Raw Python result:', pythonResult);
    console.log('Type of result:', typeof pythonResult);

    // Convert the result to a JavaScript object
    let jsResult;
    try {
      console.log('Attempting to convert Python result...');

      if (pythonResult === undefined || pythonResult === null) {
        throw new Error('Python execution returned no result');
      }

      // Convert Map to regular JavaScript object
      if (pythonResult instanceof Map) {
        console.log('Converting Map to object...');
        jsResult = {};
        for (const [key, value] of pythonResult.entries()) {
          jsResult[key] = value;
        }
        console.log('Converted from Map:', jsResult);
      }
      // Try to convert Pyodide objects to JavaScript
      else if (typeof pythonResult.toJs === 'function') {
        console.log('Converting with toJs()...');
        jsResult = pythonResult.toJs({ create_proxy: true });

        // If it's still a Map, convert it
        if (jsResult instanceof Map) {
          console.log('Result is still Map, converting...');
          const tempResult = {};
          for (const [key, value] of jsResult.entries()) {
            tempResult[key] = value;
          }
          jsResult = tempResult;
        }
      } else if (typeof pythonResult === 'object') {
        console.log('Result is already an object, using directly...');
        jsResult = pythonResult;
      } else {
        console.log('Using result directly...');
        jsResult = pythonResult;
      }

      console.log('Final JS result:', jsResult);
      console.log('JS result keys:', Object.keys(jsResult || {}));
      console.log('JS result output:', jsResult?.output);
      console.log('JS result steps:', jsResult?.steps);
      console.log('JS result time_taken:', jsResult?.time_taken);

    } catch (e) {
      console.error('Error converting Python result:', e);
      console.error('Original result type:', typeof pythonResult);
      console.error('Original result:', pythonResult);

      // Fallback: try to extract basic info
      jsResult = {
        output: null,
        time_taken: 0,
        memory_used: 0,
        steps: 0,
        states: [],
        error: `Conversion error: ${e.message}`
      };
    }

    return jsResult;

  } catch (error) {
    console.error('Pyodide execution error:', error);
    return {
      output: null,
      time_taken: 0,
      memory_used: 0,
      steps: 0,
      states: [],
      error: error.message || error.toString()
    };
  }
};

export const resetPyodide = () => {
  if (pyodide) {
    pyodide.runPython(`
# Reset global variables
steps = 0
states = []
    `);
  }
};
