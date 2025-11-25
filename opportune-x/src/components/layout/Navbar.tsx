import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    // optionally remove other user data
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
