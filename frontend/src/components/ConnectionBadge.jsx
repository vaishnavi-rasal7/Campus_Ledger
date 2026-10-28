import React from 'react';

export default function ConnectionBadge({ status = 'checking', dbProduct = '', onClick }) {
  const isOnline = status === 'UP';
  const isDegraded = status === 'DEGRADED';
  const isChecking = status === 'CHECKING';

  let dotClass = 'online';
  let label = 'System Online';

  if (isChecking) {
    dotClass = 'checking';
    label = 'Checking...';
  } else if (isDegraded) {
    dotClass = 'offline';
    label = 'DB Offline';
  } else if (!isOnline) {
    dotClass = 'offline';
    label = 'Backend Offline';
  }

  return (
    <div 
      className="connection-badge" 
      onClick={onClick}
      title={dbProduct ? `Database: ${dbProduct}` : 'Click to refresh connection status'}
      style={onClick ? { cursor: 'pointer' } : {}}
    >
      <span className={`connection-dot ${dotClass}`} />
      <span>{label}</span>
    </div>
  );
}
