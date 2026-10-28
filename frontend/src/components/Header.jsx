import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, RefreshCw } from 'lucide-react';
import ConnectionBadge from './ConnectionBadge';

export default function Header({ onToggleSidebar, healthStatus, onRefreshHealth }) {
  const location = useLocation();

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/students') return 'Student Directory';
    if (path === '/students/new') return 'Add New Student';
    if (path.startsWith('/students/') && path.endsWith('/edit')) return 'Edit Student';
    if (path.startsWith('/students/')) return 'Student Profile';
    if (path === '/departments') return 'Departments';
    if (path === '/settings') return 'Settings & Status';
    return 'Page Not Found';
  };

  const isHome = location.pathname === '/';

  return (
    <header className="app-header">
      <div className="header-left">
        <button 
          className="mobile-menu-btn" 
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        <nav className="breadcrumbs" aria-label="Breadcrumb">
          {!isHome ? (
            <>
              <Link to="/" className="breadcrumb-root">Campus Ledger</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{getBreadcrumbs()}</span>
            </>
          ) : (
            <span className="breadcrumb-current">Student Record Management System</span>
          )}
        </nav>
      </div>

      <div className="header-right">
        <ConnectionBadge 
          status={healthStatus?.status || 'CHECKING'} 
          dbProduct={healthStatus?.databaseProductName}
          onClick={onRefreshHealth}
        />
        <button 
          className="btn btn-secondary btn-icon" 
          onClick={onRefreshHealth}
          title="Refresh connection status"
          aria-label="Refresh connection"
        >
          <RefreshCw size={15} />
        </button>
      </div>
    </header>
  );
}
