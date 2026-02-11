"""
AlgoLabX AI Mentor — Vercel Serverless Entry
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

from .prompts import (
    SYSTEM_INSTRUCTION,
    build_doubt_prompt,
    build_explain_prompt,
    build_recommend_prompt,
)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
# load_dotenv() # Not strictly needed on Vercel as env vars are injected

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# On Vercel, we might not want to raise RuntimeError during import if we want 
# the app to at least "load". We'll validate inside the route.

client = None
if GROQ_API_KEY:
    client = Groq(api_key=GROQ_API_KEY)

app = Flask(__name__)
# Allow CORS for local dev. On production Vercel, calls are usually same-origin.
CORS(app) 

# ---------------------------------------------------------------------------
# Rate Limiting (in-memory, note: resets on every serverless cold start)
# ---------------------------------------------------------------------------
RATE_LIMIT = 10          # requests
RATE_WINDOW = 60         # seconds

_request_log = defaultdict(list)


def rate_limit(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        ip = request.remote_addr or "unknown"
        now = time.time()
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
    if not GROQ_API_KEY:
        return jsonify({"error": "GROQ_API_KEY is not configured in Vercel environment variables."}), 500

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON."}), 400

    mode = data.get("mode", "").strip().lower()
    if mode not in PROMPT_BUILDERS:
        return jsonify({
            "error": f"Invalid mode '{mode}'. Use one of: doubt, explain, recommend."
        }), 400

    if mode in ("doubt", "recommend") and not data.get("user_query", "").strip():
        return jsonify({"error": "user_query is required for this mode."}), 400
    if mode == "explain" and not data.get("code_snippet", "").strip():
        return jsonify({"error": "code_snippet is required for explain mode."}), 400

    try:
        prompt = PROMPT_BUILDERS[mode](data)

        # Ensure client is initialized
        global client
        if not client:
            client = Groq(api_key=GROQ_API_KEY)

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


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "AlgoLabX AI Mentor (Vercel)"})

# Export for Vercel
# app = app
