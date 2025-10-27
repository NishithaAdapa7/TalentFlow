import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, FileText, Users, LogOut, Menu, X } from "lucide-react";
import "../AdminCss/NavBar.css";

const AdminNavbar = ({ adminName = "Admin" }) => {
  const navigate = useNavigate();
  const initial = adminName.charAt(0).toUpperCase();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Brand */}
      <div
        className="navbar-brand"
        onClick={() => navigate("/admin/dashboard")}
      >
        <span className="brand-name">TalentFlow</span>
      </div>

      {/* Hamburger Menu (Mobile Only) */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </div>

      {/* Center Links */}
      <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <button onClick={() => navigate("/admin")} className="nav-link">
          <Briefcase size={18} />
          <span>Jobs</span>
        </button>

        <button
          onClick={() => navigate("/assessments")}
          className="nav-link"
        >
          <FileText size={18} />
          <span>Assessments</span>
        </button>

        <button
          onClick={() => navigate("/candidates")}
          className="nav-link"
        >
          <Users size={18} />
          <span>Candidates</span>
        </button>
      </div>

      {/* Right Profile */}
      <div className="profile-container">
        <div className="profile-avatar">{initial}</div>
        <div className="dropdown">
          <button
            onClick={() => navigate("/admin/profile")}
            className="dropdown-item"
          >
            Profile
          </button>
          <button
            onClick={() => navigate("/")}
            className="dropdown-item logout"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
