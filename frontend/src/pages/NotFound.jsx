import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="not-found-wrapper">
      <div className="not-found-code">404</div>
      <h2 className="not-found-title">Academic Record Not Found</h2>
      <p className="not-found-desc">
        The ledger route or administrative record you requested does not exist or has been relocated to another department catalog.
      </p>
      <Link to="/" className="btn btn-primary">
        <Home size={16} />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}
