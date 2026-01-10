// 0/1 Knapsack Problem Step Generator
// Returns an array of steps for visualization
export function* knapsackSteps(arr) {
  if (arr.length < 2) {
    yield { array: [], active: [], swapped: false, description: "Need at least weights and values arrays" };
    return;
  }
  
  // Split array into weights and values (simplified)
  const half = Math.floor(arr.length / 2);
  const weights = arr.slice(0, half);
  const values = arr.slice(half);
  const capacity = 50; // Fixed capacity
  const n = weights.length;
  
  // DP table
  const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
  
  yield { 
    array: [dp[0][capacity]], 
    active: [], 
    swapped: false, 
    description: `Starting 0/1 Knapsack with capacity ${capacity}` 
  };
  
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w], 
          values[i - 1] + dp[i - 1][w - weights[i - 1]]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
      
      yield { 
        array: [dp[i][capacity]], 
        active: [i, w], 
        swapped: true, 
        description: `Item ${i}: weight=${weights[i - 1]}, value=${values[i - 1]}, capacity=${w}, best=${dp[i][w]}` 
      };
    }
    
    yield { 
      array: [dp[i][capacity]], 
      active: [], 
      swapped: false, 
      description: `Completed item ${i}, current best value: ${dp[i][capacity]}` 
    };
  }
  
  yield { 
    array: [dp[n][capacity]], 
    active: [], 
    swapped: false, 
    description: `Knapsack completed! Maximum value: ${dp[n][capacity]}` 
  };
}

// Get all steps as an array
export function getKnapsackSteps(arr) {
  const generator = knapsackSteps(arr);
  const steps = [];
  let step = generator.next();
  
  while (!step.done) {
    steps.push(step.value);
    step = generator.next();
  }
  
  return steps;
}
