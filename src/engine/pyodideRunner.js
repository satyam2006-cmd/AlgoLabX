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

# User's solve function
${code}

# Main execution logic
def main():
    global steps, states
    steps = 0
    states = []
    
    print("Starting execution...")
    print(f"Input: ${JSON.stringify(input)}")
    
    start_time = time.time()
    
    # Run the user's function
    try:
        input_arr = ${JSON.stringify(input)}
        print(f"About to call solve with: {input_arr}")
        result = solve(input_arr)
        print(f"Solve returned: {result}")
        
        # Calculate metrics
        end_time = time.time()
        time_taken = end_time - start_time
        
        print(f"Time taken: {time_taken}")
        print(f"Steps counted: {steps}")
        print(f"States recorded: {len(states)}")
        
        return {
            'output': result,
            'time_taken': float(time_taken),
            'memory_used': 0,
            'steps': int(steps),
            'states': states,
            'error': None
        }
    except Exception as e:
        end_time = time.time()
        time_taken = end_time - start_time
        
        print(f"Error occurred: {e}")
        print(f"Time taken before error: {time_taken}")
        print(f"Steps before error: {steps}")
        
        return {
            'output': None,
            'time_taken': float(time_taken),
            'memory_used': 0,
            'steps': int(steps),
            'states': states,
            'error': str(e)
        }

# Execute main
print("About to call main...")
result = main()
print(f"Final result: {result}")
print(f"Result type: {type(result)}")
if hasattr(result, '__dict__'):
    print(f"Result dict: {result.__dict__}")
result
`;

    console.log('Running wrapped Python code...');
    
    // Run the code
    const pythonResult = pyodide.runPython(wrappedCode);
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
        jsResult = pythonResult.toJs({create_proxy: true});
        
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
