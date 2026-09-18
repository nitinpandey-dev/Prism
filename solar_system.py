"""
================================================================================
PURE-PYTHON 3D SOLAR SYSTEM SIMULATION
================================================================================
Library Chosen: VPython (Visual Python / vpython)
Why VPython was chosen for this "Python-only" constraint:
--------------------------------------------------------------------------------
1. 100% Pure-Python Control:
   Every single aspect of this simulation — the 3D WebGL scene graph, Keplerian
   celestial mechanics, lighting calculations, continuous planetary rotation,
   interactive camera navigation, and UI control panel widgets — is written,
   configured, and executed strictly in Python.

2. Zero HTML/CSS/JavaScript Required:
   When executed via standard `python3 solar_system.py`, VPython automatically
   initializes an internal WebSocket/HTTP server and launches the user's default
   web browser. It streams 3D WebGL render instructions and bi-directional widget
   events over WebSockets without requiring hand-written web code or templates.

3. Native Physics, Vector Math & Real-Time Engine:
   VPython provides native 3D vector operations (`vector`), smooth physics
   timestep pacing (`rate(60)`), point lights, 3D curves/trails, and built-in
   browser UI widgets (`button`, `slider`, `menu`, `checkbox`, `wtext`).

4. Built-in Native Camera Controls:
   - Orbit/Rotate: Right-click & drag (or Ctrl + left-click & drag)
   - Zoom: Scroll wheel (or middle-click drag, or Alt + left-click drag)
   - Pan: Shift + left-click & drag
================================================================================
"""

import math
import os
import random
import sys

# Ensure consistent, predictable localhost port 8000 by default
os.environ.setdefault("VPYTHON_HTTP_PORT", "8000")
os.environ.setdefault("VPYTHON_NO_LAUNCH_BROWSER", "1")

import vpython as vp

# Prevent VPython from auto-killing the process when a browser tab closes or refreshes
try:
    import vpython.no_notebook as _nb
    def _safe_on_close(self, wasClean, code, reason):
        self.connection = None
    _nb.WSserver.onClose = _safe_on_close
except Exception:
    pass


# ==============================================================================
# 1. SIMULATION CONSTANTS & SCALING CONFIGURATION
# ==============================================================================
# To allow both inner planets (Mercury-Mars) and outer giants (Jupiter-Neptune)
# to be comfortably viewable on screen at the same time, we employ calibrated
# semi-major axis scaling, balanced planetary radii, and relative Keplerian velocities.

BASE_TIME_STEP = 0.015  # Base simulation dt per frame at 60 FPS
MAX_SPEED_MULT = 5.0
MIN_SPEED_MULT = 0.1

# Planet data dictionary
# - 'a': semi-major axis (scaled units)
# - 'e': orbital eccentricity (simplified Keplerian ellipse)
# - 'radius': visual body radius (scaled units)
# - 'color': RGB tuple in [0, 1]
# - 'period_days': orbital period (Earth days)
# - 'rot_period_hrs': axial rotation period (Earth hours, negative = retrograde)
# - 'tilt_deg': axial tilt relative to orbital plane (degrees)
# - 'real_dist_au': astronomical distance in AU (for HUD telemetry)
# - 'real_diam_km': actual diameter in km (for HUD telemetry)
# - 'info': descriptive scientific summary

PLANETS_DATA = {
    "Mercury": {
        "a": 12.0,
        "e": 0.2056,
        "radius": 0.65,
        "color": vp.vec(0.72, 0.70, 0.68),
        "period_days": 87.97,
        "rot_period_hrs": 1407.6,
        "tilt_deg": 0.03,
        "real_dist_au": "0.39 AU",
        "real_diam_km": "4,879 km",
        "info": "Smallest planet, heavily cratered, fastest orbital velocity."
    },
    "Venus": {
        "a": 18.0,
        "e": 0.0067,
        "radius": 1.25,
        "color": vp.vec(0.92, 0.78, 0.48),
        "period_days": 224.70,
        "rot_period_hrs": -5832.5,  # Retrograde rotation
        "tilt_deg": 177.3,
        "real_dist_au": "0.72 AU",
        "real_diam_km": "12,104 km",
        "info": "Thick toxic atmosphere with extreme greenhouse effect and retrograde spin."
    },
    "Earth": {
        "a": 25.0,
        "e": 0.0167,
        "radius": 1.35,
        "color": vp.vec(0.20, 0.58, 0.95),
        "period_days": 365.25,
        "rot_period_hrs": 23.93,
        "tilt_deg": 23.44,
        "real_dist_au": "1.00 AU",
        "real_diam_km": "12,742 km",
        "info": "Our home planet; harboring liquid water, life, and a prominent Moon."
    },
    "Mars": {
        "a": 33.0,
        "e": 0.0934,
        "radius": 0.85,
        "color": vp.vec(0.88, 0.38, 0.22),
        "period_days": 686.98,
        "rot_period_hrs": 24.62,
        "tilt_deg": 25.19,
        "real_dist_au": "1.52 AU",
        "real_diam_km": "6,779 km",
        "info": "The Red Planet; home to Olympus Mons and extensive ancient river valleys."
    },
    "Jupiter": {
        "a": 48.0,
        "e": 0.0484,
        "radius": 3.40,
        "color": vp.vec(0.85, 0.66, 0.48),
        "period_days": 4332.59,  # ~11.86 Earth years
        "rot_period_hrs": 9.93,
        "tilt_deg": 3.13,
        "real_dist_au": "5.20 AU",
        "real_diam_km": "139,820 km",
        "info": "Largest planet in the solar system, famous for its Great Red Spot."
    },
    "Saturn": {
        "a": 65.0,
        "e": 0.0541,
        "radius": 2.85,
        "color": vp.vec(0.92, 0.84, 0.60),
        "period_days": 10759.22,  # ~29.45 Earth years
        "rot_period_hrs": 10.70,
        "tilt_deg": 26.73,
        "real_dist_au": "9.58 AU",
        "real_diam_km": "116,460 km",
        "info": "Gas giant adorned with an exquisite, wide icy ring system."
    },
    "Uranus": {
        "a": 82.0,
        "e": 0.0472,
        "radius": 2.05,
        "color": vp.vec(0.48, 0.85, 0.88),
        "period_days": 30685.4,  # ~84 Earth years
        "rot_period_hrs": -17.24,  # Retrograde
        "tilt_deg": 97.77,
        "real_dist_au": "19.22 AU",
        "real_diam_km": "50,724 km",
        "info": "Ice giant rotating on its side with extreme 98° axial tilt."
    },
    "Neptune": {
        "a": 98.0,
        "e": 0.0086,
        "radius": 1.95,
        "color": vp.vec(0.22, 0.42, 0.95),
        "period_days": 60189.0,  # ~164.8 Earth years
        "rot_period_hrs": 16.11,
        "tilt_deg": 28.32,
        "real_dist_au": "30.05 AU",
        "real_diam_km": "49,244 km",
        "info": "Deep blue, windiest world in the Solar System with supersonic gales."
    }
}


# ==============================================================================
# 2. SCENE INITIALIZATION & LIGHTING SETUP
# ==============================================================================
def create_simulation_scene():
    """Configures the 3D VPython viewport canvas and realistic central star lighting."""
    scene = vp.canvas(
        title="<h2 style='margin:0; font-family:sans-serif; color:#ffcc00;'>☀️ Pure-Python 3D Solar System Simulation</h2>"
              "<p style='margin:2px 0 10px 0; font-family:sans-serif; color:#aaa; font-size:13px;'>"
              "Rendered natively via VPython WebGL • Zero HTML/JS/CSS • Keplerian Mechanics & Interactive Controls</p>",
        width=1100,
        height=680,
        center=vp.vec(0, 0, 0),
        forward=vp.vec(-0.5, -0.7, -0.6),
        up=vp.vec(0, 1, 0),
        background=vp.vec(0.015, 0.015, 0.035),  # Deep space dark indigo
        range=115
    )

    # Disable default distant lights and configure realistic central solar illumination
    scene.lights = []
    
    # Subtle ambient light so unlit sides of planets remain visible against deep space
    scene.ambient = vp.vec(0.22, 0.22, 0.26)
    
    # Brilliant omnidirectional point light radiating from the Sun at (0, 0, 0)
    sun_light = vp.local_light(pos=vp.vec(0, 0, 0), color=vp.vec(1.0, 0.98, 0.90))

    return scene, sun_light


# ==============================================================================
# 3. CELESTIAL BODIES BUILDER (SUN, PLANETS, RINGS, MOON, STARFIELD)
# ==============================================================================
def build_starfield(count=400, min_dist=170, max_dist=240):
    """Generates a distant 3D glowing starfield surrounding the solar system."""
    star_positions = []
    for _ in range(count):
        # Generate random spherical coordinates
        theta = random.uniform(0, 2 * math.pi)
        phi = math.acos(random.uniform(-1, 1))
        dist = random.uniform(min_dist, max_dist)
        
        x = dist * math.sin(phi) * math.cos(theta)
        y = dist * math.sin(phi) * math.sin(theta)
        z = dist * math.cos(phi)
        star_positions.append(vp.vec(x, y, z))

    # Single batch points object for top rendering performance
    starfield = vp.points(
        pos=star_positions,
        radius=1.8,
        color=vp.vec(0.9, 0.92, 1.0),
        emissive=True
    )
    return starfield


def build_sun():
    """Constructs the central Sun with glowing emissive core and corona aura."""
    # Main glowing body
    sun = vp.sphere(
        pos=vp.vec(0, 0, 0),
        radius=5.6,
        color=vp.vec(1.0, 0.78, 0.15),
        emissive=True,
        shininess=0
    )
    
    # Outer subtle translucent corona glow layer
    corona = vp.sphere(
        pos=vp.vec(0, 0, 0),
        radius=6.4,
        color=vp.vec(1.0, 0.60, 0.05),
        opacity=0.25,
        emissive=True,
        shininess=0
    )
    
    return sun, corona


def build_orbit_path(a, e, color_vec, segments=160):
    """
    Constructs a closed 3D elliptical orbit trajectory curve using Keplerian formula:
    r(theta) = a * (1 - e^2) / (1 + e * cos(theta))
    """
    pts = []
    for i in range(segments + 1):
        th = (2 * math.pi * i) / segments
        r = a * (1.0 - e**2) / (1.0 + e * math.cos(th))
        x = r * math.cos(th)
        z = r * math.sin(th)
        pts.append(vp.vec(x, 0, z))
    
    orbit_curve = vp.curve(
        pos=pts,
        color=color_vec,
        radius=0.10,
        opacity=0.45,
        emissive=True
    )
    return orbit_curve


class PlanetBody:
    """
    Encapsulates a planet's 3D mesh, axial tilt, spin orientation,
    Keplerian orbital kinematics, and UI label.
    """
    def __init__(self, name, data):
        self.name = name
        self.a = data["a"]
        self.e = data["e"]
        self.radius = data["radius"]
        self.color_vec = data["color"]
        self.period_days = data["period_days"]
        self.rot_period_hrs = data["rot_period_hrs"]
        self.tilt_rad = math.radians(data["tilt_deg"])
        self.data = data

        # Calibrated orbital angular velocity (Kepler's 3rd Law harmonic scaling)
        # Earth takes 1.0 relative standard year
        self.mean_motion = (2.0 * math.pi) / (math.sqrt(self.a**3) * 0.075)

        # Axial rotation speed (radians per sim time unit)
        if self.rot_period_hrs != 0:
            self.spin_rate = (24.0 / self.rot_period_hrs) * 0.08
        else:
            self.spin_rate = 0.02

        # True anomaly angle theta (rad)
        self.theta = random.uniform(0, 2 * math.pi)
        
        # Calculate initial position
        self.pos = self.calc_kepler_pos(self.theta)

        # Construct 3D body sphere
        self.sphere = vp.sphere(
            pos=self.pos,
            radius=self.radius,
            color=self.color_vec,
            shininess=0.3,
            make_trail=False,
            retain=80
        )

        # Configure axial tilt vector (tilted in y-z plane)
        self.tilt_axis = vp.vec(
            0,
            math.cos(self.tilt_rad),
            math.sin(self.tilt_rad)
        ).norm()
        self.sphere.axis = self.tilt_axis * (self.radius * 2.0)

        # Orbital path curve
        self.orbit_curve = build_orbit_path(self.a, self.e, self.color_vec * 0.75)

        # 3D Billboard label
        self.label = vp.label(
            pos=self.pos,
            text=self.name,
            xoffset=0,
            yoffset=int(self.radius * 12 + 10),
            space=0,
            height=11,
            border=2,
            box=False,
            opacity=0.0,
            color=self.color_vec,
            font="sans"
        )

        # Special feature: Saturn's Rings
        self.rings = []
        if self.name == "Saturn":
            # Multi-layered concentric rings with varying radii & subtle opacity
            ring_bands = [
                (3.4, 4.4, vp.vec(0.85, 0.75, 0.55), 0.70),
                (4.5, 5.3, vp.vec(0.75, 0.65, 0.48), 0.85),
                (5.4, 6.2, vp.vec(0.65, 0.58, 0.42), 0.45)
            ]
            for inner_r, outer_r, ring_color, ring_opac in ring_bands:
                mid_r = (inner_r + outer_r) / 2.0
                thick = (outer_r - inner_r) / 2.0
                r_obj = vp.ring(
                    pos=self.pos,
                    axis=self.tilt_axis,
                    radius=mid_r,
                    thickness=thick,
                    color=ring_color,
                    opacity=ring_opac
                )
                self.rings.append(r_obj)

        # Special feature: Earth's Moon
        self.moon = None
        self.moon_theta = 0.0
        if self.name == "Earth":
            self.moon = vp.sphere(
                pos=self.pos + vp.vec(2.8, 0.4, 0),
                radius=0.35,
                color=vp.vec(0.82, 0.82, 0.82),
                shininess=0.1
            )

    def calc_kepler_pos(self, theta):
        """Calculates 3D position vector from true anomaly using Kepler's orbit equation."""
        r = self.a * (1.0 - self.e**2) / (1.0 + self.e * math.cos(theta))
        x = r * math.cos(theta)
        z = r * math.sin(theta)
        return vp.vec(x, 0, z)

    def update_kinematics(self, dt):
        """
        Advances orbital angle according to Kepler's 2nd Law (dtheta/dt ~ h / r^2),
        updates body positions, axial spins, rings, and moons.
        """
        # Current distance from Sun
        r = self.a * (1.0 - self.e**2) / (1.0 + self.e * math.cos(self.theta))
        
        # Kepler's 2nd Law: Angular velocity varies inversely with square of distance
        # dtheta/dt = (mean_motion * a^2 * sqrt(1 - e^2)) / r^2
        h = self.mean_motion * (self.a**2) * math.sqrt(max(0.0001, 1.0 - self.e**2))
        d_theta = (h / (r**2)) * dt
        self.theta = (self.theta + d_theta) % (2.0 * math.pi)

        # Update 3D position
        self.pos = self.calc_kepler_pos(self.theta)
        self.sphere.pos = self.pos
        self.label.pos = self.pos

        # Update planet axial spin rotation
        self.sphere.rotate(angle=self.spin_rate * dt * 40.0, axis=self.tilt_axis)

        # Update Saturn Rings position
        for r_obj in self.rings:
            r_obj.pos = self.pos

        # Update Earth Moon orbit
        if self.moon:
            self.moon_theta = (self.moon_theta + 5.5 * dt) % (2.0 * math.pi)
            moon_r = 2.7
            moon_offset = vp.vec(
                moon_r * math.cos(self.moon_theta),
                0.4 * math.sin(self.moon_theta),
                moon_r * math.sin(self.moon_theta)
            )
            self.moon.pos = self.pos + moon_offset

    def set_orbits_visible(self, visible):
        """Toggles visibility of the orbital trajectory path."""
        self.orbit_curve.visible = visible

    def set_labels_visible(self, visible):
        """Toggles visibility of the name label tag."""
        self.label.visible = visible


# ==============================================================================
# 4. SIMULATION CONTROLLER & PURE-PYTHON UI PANEL
# ==============================================================================
class SimulationController:
    """
    Manages interactive simulation state (play/pause, speed multiplier, camera focus)
    and dispatches pure-Python GUI widgets below the 3D scene.
    """
    def __init__(self, scene, planets_map, sun):
        self.scene = scene
        self.planets_map = planets_map
        self.sun = sun

        self.is_paused = False
        self.speed_multiplier = 1.0
        self.focused_target_name = "Sun (Overview)"
        self.show_orbits = True
        self.show_labels = True

        self.speed_readout = None
        self.target_menu = None
        self.hud_text = None

    def toggle_pause(self, btn):
        """Toggles simulation play / pause state."""
        self.is_paused = not self.is_paused
        if self.is_paused:
            btn.text = "▶ Play"
            btn.background = vp.vec(0.2, 0.6, 0.2)
        else:
            btn.text = "⏸ Pause"
            btn.background = vp.vec(0.7, 0.2, 0.2)

    def on_speed_slider(self, s):
        """Adjusts simulation speed multiplier from slider value."""
        self.speed_multiplier = float(s.value)
        self.speed_readout.text = f" <b>{self.speed_multiplier:.2f}x</b> "

    def on_target_select(self, m):
        """Updates camera focus target to Sun or a specific planet."""
        self.focused_target_name = m.selected
        self.update_camera_and_hud()

    def on_toggle_orbits(self, cb):
        """Toggles orbital paths visibility."""
        self.show_orbits = cb.checked
        for p in self.planets_map.values():
            p.set_orbits_visible(self.show_orbits)

    def on_toggle_labels(self, cb):
        """Toggles planet label tags visibility."""
        self.show_labels = cb.checked
        for p in self.planets_map.values():
            p.set_labels_visible(self.show_labels)

    def reset_view(self, btn):
        """Restores default wide-angle solar system perspective."""
        self.focused_target_name = "Sun (Overview)"
        self.target_menu.selected = "Sun (Overview)"
        self.scene.center = vp.vec(0, 0, 0)
        self.scene.forward = vp.vec(-0.5, -0.7, -0.6)
        self.scene.range = 115
        self.update_camera_and_hud()

    def update_camera_and_hud(self):
        """Updates camera center tracking and dynamically renders telemetry HUD."""
        if self.focused_target_name == "Sun (Overview)":
            self.scene.center = vp.vec(0, 0, 0)
            self.hud_text.text = (
                "<div style='background:rgba(20,25,35,0.85); padding:10px 14px; border-radius:6px; "
                "border:1px solid #3a4a60; font-family:monospace; color:#eee; line-height:1.5; font-size:13px;'>"
                "<span style='color:#ffcc00; font-weight:bold; font-size:14px;'>☀️ Solar System Overview</span><br/>"
                "• Central Star: <b>The Sun</b> (G-type main-sequence)<br/>"
                "• Total Planets: <b>8 Major Planets + Planetary Moons & Rings</b><br/>"
                "• Mechanics: <b>Keplerian Elliptical Orbits & Conservation of Angular Momentum</b><br/>"
                "• Camera Navigation: <b>Right-click drag to rotate • Scroll to zoom • Shift+drag to pan</b>"
                "</div>"
            )
        elif self.focused_target_name in self.planets_map:
            p = self.planets_map[self.focused_target_name]
            # Smoothly follow the planet's position
            self.scene.center = p.pos
            
            # Current distance and speed metrics
            curr_dist = p.pos.mag
            c_rgb = p.color_vec
            hex_col = f"#{int(c_rgb.x*255):02x}{int(c_rgb.y*255):02x}{int(c_rgb.z*255):02x}"

            self.hud_text.text = (
                f"<div style='background:rgba(20,25,35,0.85); padding:10px 14px; border-radius:6px; "
                f"border:1px solid {hex_col}; font-family:monospace; color:#eee; line-height:1.5; font-size:13px;'>"
                f"<span style='color:{hex_col}; font-weight:bold; font-size:15px;'>🪐 {p.name} Telemetry</span><br/>"
                f"• Semi-Major Axis (a): <b>{p.a:.1f} units</b> ({p.data['real_dist_au']})<br/>"
                f"• Orbital Eccentricity (e): <b>{p.e:.4f}</b> (Elliptical factor)<br/>"
                f"• Orbital Period (1 Year): <b>{p.period_days:.1f} Earth days</b><br/>"
                f"• Axial Rotation (1 Day): <b>{p.rot_period_hrs:.1f} Earth hours</b> (Tilt: {p.data['tilt_deg']}°)<br/>"
                f"• Real Diameter: <b>{p.data['real_diam_km']}</b><br/>"
                f"• Summary: <i>{p.data['info']}</i>"
                f"</div>"
            )


def setup_controls(scene, planets_map, sun):
    """Initializes the pure-Python interactive control bar and telemetry HUD below canvas."""
    ctrl = SimulationController(scene, planets_map, sun)

    scene.append_to_caption("<hr style='border:0; border-top:1px solid #334; margin:10px 0;'>")
    scene.append_to_caption("<b style='color:#ffcc00; font-family:sans-serif;'>🕹️ Simulation Controls: &nbsp;</b>")

    # 1. Play / Pause Button
    play_pause_btn = vp.button(
        text="⏸ Pause",
        bind=ctrl.toggle_pause,
        background=vp.vec(0.7, 0.2, 0.2)
    )
    scene.append_to_caption(" &nbsp;&nbsp; ")

    # 2. Speed Slider & Multiplier Readout
    scene.append_to_caption("<span style='color:#ccc; font-family:sans-serif;'>Speed: </span>")
    speed_slider = vp.slider(
        min=MIN_SPEED_MULT,
        max=MAX_SPEED_MULT,
        value=1.0,
        step=0.1,
        bind=ctrl.on_speed_slider
    )
    scene.append_to_caption(" ")
    ctrl.speed_readout = vp.wtext(text=" <b>1.00x</b> ")
    scene.append_to_caption(" &nbsp;&nbsp;&nbsp;&nbsp; ")

    # 3. Planet Focus Dropdown Menu
    scene.append_to_caption("<span style='color:#ccc; font-family:sans-serif;'>Focus Target: </span>")
    target_choices = ["Sun (Overview)"] + list(planets_map.keys())
    ctrl.target_menu = vp.menu(
        choices=target_choices,
        selected="Sun (Overview)",
        bind=ctrl.on_target_select
    )
    scene.append_to_caption(" &nbsp;&nbsp; ")

    # 4. Reset View Button
    vp.button(
        text="🔄 Reset View",
        bind=ctrl.reset_view
    )
    scene.append_to_caption(" &nbsp;&nbsp;&nbsp;&nbsp; ")

    # 5. Checkboxes for toggling overlays
    vp.checkbox(
        text=" Show Orbit Paths",
        checked=True,
        bind=ctrl.on_toggle_orbits
    )
    scene.append_to_caption(" &nbsp;&nbsp; ")

    vp.checkbox(
        text=" Show Planet Labels",
        checked=True,
        bind=ctrl.on_toggle_labels
    )

    # 6. Real-time Telemetry HUD Panel
    scene.append_to_caption("<div style='margin-top:12px;'></div>")
    ctrl.hud_text = vp.wtext(text="")
    ctrl.update_camera_and_hud()

    return ctrl


# ==============================================================================
# 5. MAIN SIMULATION ENTRY POINT & ANIMATION LOOP
# ==============================================================================
def main():
    import vpython.no_notebook as _nb
    http_port = getattr(_nb, '__HTTP_PORT', None)
    print("=" * 70)
    print("Starting Pure-Python 3D Solar System Simulation...")
    if http_port:
        print(f"Interactive 3D UI URL: http://localhost:{http_port} (or http://127.0.0.1:{http_port})")
    print("Opening browser tab via VPython native WebSocket bridge...")
    print("Controls: Right-Click Drag = Rotate | Scroll = Zoom | Shift+Drag = Pan")
    print("=" * 70)

    # 1. Initialize 3D Viewport
    scene, sun_light = create_simulation_scene()

    # 2. Build Starfield & Central Star
    starfield = build_starfield(count=450)
    sun, corona = build_sun()

    # 3. Construct All 8 Planets + Rings + Moons
    planets_map = {}
    for name, data in PLANETS_DATA.items():
        planets_map[name] = PlanetBody(name, data)

    # 4. Attach Pure-Python UI Control Panel & HUD
    controller = setup_controls(scene, planets_map, sun)

    # 5. Main Real-time Animation Loop (60 FPS)
    sim_time = 0.0
    while True:
        # Pacing governor: 60 iterations per second
        vp.rate(60)

        # If running (not paused), advance physics and kinematics
        if not controller.is_paused:
            effective_dt = BASE_TIME_STEP * controller.speed_multiplier
            sim_time += effective_dt

            # Update all planetary kinematics & axial rotations
            for planet in planets_map.values():
                planet.update_kinematics(effective_dt)

            # Subtle sun rotation and corona pulsation
            sun.rotate(angle=0.003 * controller.speed_multiplier, axis=vp.vec(0, 1, 0))
            corona.radius = 6.4 + 0.15 * math.sin(sim_time * 2.0)

            # Keep camera tracked if focused on a moving planet
            if controller.focused_target_name in planets_map:
                p = planets_map[controller.focused_target_name]
                scene.center = p.pos


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nSimulation stopped by user.")
        sys.exit(0)
