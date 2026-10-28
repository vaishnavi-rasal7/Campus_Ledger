import React, { useState, useEffect, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Toast from '../components/Toast';
import { studentApi } from '../api/studentApi';

export const ToastContext = createContext({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [healthStatus, setHealthStatus] = useState(null);

  const showToast = (message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchHealth = async () => {
    try {
      const data = await studentApi.getHealth();
      setHealthStatus(data);
    } catch {
      setHealthStatus({
        status: 'OFFLINE',
        databaseConnected: false,
        databaseProductName: 'None',
      });
    }
  };

  useEffect(() => {
    fetchHealth();
    // Optional periodic health check every 45s
    const interval = setInterval(fetchHealth, 45000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className="app-container">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        <div className="app-main">
          <Header
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            healthStatus={healthStatus}
            onRefreshHealth={fetchHealth}
          />

          <main className="app-content">
            <Outlet context={{ healthStatus, refreshHealth: fetchHealth }} />
          </main>
        </div>

        <Toast toasts={toasts} onDismiss={dismissToast} />
      </div>
    </ToastContext.Provider>
  );
}
