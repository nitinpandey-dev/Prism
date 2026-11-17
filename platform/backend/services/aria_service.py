"""
PRISM ARIA Service (Backend AI Companion)
=========================================
Handles Socratic dialogue generation, pedagogical guidance, and contextual physics reasoning.
Maintains API keys strictly on the backend.
"""
import os
import json
from typing import Dict, Any, Optional
import httpx


SYSTEM_PROMPT = """You are ARIA (Autonomous Research and Intelligence Assistant), the embedded pedagogical AI companion on the PRISM STEM platform.
You are currently assisting a researcher on Kepler-186f at Outpost Theta.
An ion storm has damaged the microwave communication array.
The student must launch an emergency rescue transponder canister across a 120-meter ravine to land in Emergency Relay Funnel #4.

PEDAGOGICAL PRINCIPLES:
1. Socratic Guidance: Never just blurt out the final numerical answers. Guide the student to think through the kinematic equations.
2. Scientific Rigor: Explain velocity decomposition: v_x = v0 * cos(theta), v_y = v0 * sin(theta) - g*t. Explain why launching to a LOWER elevation (Δy = -10.5m) shifts optimal angle below 45°.
3. Keplerian Environment: Acknowledge Kepler-186f conditions (gravity = 9.81 m/s² or 12.1 m/s² in university mode, atmospheric drag).
4. Tone: Encouraging, articulate, scientific, supportive. Keep replies concise (2-4 sentences max).
"""


def generate_aria_response(question: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    context = context or {}
    q_lower = question.lower()

    # 1. Check for backend LLM API key
    gemini_key = os.getenv("GEMINI_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")

    if gemini_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            payload = {
                "contents": [
                    {
                        "role": "user",
                        "parts": [
                            {"text": f"{SYSTEM_PROMPT}\n\nContext: {json.dumps(context)}\n\nStudent Question: {question}"}
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.4,
                    "maxOutputTokens": 200
                }
            }
            with httpx.Client(timeout=5.0) as client:
                res = client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    reply = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                    return {"reply": reply, "mood": "guiding", "provider": "gemini"}
        except Exception:
            pass  # fallback to local Socratic expert engine below

    # 2. Local Pedagogical Socratic Expert Engine (Zero API Key Required)
    mission_id = context.get("missionId", "")
    
    # ── Skating Challenge (PHY-ACT-001) Pedagogical Responses ──
    if mission_id == "PHY-ACT-001" or any(k in q_lower for k in ["skat", "friction", "slip", "rough", "brake", "stop"]):
        if "formula" in q_lower or "equation" in q_lower or "distance" in q_lower:
            reply = (
                "The scientific stopping distance formula is: d = v₀² / (2 · μ · g). "
                "Notice that stopping distance is proportional to the square of initial velocity (v₀²) "
                "and inversely proportional to the friction coefficient μ!"
            )
            mood = "analyzing"
        elif "force" in q_lower or "n=" in q_lower or "normal" in q_lower:
            reply = (
                "Friction force on a horizontal surface is: F = μ · N, where Normal force N = m · g. "
                "Because deceleration is a = F / m = (μ · m · g) / m = μ · g, Alex's deceleration depends strictly on friction and gravity!"
            )
            mood = "analyzing"
        elif "slip" in q_lower or "longer" in q_lower or "why" in q_lower:
            reply = (
                "Great question! In our simplified model, the slippery surface has a small braking coefficient (μ = 0.15). "
                "Less friction means lower deceleration (a = 1.47 m/s²), which allows Alex to travel much farther before coming to a stop."
            )
            mood = "guiding"
        elif "rough" in q_lower or "faster" in q_lower or "quick" in q_lower:
            reply = (
                "The rough surface has the highest braking resistance (μ = 0.75), yielding a high deceleration of ~7.36 m/s². "
                "This brings Alex to an abrupt stop in just a few meters."
            )
            mood = "guiding"
        else:
            reply = (
                "Welcome to the Skating Challenge! Experiment with different initial speeds and track surfaces. "
                "Observe how changing the friction coefficient μ alters Alex's stopping distance."
            )
            mood = "guiding"
        return {"reply": reply, "mood": mood, "provider": "local_socratic_engine"}

    # ── Outpost Launcher (PHY-001) Pedagogical Responses ──
    angle = context.get("launchAngle", 42.0)
    speed = context.get("initialSpeed", 34.0)
    miss = context.get("missDistance", None)

    if "angle" in q_lower or "theta" in q_lower or "45" in q_lower:
        reply = (
            "On a flat horizontal plane, 45° maximizes range. But our target funnel is 10.5 meters BELOW our launch platform! "
            "Launching downwards gives vertical velocity extra flight time to develop, meaning a shallower angle (around 40° to 42°) "
            "yields superior horizontal range. Try calibrating to 41.5°!"
        )
        mood = "guiding"
    elif "velocity" in q_lower or "speed" in q_lower or "fast" in q_lower:
        reply = (
            "Initial velocity v₀ directly determines the kinetic energy supplied to the canister (E_k = 0.5 * m * v₀²). "
            "The distance across the canyon is ~108 meters down-range. At an angle of ~41.5°, an initial speed between "
            "33.5 and 35.0 m/s will land directly into the funnel."
        )
        mood = "guiding"
    elif "drag" in q_lower or "air" in q_lower or "university" in q_lower:
        reply = (
            "In University Mode, we simulate quadratic atmospheric drag (F_d = -0.5 * rho * Cd * A * v²). "
            "Because drag dissipates velocity continuously, the trajectory is no longer a symmetric parabola—the descent is steeper! "
            "You will need a slightly higher initial speed to reach the same downrange distance."
        )
        mood = "analyzing"
    elif "equation" in q_lower or "formula" in q_lower:
        reply = (
            "The governing 2D trajectory equation is: y(z) = y₀ + z*tan(θ) - [g * z²] / [2 * v₀² * cos²(θ)]. "
            "Notice how both initial speed and angle are coupled in the denominator!"
        )
        mood = "analyzing"
    elif "hint" in q_lower or "help" in q_lower:
        reply = (
            "Calibration telemetry recommendation: Set Launch Angle θ = 41.5° and Initial Speed v₀ = 34.2 m/s. "
            "Observe how the cyan trajectory curve intersects Relay Funnel #4!"
        )
        mood = "guiding"
    else:
        reply = (
            "To successfully establish the uplink, monitor your Miss Delta on the terminal readout. "
            "Adjust your elevation angle and velocity until the trajectory arc passes through the receiver funnel, then fire!"
        )
        mood = "guiding"

    return {"reply": reply, "mood": mood, "provider": "local_socratic_engine"}

