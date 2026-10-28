import React from 'react';

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-header-container">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}
