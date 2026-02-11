"""
Prompt construction logic for the AI DSA Mentor.

Each function returns a structured system instruction + user message
tailored for a specific mentor mode (doubt, explain, recommend).
"""

SYSTEM_INSTRUCTION = """You are **AlgoLabX AI Mentor**, an expert DSA teaching assistant.

Rules you MUST follow:
1. Be beginner-friendly — use simple language and analogies.
2. Structure every answer with clear headings using markdown (##, ###).
3. Always include time and space complexity where relevant, formatted as: **Time: O(...)** | **Space: O(...)**.
4. Use real-world analogies to make concepts stick.
5. When showing code, always specify the language in the code fence.
6. Keep answers concise but thorough — aim for clarity, not length.
7. If you are unsure, say so honestly.
8. Never produce harmful, unethical, or off-topic content.
9. Format your response in clean markdown."""


def build_doubt_prompt(user_query: str, context: str = "") -> str:
    """Build prompt for the Doubt Solver mode."""
    ctx_line = f"\nAdditional context: {context}" if context else ""
    return f"""The student has a DSA doubt. Answer it with the following structure:

## Concept Explanation
(Explain the concept clearly)

## How It Works
(Step-by-step walkthrough)

## Real-World Analogy
(A relatable analogy to help understand)

## Complexity Analysis
(Time and space complexity)

## Key Takeaways
(2-3 bullet points summarizing the essentials)

---
Student's question: {user_query}{ctx_line}"""


def build_explain_prompt(code_snippet: str, user_query: str = "", context: str = "") -> str:
    """Build prompt for the Code Explainer mode."""
    question_line = f"\nStudent's specific question: {user_query}" if user_query else ""
    ctx_line = f"\nAdditional context: {context}" if context else ""
    return f"""The student submitted code and wants it explained. Analyze it with this structure:

## What This Code Does
(Plain-English summary)

## Algorithm / Data Structure Identified
(Name the algorithm or data structure used)

## Step-by-Step Walkthrough
(Walk through the code logic)

## Complexity Analysis
- **Time Complexity:** O(...)
- **Space Complexity:** O(...)

## Possible Optimizations
(Suggest improvements if any, with brief explanations)

---
```
{code_snippet}
```{question_line}{ctx_line}"""


def build_recommend_prompt(user_query: str, context: str = "") -> str:
    """Build prompt for the Data Structure Recommender mode."""
    ctx_line = f"\nAdditional context: {context}" if context else ""
    return f"""The student describes a problem and needs a data structure recommendation. Respond with:

## Recommended Data Structure
(Name and brief description)

## Why This Choice
(Justify based on the student's requirements)

## How to Use It
(Brief usage pattern or pseudocode)

## Complexity Profile
| Operation | Time Complexity |
|-----------|----------------|
| Insert    | O(...)         |
| Search    | O(...)         |
| Delete    | O(...)         |

## Trade-offs vs Alternatives
(Compare with 2-3 alternative data structures, explaining trade-offs)

---
Student's requirements: {user_query}{ctx_line}"""
