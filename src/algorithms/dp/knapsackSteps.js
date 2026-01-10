// 0/1 Knapsack Problem Step Generator
// Returns an array of steps for visualization
export function knapsackSteps(input) {
  // Input format: [w1, w2, ..., wn, v1, v2, ..., vn]
  // First half are weights, second half are values
  const arr = [...input];
  const steps = [];
  
  if (arr.length < 2) {
    steps.push({
      dpTable: [],
      currentItem: -1,
      currentCapacity: -1,
      itemWeights: [],
      itemValues: [],
      message: "Invalid input: need at least weight and value arrays"
    });
    return steps;
  }
  
  const mid = Math.floor(arr.length / 2);
  const weights = arr.slice(0, mid);
  const values = arr.slice(mid);
  const n = weights.length;
  const capacity = 50; // Fixed capacity for demonstration
  
  // Initialize DP table
  const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
  
  // Initial state
  steps.push({
    dpTable: dp.map(row => [...row]),
    currentItem: 0,
    currentCapacity: 0,
    itemWeights: weights,
    itemValues: values,
    message: `Starting 0/1 Knapsack with capacity ${capacity} and ${n} items`
  });
  
  for (let i = 1; i <= n; i++) {
    const weight = weights[i - 1];
    const value = values[i - 1];
    
    steps.push({
      dpTable: dp.map(row => [...row]),
      currentItem: i,
      currentCapacity: 0,
      itemWeights: weights,
      itemValues: values,
      message: `Processing item ${i}: weight=${weight}, value=${value}`
    });
    
    for (let w = 0; w <= capacity; w++) {
      if (weight <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weight] + value);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
      
      steps.push({
        dpTable: dp.map(row => [...row]),
        currentItem: i,
        currentCapacity: w,
        itemWeights: weights,
        itemValues: values,
        message: `Updated DP table for item ${i}, capacity ${w}: ${dp[i][w]}`
      });
    }
  }
  
  // Final state
  steps.push({
    dpTable: dp.map(row => [...row]),
    currentItem: n,
    currentCapacity: capacity,
    itemWeights: weights,
    itemValues: values,
    message: `Knapsack completed. Maximum value: ${dp[n][capacity]}`
  });
  
  return steps;
}
