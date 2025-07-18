import React from 'react';

const StatusTracker = ({ currentStatus, updates, estimatedResolution }) => {
  const statusSteps = [
    { key: 'received', label: 'Received', icon: '📝' },
    { key: 'in_progress', label: 'In Progress', icon: '🔄' },
    { key: 'resolved', label: 'Resolved', icon: '✅' }
  ];

  const getStatusIndex = (status) => {
    return statusSteps.findIndex(step => step.key === status);
  };

  const currentIndex = getStatusIndex(currentStatus);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="status-tracker">
      <div className="tracker-header">
        <h3>Complaint Status</h3>
        <div className="estimated-resolution">
          <span>Estimated Resolution: {estimatedResolution}</span>
        </div>
      </div>

      <div className="status-timeline">
        {statusSteps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={step.key} className={`timeline-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
              <div className="timeline-icon">
                {step.icon}
              </div>
              <div className="timeline-content">
                <div className="step-label">{step.label}</div>
                {isCompleted && (
                  <div className="step-time">
                    {formatDate(updates.find(u => u.status === step.key)?.date)}
                  </div>
                )}
              </div>
              {index < statusSteps.length - 1 && (
                <div className={`timeline-line ${isCompleted ? 'completed' : ''}`}></div>
              )}
            </div>
          );
        })}
      </div>

      <div className="status-updates">
        <h4>Recent Updates</h4>
        <div className="updates-list">
          {updates.slice().reverse().map((update, index) => (
            <div key={index} className="update-item">
              <div className="update-header">
                <span className="update-date">{formatDate(update.date)}</span>
                <span className="update-officer">by {update.officer}</span>
              </div>
              <div className="update-message">{update.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusTracker;
