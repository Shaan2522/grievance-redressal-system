import React from 'react';
import { useNavigate } from 'react-router-dom';

const TicketDisplay = ({ ticket, onNewComplaint }) => {
  const navigate = useNavigate();

  const getStatusLabel = (status) => {
    switch(status) {
      case 'received': return 'Complaint Received';
      case 'in_progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      default: return 'Unknown Status';
    }
  };

  const handleTrackComplaint = () => {
    navigate('/track');
  };

  const copyTicketId = () => {
    navigator.clipboard.writeText(ticket.id).then(() => {
      // Optional: Show a brief success message
      const button = document.querySelector('.copy-ticket-btn');
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      button.style.backgroundColor = '#27ae60';
      
      setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '#3498db';
      }, 2000);
    }).catch(() => {
      // Fallback for older browsers
      alert('Ticket ID: ' + ticket.id);
    });
  };

  return (
    <div className="ticket-display">
      <div className="ticket-success">
        <div className="success-icon">✓</div>
        <h2>Complaint Submitted Successfully!</h2>
        <p>शिकायत सफलतापूर्वक दर्ज की गई!</p>
      </div>

      <div className="ticket-details">
        <div className="ticket-id">
          <h3>Your Ticket ID</h3>
          <div className="ticket-id-container">
            <div className="ticket-number">{ticket.id}</div>
            <button 
              onClick={copyTicketId}
              className="copy-ticket-btn"
              title="Copy Ticket ID"
            >
              📋 Copy
            </button>
          </div>
          <p>Please save this ID for tracking your complaint</p>
        </div>

        <div className="ticket-info">
          <div className="info-row">
            <span className="label">Name:</span>
            <span className="value">{ticket.name}</span>
          </div>
          <div className="info-row">
            <span className="label">Phone:</span>
            <span className="value">{ticket.phone}</span>
          </div>
          <div className="info-row">
            <span className="label">Department:</span>
            <span className="value">{ticket.department}</span>
          </div>
          <div className="info-row">
            <span className="label">Ward:</span>
            <span className="value">{ticket.ward}</span>
          </div>
          <div className="info-row">
            <span className="label">Priority:</span>
            <span className={`value priority-${ticket.priority}`}>
              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
            </span>
          </div>
          <div className="info-row">
            <span className="label">Status:</span>
            <span className="value status-received">{getStatusLabel(ticket.status)}</span>
          </div>
          <div className="info-row">
            <span className="label">Estimated Resolution:</span>
            <span className="value">{ticket.estimatedResolution}</span>
          </div>
          {ticket.hasPhoto && (
            <div className="info-row">
              <span className="label">Photo:</span>
              <span className="value">✅ Attached</span>
            </div>
          )}
        </div>

        <div className="ticket-actions">
          <button onClick={onNewComplaint} className="new-complaint-btn">
            Submit New Complaint
          </button>
          <button onClick={handleTrackComplaint} className="new-track-btn">
            Track This Complaint
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDisplay;
