import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Building2, 
  Settings, 
  GraduationCap,
  X
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const handleNavClick = () => {
    if (window.innerWidth <= 900 && onClose) {
      onClose();
    }
  };

  return (
    <>
      <div 
        className={`mobile-backdrop ${isOpen ? 'open' : ''}`} 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <NavLink to="/" className="brand-badge" onClick={handleNavClick}>
              <div className="brand-logo-mark">
                <GraduationCap size={19} />
              </div>
              <div className="brand-text-block">
                <span className="brand-title">Campus Ledger</span>
                <span className="brand-subtitle">Student Management</span>
              </div>
            </NavLink>

            {isOpen && (
              <button 
                onClick={onClose} 
                className="btn btn-icon btn-secondary" 
                style={{ display: 'inline-flex', padding: 4 }}
                aria-label="Close navigation"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-title">Navigation</span>
          
          <NavLink 
            to="/" 
            end 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            <LayoutDashboard />
            <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/students" 
            end 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            <Users />
            <span>Student Directory</span>
          </NavLink>

          <NavLink 
            to="/students/new" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            <UserPlus />
            <span>Add Student</span>
          </NavLink>

          <NavLink 
            to="/departments" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            <Building2 />
            <span>Departments</span>
          </NavLink>

          <span className="nav-section-title" style={{ marginTop: 12 }}>System</span>

          <NavLink 
            to="/settings" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            <Settings />
            <span>Settings & About</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <span className="academic-label">FSJP Lab Project</span>
          <span className="academic-subtext">A. P. Shah Institute of Tech</span>
          <span className="academic-subtext" style={{ opacity: 0.6 }}>Semester III · 2026-27</span>
        </div>
      </aside>
    </>
  );
}
