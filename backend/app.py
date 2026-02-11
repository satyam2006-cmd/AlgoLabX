"""
AlgoLabX AI Mentor — Flask Backend

Provides POST /api/ai/mentor endpoint that proxies structured DSA queries
to the Groq API (LLaMA 3 model) and returns clean JSON responses.
"""

import os
import time
import traceback
from collections import defaultdict
from functools import wraps

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from groq import Groq

from prompts import (
    SYSTEM_INSTRUCTION,
    build_doubt_prompt,
    build_explain_prompt,
    build_recommend_prompt,
)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is not set. Add it to backend/.env")

client = Groq(api_key=GROQ_API_KEY)

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

# ---------------------------------------------------------------------------
# Rate Limiting (in-memory, per-IP, 10 req/min)
# ---------------------------------------------------------------------------
RATE_LIMIT = 10          # requests
RATE_WINDOW = 60         # seconds

_request_log: dict[str, list[float]] = defaultdict(list)


def rate_limit(f):
    """Simple sliding-window rate limiter decorator."""
    @wraps(f)
    def decorated(*args, **kwargs):
        ip = request.remote_addr or "unknown"
        now = time.time()
        # Prune old entries
        _request_log[ip] = [t for t in _request_log[ip] if now - t < RATE_WINDOW]
        if len(_request_log[ip]) >= RATE_LIMIT:
            return jsonify({
                "error": "Rate limit exceeded. Please wait a minute before trying again."
            }), 429
        _request_log[ip].append(now)
        return f(*args, **kwargs)
    return decorated


# ---------------------------------------------------------------------------
# Prompt dispatcher
# ---------------------------------------------------------------------------
PROMPT_BUILDERS = {
    "doubt":     lambda d: build_doubt_prompt(d["user_query"], d.get("context", "")),
    "explain":   lambda d: build_explain_prompt(
                        d.get("code_snippet", ""),
                        d.get("user_query", ""),
                        d.get("context", ""),
                    ),
    "recommend": lambda d: build_recommend_prompt(d["user_query"], d.get("context", "")),
}


# ---------------------------------------------------------------------------
# API Route
# ---------------------------------------------------------------------------
@app.route("/api/ai/mentor", methods=["POST"])
@rate_limit
def ai_mentor():
    """
    POST /api/ai/mentor
    Body (JSON):
        mode:          "doubt" | "explain" | "recommend"
        user_query:    str   (required for doubt & recommend)
        code_snippet:  str   (required for explain)
        context:       str   (optional — e.g. current topic / visualizer)
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON."}), 400

    mode = data.get("mode", "").strip().lower()
    if mode not in PROMPT_BUILDERS:
        return jsonify({
            "error": f"Invalid mode '{mode}'. Use one of: doubt, explain, recommend."
        }), 400

    # Validate required fields per mode
    if mode in ("doubt", "recommend") and not data.get("user_query", "").strip():
        return jsonify({"error": "user_query is required for this mode."}), 400
    if mode == "explain" and not data.get("code_snippet", "").strip():
        return jsonify({"error": "code_snippet is required for explain mode."}), 400

    try:
        prompt = PROMPT_BUILDERS[mode](data)

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_INSTRUCTION},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=2048,
        )

        ai_text = response.choices[0].message.content

        if not ai_text:
            return jsonify({"error": "The AI returned an empty response. Please try again."}), 502

        return jsonify({
            "response": ai_text,
            "mode": mode,
        })

    except Exception as exc:
        traceback.print_exc()
        return jsonify({
            "error": f"AI service error: {str(exc)}",
        }), 502


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "AlgoLabX AI Mentor"})


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    print("🚀 AlgoLabX AI Mentor backend starting on http://localhost:5000")
    app.run(debug=True, port=5000)
