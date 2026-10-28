import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Server, 
  Database, 
  Cpu, 
  Code, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Clock, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { studentApi } from '../api/studentApi';

export default function Settings() {
  const { healthStatus: initialHealth, refreshHealth } = useOutletContext();
  const [healthData, setHealthData] = useState(initialHealth);
  const [isChecking, setIsChecking] = useState(false);
  const [checkError, setCheckError] = useState(null);

  const checkConnection = async () => {
    setIsChecking(true);
    setCheckError(null);
    try {
      const data = await studentApi.getHealth();
      setHealthData(data);
      if (refreshHealth) refreshHealth();
    } catch (err) {
      setCheckError(err.message || 'Could not connect to Spring Boot server.');
      setHealthData({
        status: 'OFFLINE',
        databaseConnected: false,
        databaseProductName: 'Unreachable',
        totalStudents: 0,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (!initialHealth) {
      checkConnection();
    } else {
      setHealthData(initialHealth);
    }
  }, [initialHealth]);

  const isServerUp = healthData?.status === 'UP' || healthData?.status === 'DEGRADED';
  const isDbUp = Boolean(healthData?.databaseConnected);

  const formatUptime = (ms) => {
    if (!ms) return 'N/A';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  };

  return (
    <div>
      <PageHeader
        title="Settings & System Status"
        subtitle="Operational telemetry, architecture specifications, and live service health diagnostics."
        actions={
          <button
            type="button"
            className="btn btn-primary"
            onClick={checkConnection}
            disabled={isChecking}
          >
            <RefreshCw size={14} className={isChecking ? 'spinner' : ''} />
            <span>{isChecking ? 'Probing Services...' : 'Test Connection'}</span>
          </button>
        }
      />

      {/* Diagnostics Card */}
      <section className="settings-section">
        <h2 className="settings-section-title">Live Service Diagnostics</h2>
        <p style={{ fontSize: 13.5, color: 'var(--color-text-muted)', marginBottom: 20 }}>
          This panel performs an actual HTTP probe to <code>/api/health</code>, querying both Spring Boot and the underlying MySQL database session.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {/* Backend Status Box */}
          <div className="spec-item" style={{ borderLeft: `4px solid ${isServerUp ? '#2E7D32' : 'var(--color-terracotta)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span className="spec-label">Spring Boot Backend API</span>
              {isServerUp ? (
                <span style={{ color: '#2E7D32', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, fontWeight: 600 }}>
                  <CheckCircle2 size={15} /> ONLINE
                </span>
              ) : (
                <span style={{ color: 'var(--color-terracotta)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, fontWeight: 600 }}>
                  <XCircle size={15} /> OFFLINE
                </span>
              )}
            </div>
            <div className="spec-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
              {studentApi.getBaseUrl()}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-light)', marginTop: 4 }}>
              HTTP REST service on port 8080
            </div>
          </div>

          {/* Database Status Box */}
          <div className="spec-item" style={{ borderLeft: `4px solid ${isDbUp ? '#2E7D32' : 'var(--color-terracotta)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span className="spec-label">MySQL Database Persistence</span>
              {isDbUp ? (
                <span style={{ color: '#2E7D32', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, fontWeight: 600 }}>
                  <CheckCircle2 size={15} /> CONNECTED
                </span>
              ) : (
                <span style={{ color: 'var(--color-terracotta)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, fontWeight: 600 }}>
                  <XCircle size={15} /> DISCONNECTED
                </span>
              )}
            </div>
            <div className="spec-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
              {healthData?.databaseProductName || 'Not reachable'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-light)', marginTop: 4 }}>
              Schema: <code>studentdb</code> · Table: <code>students</code>
            </div>
          </div>
        </div>

        {healthData?.details && (
          <div className="health-status-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <Clock size={16} style={{ color: 'var(--color-brand)' }} />
              <span>Backend JVM Uptime: <strong>{formatUptime(healthData.details.uptimeMs)}</strong></span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>
              Java: <strong>{healthData.details.javaVersion || '17'}</strong> ({healthData.details.javaVendor || 'LTS'})
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>
              Verified Total Students in DB: <strong>{healthData.totalStudents ?? 0}</strong>
            </div>
          </div>
        )}
      </section>

      {/* Architecture Specifications */}
      <section className="settings-section">
        <h2 className="settings-section-title">Academic Assignment & Technology Stack</h2>
        <div className="spec-list">
          <div className="spec-item">
            <div className="spec-label">Institution</div>
            <div className="spec-value">A. P. Shah Institute of Technology</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>Dept of Information Technology</div>
          </div>

          <div className="spec-item">
            <div className="spec-label">Academic Subject</div>
            <div className="spec-value">Mini Project FSJP Lab</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>Assignment 2 · Semester III</div>
          </div>

          <div className="spec-item">
            <div className="spec-label">Frontend Framework</div>
            <div className="spec-value">React 18 + Vite</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>React Router 6, Custom Plain CSS</div>
          </div>

          <div className="spec-item">
            <div className="spec-label">Backend Platform</div>
            <div className="spec-value">Spring Boot 3.2.5</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>Java 17 LTS, Spring Data JPA</div>
          </div>

          <div className="spec-item">
            <div className="spec-label">Relational Database</div>
            <div className="spec-value">MySQL 8.x Engine</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>Database: <code>studentdb</code></div>
          </div>

          <div className="spec-item">
            <div className="spec-label">Application Design</div>
            <div className="spec-value">Campus Ledger Identity</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>Warm Ivory & Forest Green</div>
          </div>
        </div>
      </section>
    </div>
  );
}
