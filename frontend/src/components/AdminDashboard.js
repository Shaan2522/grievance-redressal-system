import React, { useState, useEffect, useCallback } from 'react';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    department: 'all',
    ward: 'all'
  });

  // Get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('adminToken');
  };

  // Fetch complaints from API - wrapped in useCallback to fix dependency warning
  const fetchComplaints = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const queryParams = new URLSearchParams();
      if (filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.department !== 'all') queryParams.append('department', filters.department);
      if (filters.ward !== 'all') queryParams.append('ward', filters.ward);

      const response = await fetch(`/api/complaints?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setComplaints(data.data);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch complaints');
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setError('Error fetching complaints');
    }
  }, [filters]);

  // Fetch analytics/stats - wrapped in useCallback to fix dependency warning
  const fetchStats = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch('/api/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        console.error('Failed to fetch stats:', data.message);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  // Load data on component mount and filter changes - fixed dependency array
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchComplaints(), fetchStats()]);
      setLoading(false);
    };

    loadData();
  }, [fetchComplaints, fetchStats]);

  // Handle status update
  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`/api/complaints/${complaintId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: newStatus,
          message: `Status updated to ${getStatusLabel(newStatus)}` 
        })
      });

      const data = await response.json();

      if (data.success) {
        // Refresh complaints list
        fetchComplaints();
        fetchStats();
      } else {
        alert('Failed to update status: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  // Handle photo click
  const handlePhotoClick = (ticketId) => {
    setSelectedPhoto(ticketId);
  };

  // Close photo modal
  const closePhotoModal = () => {
    setSelectedPhoto(null);
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'received': return 'Received';
      case 'in_progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      default: return 'Unknown Status';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="admin-dashboard">
        {/* <div className="loading">Loading dashboard...</div> */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <p>Manage and track all complaints</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-number">{stats.total || 0}</div>
          <div className="stat-label">Total Complaints</div>
        </div>
        <div className="stat-card received">
          <div className="stat-number">{stats.received || 0}</div>
          <div className="stat-label">Received</div>
        </div>
        <div className="stat-card progress">
          <div className="stat-number">{stats.in_progress || 0}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card resolved">
          <div className="stat-number">{stats.resolved || 0}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>

      {/* Department & Ward Stats */}
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Complaints by Department</h3>
          <div className="chart-data">
            {Object.entries(stats.byDepartment || {}).map(([dept, count]) => (
              <div key={dept} className="chart-item">
                <span className="chart-label">{dept}</span>
                <div className="chart-bar">
                  <div 
                    className="chart-fill" 
                    style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="chart-value">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <h3>Complaints by Ward</h3>
          <div className="chart-data">
            {Object.entries(stats.byWard || {}).map(([ward, count]) => (
              <div key={ward} className="chart-item">
                <span className="chart-label">{ward}</span>
                <div className="chart-bar">
                  <div 
                    className="chart-fill" 
                    style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="chart-value">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters">
          <select 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">All Statuses</option>
            <option value="received">Received</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select 
            value={filters.department} 
            onChange={(e) => setFilters({...filters, department: e.target.value})}
          >
            <option value="all">All Departments</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Road">Road</option>
            <option value="Electricity">Electricity</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Others">Others</option>
          </select>

          <select 
            value={filters.ward} 
            onChange={(e) => setFilters({...filters, ward: e.target.value})}
          >
            <option value="all">All Wards</option>
            <option value="Ward 1">Ward 1</option>
            <option value="Ward 2">Ward 2</option>
            <option value="Ward 3">Ward 3</option>
            <option value="Ward 4">Ward 4</option>
            <option value="Ward 5">Ward 5</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="complaints-table">
        <table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Ward</th>
              <th>Type</th>
              <th>Priority</th>
              <th>Photo</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '2rem' }}>
                  No complaints found. Submit a complaint to see data here.
                </td>
              </tr>
            ) : (
              complaints.map(complaint => (
                <tr key={complaint.id}>
                  <td className="ticket-id">{complaint.ticketId}</td>
                  <td>{complaint.name}</td>
                  <td>{complaint.department}</td>
                  <td>{complaint.ward}</td>
                  <td>{complaint.complaintType}</td>
                  <td>
                    <span className={`priority-badge priority-${complaint.priority}`}>
                      {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                    </span>
                  </td>
                  <td>
                    {complaint.hasPhoto ? (
                      <div className="photo-preview-container">
                        <img 
                          src={`/api/complaints/photo/${complaint.ticketId}`}
                          alt="Complaint"
                          className="photo-thumbnail"
                          onClick={() => handlePhotoClick(complaint.ticketId)}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'inline';
                          }}
                        />
                        <span className="photo-error" style={{display: 'none'}}>📷❌</span>
                      </div>
                    ) : (
                      <span className="no-photo">📷❌</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge status-${complaint.status}`}>
                      {getStatusLabel(complaint.status)}
                    </span>
                  </td>
                  <td>{formatDate(complaint.submittedAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <select 
                        value={complaint.status}
                        onChange={(e) => handleStatusUpdate(complaint.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="received">Received</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="photo-modal" onClick={closePhotoModal}>
          <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="photo-modal-header">
              <h3>Complaint Photo - {selectedPhoto}</h3>
              <button className="close-modal-btn" onClick={closePhotoModal}>✕</button>
            </div>
            <div className="photo-modal-body">
              <img 
                src={`/api/complaints/photo/${selectedPhoto}`}
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

export default AdminDashboard;
