import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { healthApi } from "../../services/api";
import "./Navbar.css";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    healthApi
      .check()
      .then(() => setBackendStatus("connected"))
      .catch(() => setBackendStatus("disconnected"));
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">🔭</div>
          <div className="navbar-logo-text">
            <span>PRISM</span>
          </div>
        </Link>

        <ul className="navbar-nav">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `navbar-link${isActive ? " active" : ""}`
                }
                end={to === "/"}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div
          className={`navbar-status ${
            backendStatus === "connected" ? "connected" : "disconnected"
          }`}
        >
          <div className="navbar-status-dot" />
          {backendStatus === "checking"
            ? "Connecting…"
            : backendStatus === "connected"
            ? "API Online"
            : "API Offline"}
        </div>
      </div>
    </nav>
  );
}
