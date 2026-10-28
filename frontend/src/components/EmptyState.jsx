import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon,
  title = 'No records found',
  description = 'There are currently no records to display.',
  action,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {icon || <Inbox size={26} />}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
