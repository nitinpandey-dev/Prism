# ☀️ Pure-Python 3D Solar System Simulation

A complete, interactive, browser-viewable **3D Solar System Simulation** built **100% in Python** — with **no manual HTML, CSS, or JavaScript written anywhere in the stack**.

---

## 🚀 Why VPython? (Library Justification)

This project strictly uses **VPython** (`vpython`) to satisfy the **Python-only** constraint:

1. **100% Python-Controlled Stack**:
   All 3D WebGL geometry, physics calculations (Keplerian orbits, angular momentum conservation, axial spins), lighting, real-time animation loops, and UI control panel widgets are declared and manipulated strictly in Python.
2. **Zero Hand-Written Web Code**:
   When you run `python3 solar_system.py`, VPython automatically spins up a local WebSocket/HTTP server and launches your default web browser tab. It streams WebGL rendering commands and UI events directly over WebSockets without requiring any custom HTML/JS templates.
3. **Built-in Native 3D Camera Controls**:
   VPython provides out-of-the-box interactive 3D navigation in the browser without writing any JavaScript mouse event handlers.
4. **Pure-Python UI Widgets**:
   Interactive controls (buttons, sliders, dropdown menus, checkboxes, and dynamic captions) are instantiated and bound to Python callbacks directly.

---

## 🪐 Features

- **Central Star (The Sun)**:
  - Emissive glowing sphere with a pulsating coronal layer.
  - Realistic point-light source positioned at the origin that illuminates planets with natural day/night terminator shadows.
- **All 8 Major Planets**:
  - **Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune**.
  - Distinct realistic colors, scaled radii, and axial tilts (e.g. Earth at 23.44°, Uranus at 97.77°, Venus retrograde spin).
- **Keplerian Orbital Mechanics**:
  - True elliptical orbits calculated using the polar Keplerian equation:
    $$r(\theta) = \frac{a(1 - e^2)}{1 + e \cos(\theta)}$$
  - Variable orbital velocity following Kepler's 2nd Law (conservation of angular momentum: $\frac{d\theta}{dt} \propto \frac{1}{r^2}$).
  - Harmonic orbital periods adhering to Kepler's 3rd Law ($T \propto a^{3/2}$).
- **Special Astrodynamic Features**:
  - **Saturn's Ring System**: Multi-layered concentric rings tilted along Saturn's rotational axis.
  - **Earth's Moon**: Hierarchical 3D orbit around Earth.
  - **Starfield Background**: 450+ randomly distributed 3D glowing background stars.
  - **Orbital Trajectory Curves**: Smooth elliptical guide curves.
  - **3D Planet Labels**: Attached dynamic billboard text name tags.
- **Pure-Python Interactive Control Panel**:
  - ⏸ **Play / Pause Button**: Freeze or resume time evolution.
  - 🎚 **Simulation Speed Slider**: Smoothly adjust speed from 0.1x to 5.0x with real-time multiplier readout.
  - 🎯 **Focus Target Dropdown Menu**: Center and track the camera on the Sun or any individual planet for close-up inspection.
  - 🔄 **Reset View Button**: Restores the default wide solar system perspective.
  - ☑️ **Show Orbit Paths Checkbox**: Toggle visibility of orbital ellipse guide curves.
  - ☑️ **Show Planet Labels Checkbox**: Toggle 3D planet name tags.
  - 📊 **Live Astronomical Telemetry HUD**: Real-time stats for the focused body (semi-major axis, orbital eccentricity, orbital period, rotational period, real diameter, and astronomical description).

---

## 🎮 Camera Controls (Native in Browser)

| Action | Control |
| :--- | :--- |
| **Orbit / Rotate** | **Right-click + drag** (or `Ctrl` + Left-click + drag) |
| **Zoom In / Out** | **Scroll wheel** (or Middle-click + drag / `Alt` + Left-click + drag) |
| **Pan Camera** | **`Shift` + Left-click + drag** |

---

## 🛠️ Installation & Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```
*(Or directly: `pip install vpython "setuptools<70"`)*

### 2. Run the Simulation
```bash
python3 solar_system.py
```

Your default web browser will automatically open a new tab rendering the full 3D interactive Solar System simulation!

---

## 📂 Project Structure

```
Prism/
├── solar_system.py      # Main self-contained 3D simulation script
├── requirements.txt     # Python dependency specifications
└── README.md            # Documentation and control guide
```
