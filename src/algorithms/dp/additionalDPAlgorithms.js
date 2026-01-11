// Additional Dynamic Programming Algorithms
// LCS, Edit Distance, Coin Change, Matrix Chain Multiplication, Rod Cutting, LIS, Fibonacci DP

// Longest Common Subsequence (LCS)
export function getLCSSteps(input) {
  const str1 = input?.str1 || "AGGTAB";
  const str2 = input?.str2 || "GXTXAYB";
  const steps = [];

  const m = str1.length;
  const n = str2.length;

  // Initialize DP table
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  steps.push({
    dpTable: JSON.parse(JSON.stringify(dp)),
    currentItem: 0,
    currentCapacity: 0,
    itemWeights: str1.split(''),
    itemValues: str2.split(''),
    message: `Finding LCS of "${str1}" and "${str2}". Initialize DP table with zeros.`
  });

  // Fill the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      steps.push({
        dpTable: JSON.parse(JSON.stringify(dp)),
        currentItem: i,
        currentCapacity: j,
        itemWeights: str1.split(''),
        itemValues: str2.split(''),
        message: `Comparing str1[${i - 1}]='${str1[i - 1]}' with str2[${j - 1}]='${str2[j - 1]}'`
      });

      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        steps.push({
          dpTable: JSON.parse(JSON.stringify(dp)),
          currentItem: i,
          currentCapacity: j,
          itemWeights: str1.split(''),
          itemValues: str2.split(''),
          message: `Characters match! dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`
        });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        steps.push({
          dpTable: JSON.parse(JSON.stringify(dp)),
          currentItem: i,
          currentCapacity: j,
          itemWeights: str1.split(''),
          itemValues: str2.split(''),
          message: `No match. dp[${i}][${j}] = max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}`
        });
      }
    }
  }

  // Backtrack to find the LCS string
  let lcs = "";
  let i = m, j = n;

  steps.push({
    dpTable: JSON.parse(JSON.stringify(dp)),
    currentItem: i,
    currentCapacity: j,
    itemWeights: str1.split(''),
    itemValues: str2.split(''),
    message: `LCS length = ${dp[m][n]}. Backtracking to find the actual sequence...`
  });

  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      lcs = str1[i - 1] + lcs;
      steps.push({
        dpTable: JSON.parse(JSON.stringify(dp)),
        currentItem: i,
        currentCapacity: j,
        itemWeights: str1.split(''),
        itemValues: str2.split(''),
        message: `Match at (${i},${j}): '${str1[i - 1]}'. LCS so far: "${lcs}". Move diagonal.`
      });
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      steps.push({
        dpTable: JSON.parse(JSON.stringify(dp)),
        currentItem: i,
        currentCapacity: j,
        itemWeights: str1.split(''),
        itemValues: str2.split(''),
        message: `dp[${i - 1}][${j}] > dp[${i}][${j - 1}], move up`
      });
      i--;
    } else {
      steps.push({
        dpTable: JSON.parse(JSON.stringify(dp)),
        currentItem: i,
        currentCapacity: j,
        itemWeights: str1.split(''),
        itemValues: str2.split(''),
        message: `dp[${i}][${j - 1}] >= dp[${i - 1}][${j}], move left`
      });
      j--;
    }
  }

  steps.push({
    dpTable: JSON.parse(JSON.stringify(dp)),
    currentItem: m,
    currentCapacity: n,
    itemWeights: str1.split(''),
    itemValues: str2.split(''),
    message: `✅ LCS complete! Longest Common Subsequence: "${lcs}" (length: ${lcs.length})`
  });

  return steps;
}

// Edit Distance (Levenshtein Distance)
export function getEditDistanceSteps(input) {
  const str1 = input?.str1 || "kitten";
  const str2 = input?.str2 || "sitting";
  const steps = [];

  const m = str1.length;
  const n = str2.length;

  // Initialize DP table
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  // Base cases
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  steps.push({
    dpTable: JSON.parse(JSON.stringify(dp)),
    currentItem: 0,
    currentCapacity: 0,
    itemWeights: str1.split(''),
    itemValues: str2.split(''),
    message: `Finding edit distance from "${str1}" to "${str2}". Base cases filled.`
  });

  // Fill DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      steps.push({
        dpTable: JSON.parse(JSON.stringify(dp)),
        currentItem: i,
        currentCapacity: j,
        itemWeights: str1.split(''),
        itemValues: str2.split(''),
        message: `Computing dp[${i}][${j}] for '${str1[i - 1]}' and '${str2[j - 1]}'`
      });

      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
        steps.push({
          dpTable: JSON.parse(JSON.stringify(dp)),
          currentItem: i,
          currentCapacity: j,
          itemWeights: str1.split(''),
          itemValues: str2.split(''),
          message: `Characters match! No operation. dp[${i}][${j}] = ${dp[i][j]}`
        });
      } else {
        const insert = dp[i][j - 1] + 1;
        const del = dp[i - 1][j] + 1;
        const replace = dp[i - 1][j - 1] + 1;
        dp[i][j] = Math.min(insert, del, replace);

        let operation = dp[i][j] === insert ? 'insert' : (dp[i][j] === del ? 'delete' : 'replace');

        steps.push({
          dpTable: JSON.parse(JSON.stringify(dp)),
          currentItem: i,
          currentCapacity: j,
          itemWeights: str1.split(''),
          itemValues: str2.split(''),
          message: `Min(ins:${insert}, del:${del}, rep:${replace}) = ${dp[i][j]} (${operation})`
        });
      }
    }
  }

  steps.push({
    dpTable: JSON.parse(JSON.stringify(dp)),
    currentItem: m,
    currentCapacity: n,
    itemWeights: str1.split(''),
    itemValues: str2.split(''),
    message: `✅ Edit Distance complete! Min operations: ${dp[m][n]}`
  });

  return steps;
}

// Coin Change Problem
export function getCoinChangeSteps(input) {
  const coins = input?.coins || [1, 2, 5];
  const amount = input?.amount || 11;
  const steps = [];

  // Create 2D DP table for visualization
  const dp = Array(coins.length + 1).fill(null).map(() => Array(amount + 1).fill(Infinity));
  for (let i = 0; i <= coins.length; i++) dp[i][0] = 0;

  steps.push({
    dpTable: dp.map(row => row.map(v => v === Infinity ? '∞' : v)),
    currentItem: 0,
    currentCapacity: 0,
    itemWeights: coins,
    itemValues: coins.map(c => `Coin ${c}`),
    message: `Finding min coins for amount ${amount} using coins [${coins.join(', ')}]`
  });

  // Fill DP table
  for (let i = 1; i <= coins.length; i++) {
    const coin = coins[i - 1];
    for (let j = 1; j <= amount; j++) {
      dp[i][j] = dp[i - 1][j]; // Don't use this coin
      
      if (coin <= j && dp[i][j - coin] !== Infinity) {
        dp[i][j] = Math.min(dp[i][j], dp[i][j - coin] + 1);
      }

      steps.push({
        dpTable: dp.map(row => row.map(v => v === Infinity ? '∞' : v)),
        currentItem: i,
        currentCapacity: j,
        itemWeights: coins,
        itemValues: coins.map(c => `Coin ${c}`),
        message: `Coin ${coin}, amount ${j}: dp = ${dp[i][j] === Infinity ? '∞' : dp[i][j]}`
      });
    }
  }

  const result = dp[coins.length][amount];
  steps.push({
    dpTable: dp.map(row => row.map(v => v === Infinity ? '∞' : v)),
    currentItem: coins.length,
    currentCapacity: amount,
    itemWeights: coins,
    itemValues: coins.map(c => `Coin ${c}`),
    message: result !== Infinity 
      ? `✅ Coin Change complete! Minimum coins: ${result}`
      : `❌ No solution exists for amount ${amount}`
  });

  return steps;
}

// Matrix Chain Multiplication
export function getMatrixChainSteps(input) {
  const dimensions = input?.dimensions || [10, 30, 5, 60];
  const steps = [];

  const n = dimensions.length - 1;
  const dp = Array(n).fill(null).map(() => Array(n).fill(0));

  steps.push({
    dpTable: JSON.parse(JSON.stringify(dp)),
    currentItem: 0,
    currentCapacity: 0,
    itemWeights: dimensions,
    itemValues: Array(n).fill(null).map((_, i) => `M${i + 1}`),
    message: `Matrix Chain for ${n} matrices. Dimensions: ${dimensions.join(' × ')}`
  });

  // Fill DP table for chain lengths 2 to n
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i < n - len + 1; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;

      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k + 1][j] + dimensions[i] * dimensions[k + 1] * dimensions[j + 1];

        if (cost < dp[i][j]) {
          dp[i][j] = cost;
        }
      }

      steps.push({
        dpTable: dp.map(row => row.map(v => v === Infinity ? '∞' : v)),
        currentItem: i,
        currentCapacity: j,
        itemWeights: dimensions,
        itemValues: Array(n).fill(null).map((_, idx) => `M${idx + 1}`),
        message: `Chain M${i + 1}..M${j + 1}: min cost = ${dp[i][j]}`
      });
    }
  }

  steps.push({
    dpTable: dp.map(row => row.map(v => v === Infinity ? '∞' : v)),
    currentItem: 0,
    currentCapacity: n - 1,
    itemWeights: dimensions,
    itemValues: Array(n).fill(null).map((_, i) => `M${i + 1}`),
    message: `✅ Matrix Chain complete! Min multiplications: ${dp[0][n - 1]}`
  });

  return steps;
}

// Rod Cutting Problem
export function getRodCuttingSteps(input) {
  const prices = input?.prices || [0, 1, 5, 8, 9, 10, 17, 17, 20];
  const rodLength = input?.length || prices.length - 1;
  const steps = [];

  const n = rodLength;
  // Create 2D table for visualization
  const dp = Array(n + 1).fill(null).map(() => Array(n + 1).fill(0));

  steps.push({
    dpTable: JSON.parse(JSON.stringify(dp)),
    currentItem: 0,
    currentCapacity: 0,
    itemWeights: Array.from({ length: n }, (_, i) => i + 1),
    itemValues: prices.slice(1, n + 1),
    message: `Rod Cutting. Length: ${n}. Prices: [${prices.slice(1, n + 1).join(', ')}]`
  });

  // Fill DP table
  for (let i = 1; i <= n; i++) {
    for (let len = 1; len <= n; len++) {
      dp[i][len] = dp[i - 1][len]; // Don't use piece of length i
      
      if (i <= len) {
        dp[i][len] = Math.max(dp[i][len], prices[i] + dp[i][len - i]);
      }

      steps.push({
        dpTable: JSON.parse(JSON.stringify(dp)),
        currentItem: i,
        currentCapacity: len,
        itemWeights: Array.from({ length: n }, (_, idx) => idx + 1),
        itemValues: prices.slice(1, n + 1),
        message: `Piece ${i}, length ${len}: max value = ${dp[i][len]}`
      });
    }
  }

  steps.push({
    dpTable: JSON.parse(JSON.stringify(dp)),
    currentItem: n,
    currentCapacity: n,
    itemWeights: Array.from({ length: n }, (_, i) => i + 1),
    itemValues: prices.slice(1, n + 1),
    message: `✅ Rod Cutting complete! Maximum value: ${dp[n][n]}`
  });

  return steps;
}

// Longest Increasing Subsequence
export function getLISSteps(input) {
  const arr = input?.array || [10, 22, 9, 33, 21, 50, 41, 60, 80];
  const steps = [];

  const n = arr.length;
  const lisLength = Array(n).fill(1);

  steps.push({
    dpTable: [lisLength.map(v => v)],
    currentItem: 0,
    currentCapacity: 0,
    itemWeights: arr,
    itemValues: arr.map((v, i) => `idx ${i}`),
    message: `Finding LIS of [${arr.join(', ')}]. Initialize all dp = 1.`
  });

  // Fill DP array
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[j] < arr[i] && lisLength[j] + 1 > lisLength[i]) {
        lisLength[i] = lisLength[j] + 1;
      }
    }

    steps.push({
      dpTable: [lisLength.map(v => v)],
      currentItem: 0,
      currentCapacity: i,
      itemWeights: arr,
      itemValues: arr.map((v, idx) => `idx ${idx}`),
      message: `LIS ending at index ${i} (value ${arr[i]}): length = ${lisLength[i]}`
    });
  }

  const maxLength = Math.max(...lisLength);
  steps.push({
    dpTable: [lisLength.map(v => v)],
    currentItem: 0,
    currentCapacity: n - 1,
    itemWeights: arr,
    itemValues: arr.map((v, i) => `idx ${i}`),
    message: `✅ LIS complete! Length: ${maxLength}`
  });

  return steps;
}

// Fibonacci (DP approach)
export function getFibonacciDPSteps(input) {
  const n = input?.n || 10;
  const steps = [];

  const dp = Array(n + 1).fill(0);
  dp[0] = 0;
  dp[1] = 1;

  steps.push({
    dpTable: [dp.slice(0, Math.min(n + 1, 15))],
    currentItem: 0,
    currentCapacity: 1,
    itemWeights: Array.from({ length: Math.min(n + 1, 15) }, (_, i) => i),
    itemValues: Array.from({ length: Math.min(n + 1, 15) }, (_, i) => `F(${i})`),
    message: `Computing Fibonacci(${n}). Base: F(0)=0, F(1)=1`
  });

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];

    steps.push({
      dpTable: [dp.slice(0, Math.min(n + 1, 15))],
      currentItem: 0,
      currentCapacity: Math.min(i, 14),
      itemWeights: Array.from({ length: Math.min(n + 1, 15) }, (_, idx) => idx),
      itemValues: Array.from({ length: Math.min(n + 1, 15) }, (_, idx) => `F(${idx})`),
      message: `F(${i}) = F(${i - 1}) + F(${i - 2}) = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`
    });
  }

  steps.push({
    dpTable: [dp.slice(0, Math.min(n + 1, 15))],
    currentItem: 0,
    currentCapacity: Math.min(n, 14),
    itemWeights: Array.from({ length: Math.min(n + 1, 15) }, (_, i) => i),
    itemValues: Array.from({ length: Math.min(n + 1, 15) }, (_, i) => `F(${i})`),
    message: `✅ Fibonacci complete! F(${n}) = ${dp[n]}`
  });

  return steps;
}
