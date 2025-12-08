import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import NotificationBell from "../alerts/NotificationBell";

const Navbar: React.FC = () => {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-brand-badge">OX</span>
          <span>OpportuneX</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/events" className="nav-link">
            Events
          </NavLink>
          <NavLink to="/dashboard" className="nav-link">
            Dashboard
          </NavLink>
          {token && <NotificationBell />}
          {user?.isAdmin && (
            <NavLink to="/admin" className="nav-link">
              Admin
            </NavLink>
          )}

          {!token ? (
            <>
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
              <NavLink to="/register" className="nav-link nav-link-primary">
                Sign up
              </NavLink>
            </>
          ) : (
            <button className="btn btn-ghost" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
