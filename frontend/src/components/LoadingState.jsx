import React from 'react';

export default function LoadingState({ message = 'Loading student records...' }) {
  return (
    <div className="loading-box" role="status">
      <div className="spinner" />
      <span style={{ fontSize: 13.5 }}>{message}</span>
    </div>
  );
}
