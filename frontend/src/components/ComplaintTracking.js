import React, { useState } from 'react';
import StatusTracker from './StatusTracker';
import '../styles/ComplaintTracking.css';

const ComplaintTracking = () => {
  const [ticketId, setTicketId] = useState('');
  const [complaintData, setComplaintData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFullPhoto, setShowFullPhoto] = useState(false);

  const handleTrackComplaint = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const API_BASE_URL = "https://grievance.shantanuwani.me" || '';
      const response = await fetch(`${API_BASE_URL}/api/complaints/track/${ticketId}`);
      const data = await response.json();
      
      if (data.success) {
        setComplaintData(data.data);
        setError('');
      } else {
        if (response.status === 404) {
          setError('Complaint not found with this ticket ID. Please check your ticket ID and try again.');
        } else if (response.status === 429) {
          setError('Too many requests. Please wait a moment and try again.');
        } else {
          setError(data.message || 'Unable to track complaint. Please try again.');
        }
        setComplaintData(null);
      }
    } catch (error) {
      console.error('Error tracking complaint:', error);
      setError('Network error. Please check your internet connection and try again.');
      setComplaintData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'received': return 'Received';
      case 'in_progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      default: return 'Unknown Status';
    }
  };

  const openPhotoModal = () => {
    setShowFullPhoto(true);
  };

  const closePhotoModal = () => {
    setShowFullPhoto(false);
  };

  return (
    <div className="complaint-tracking-container">
      <div className="tracking-header">
        <h2>Track Your Complaint</h2>
        <p>अपनी शिकायत की स्थिति देखें</p>
      </div>

      <div className="tracking-form">
        <form onSubmit={handleTrackComplaint}>
          <div className="form-group">
            <label htmlFor="ticketId">Enter Ticket ID</label>
            <input
              type="text"
              id="ticketId"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value.toUpperCase())}
              placeholder="Enter your ticket ID (e.g., RHT123456ABCD)"
              required
            />
          </div>
          
          <button type="submit" className="track-btn" disabled={isLoading}>
            {isLoading ? 'Tracking...' : 'Track Complaint'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}
      </div>

      {complaintData && (
        <div className="complaint-details">
          <div className="details-header">
            <h3>Complaint Details</h3>
            <div className="ticket-id">ID: {complaintData.id}</div>
          </div>

          <div className="details-content">
            <div className="basic-info">
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Name:</span>
                  <span className="value">{complaintData.name}</span>
                </div>
                <div className="info-item">
                  <span className="label">Phone:</span>
                  <span className="value">{complaintData.phone}</span>
                </div>
                <div className="info-item">
                  <span className="label">Department:</span>
                  <span className="value">{complaintData.department}</span>
                </div>
                <div className="info-item">
                  <span className="label">Ward:</span>
                  <span className="value">{complaintData.ward}</span>
                </div>
                <div className="info-item">
                  <span className="label">Type:</span>
                  <span className="value">{complaintData.complaintType}</span>
                </div>
                <div className="info-item">
                  <span className="label">Priority:</span>
                  <span className={`value priority-${complaintData.priority}`}>
                    {complaintData.priority.charAt(0).toUpperCase() + complaintData.priority.slice(1)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Status:</span>
                  <span className={`value status-${complaintData.status}`}>
                    {getStatusLabel(complaintData.status)}
                  </span>
                </div>
              </div>
              
              <div className="description">
                <span className="label">Description:</span>
                <p className="value">{complaintData.description}</p>
              </div>
              
              <div className="address">
                <span className="label">Address:</span>
                <p className="value">{complaintData.address}</p>
              </div>

              {/* Photo Display Section */}
              {complaintData.hasPhoto && (
                <div className="complaint-photo">
                  <span className="label">Attached Photo:</span>
                  <div className="photo-container">
                    <img 
                      src={`/api/complaints/photo/${complaintData.id}`}
                      alt="Complaint attachment"
                      className="complaint-image"
                      onClick={openPhotoModal}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="photo-error" style={{display: 'none'}}>
                      <p>Unable to load photo</p>
                    </div>
                    <div className="photo-hint">
                      <p>Click to view full size</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <StatusTracker 
              currentStatus={complaintData.status}
              updates={complaintData.updates}
              estimatedResolution={complaintData.estimatedResolution}
            />
          </div>
        </div>
      )}

      {/* Photo Modal */}
      {showFullPhoto && complaintData && (
        <div className="photo-modal" onClick={closePhotoModal}>
          <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="photo-modal-header">
              <h3>Complaint Photo - {complaintData.id}</h3>
              <button className="close-modal-btn" onClick={closePhotoModal}>✕</button>
            </div>
            <div className="photo-modal-body">
              <img 
                src={`/api/complaints/photo/${complaintData.id}`}
                alt="Complaint Full Size"
                className="photo-full-size"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="photo-load-error" style={{display: 'none'}}>
                <p>Unable to load photo</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintTracking;
