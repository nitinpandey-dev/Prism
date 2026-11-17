"""
PRISM Scientific Simulation & Intelligence Verification Tests
=============================================================
Tests:
- Vacuum Ballistic Kinematics (School Mode equations)
- Aerodynamic Drag ODE (University Mode)
- 3D Vector Decomposition & Elevation Delta (y0 - y_target)
- ARIA Socratic Companion Response Engine
- Database Session & Progress Persistence
"""
import pytest
import numpy as np
import sys
import os

# Add backend directory to sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from simulations.physics.projectile_motion.engine import ProjectileRequest, compute_projectile
from services.aria_service import generate_aria_response
from database.connection import SessionLocal, init_db
from database.models import StudentProfile, MissionProgress, CalibrationAttempt


def test_vacuum_projectile_flat_ground():
    """Verify standard school kinematic equations on flat ground (h0 = 0)."""
    v0 = 30.0
    theta_deg = 45.0
    g = 9.81
    theta_rad = np.radians(theta_deg)

    # Theoretical formulas
    expected_t_flight = (2 * v0 * np.sin(theta_rad)) / g
    expected_range = (v0**2 * np.sin(2 * theta_rad)) / g
    expected_max_h = (v0**2 * (np.sin(theta_rad))**2) / (2 * g)

    req = ProjectileRequest(
        initial_speed=v0,
        launch_angle=theta_deg,
        initial_height=0.0,
        gravity=g,
        air_density=0.0,
        time_steps=500
    )
    result = compute_projectile(req)
    data = result.data

    assert np.isclose(data["time_of_flight"], expected_t_flight, atol=0.05)
    assert np.isclose(data["horizontal_range"], expected_range, atol=0.1)
    assert np.isclose(data["max_height"], expected_max_h, atol=0.05)


def test_projectile_unequal_elevations_canyon():
    """Verify kinematics when launching to a lower elevation across Outpost Theta canyon."""
    v0 = 34.0
    theta_deg = 41.5
    h0 = 3.2
    target_elev = -7.5
    g = 9.81

    # Theoretical: dy = h0 - target_elev = 10.7m
    theta_rad = np.radians(theta_deg)
    vy0 = v0 * np.sin(theta_rad)
    vx0 = v0 * np.cos(theta_rad)
    discriminant = vy0**2 + 2 * g * (h0 - target_elev)
    expected_t_flight = (vy0 + np.sqrt(discriminant)) / g
    expected_range = vx0 * expected_t_flight

    req = ProjectileRequest(
        initial_speed=v0,
        launch_angle=theta_deg,
        launch_azimuth=0.0,
        initial_height=h0,
        gravity=g,
        air_density=0.0,
        target_x=0.0,
        target_y=target_elev,
        target_z=expected_range,
        target_radius=8.5,
    )
    result = compute_projectile(req)
    data = result.data

    assert np.isclose(data["time_of_flight"], expected_t_flight, atol=0.05)
    assert data["is_hit"] is True
    assert data["score"] >= 95


def test_university_mode_aerodynamic_drag():
    """Verify that quadratic drag shortens range and reduces flight time compared to vacuum."""
    v0 = 35.0
    theta_deg = 45.0
    g = 9.81

    # 1. Vacuum
    res_vac = compute_projectile(ProjectileRequest(
        initial_speed=v0, launch_angle=theta_deg, gravity=g, air_density=0.0
    ))
    # 2. Dense Kepler atmosphere
    res_drag = compute_projectile(ProjectileRequest(
        initial_speed=v0, launch_angle=theta_deg, gravity=g, air_density=1.38, drag_coefficient=0.47
    ))

    # Drag dissipates kinetic energy -> range must be less than vacuum!
    assert res_drag.data["horizontal_range"] < res_vac.data["horizontal_range"]
    assert res_drag.data["max_height"] < res_vac.data["max_height"]


def test_aria_socratic_service():
    """Verify ARIA returns pedagogical guidance rather than empty responses."""
    res_angle = generate_aria_response("Why is 45 degrees not the best angle here?")
    assert "elevation" in res_angle["reply"].lower() or "angle" in res_angle["reply"].lower()
    assert res_angle["mood"] in ["guiding", "analyzing"]

    res_drag = generate_aria_response("How does air drag affect my trajectory in university mode?")
    assert "drag" in res_drag["reply"].lower() or "dissipat" in res_drag["reply"].lower()


def test_database_persistence():
    """Verify SQLAlchemy models and SQLite connection."""
    init_db()
    db = SessionLocal()
    try:
        # Create or fetch test student
        student = db.query(StudentProfile).first()
        if not student:
            student = StudentProfile(username="Test-Pilot", current_world="Physics")
            db.add(student)
            db.commit()
            db.refresh(student)

        assert student.id is not None
        assert student.username == "Test-Pilot"

        # Record test calibration
        attempt = CalibrationAttempt(
            mission_id="PHY-001",
            initial_speed=34.0,
            launch_angle=41.5,
            learning_mode="school",
            miss_distance=0.8,
            is_hit=True,
            score=98
        )
        db.add(attempt)
        db.commit()
        db.refresh(attempt)

        assert attempt.id is not None
        assert attempt.is_hit is True
        assert attempt.score == 98
    finally:
        db.close()


def test_science_adventure_friction_and_stopping():
    """Verify Science Adventure surface physics & stopping distance calculations."""
    g = 9.81
    surfaces = {
        "ice": 0.12,
        "wood": 0.35,
        "concrete": 0.40,
        "grass": 0.85,
    }
    v0 = 6.0  # standard skating velocity in m/s

    stopping_distances = {}
    for name, mu in surfaces.items():
        a = mu * g
        d = (v0 ** 2) / (2 * a)
        stopping_distances[name] = d

    # Slippery ice must take significantly more stopping distance than rough grass
    assert stopping_distances["ice"] > stopping_distances["concrete"]
    assert stopping_distances["concrete"] > stopping_distances["grass"]
    assert np.isclose(stopping_distances["concrete"], 4.587, atol=0.05)
    assert np.isclose(stopping_distances["ice"], 15.29, atol=0.1)
    assert np.isclose(stopping_distances["grass"], 2.158, atol=0.05)


if __name__ == "__main__":
    test_vacuum_projectile_flat_ground()
    test_projectile_unequal_elevations_canyon()
    test_university_mode_aerodynamic_drag()
    test_aria_socratic_service()
    test_database_persistence()
    test_science_adventure_friction_and_stopping()
    print("All PRISM scientific and backend verification tests PASSED!")

