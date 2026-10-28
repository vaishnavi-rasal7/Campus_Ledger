import React from 'react';
import { Link } from 'react-router-dom';

export default function StatCard({ label, value, icon, caption, to, onClick }) {
  const content = (
    <>
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        {icon && <div className="stat-icon-wrap">{icon}</div>}
      </div>
      <div className="stat-value">{value}</div>
      {caption && <div className="stat-caption">{caption}</div>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className="stat-card" onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <div className="stat-card" onClick={onClick} role={onClick ? 'button' : undefined}>
      {content}
    </div>
  );
}
