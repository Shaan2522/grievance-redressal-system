const generateTicketId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const randomStr = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `RHT${timestamp}${randomStr}`;
};

const getStatusLabel = (status) => {
  const statusLabels = {
    'received': 'Received',
    'in_progress': 'In Progress',
    'resolved': 'Resolved'
  };
  return statusLabels[status] || 'Unknown Status';
};

const getPriorityLabel = (priority) => {
  const priorityLabels = {
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High'
  };
  return priorityLabels[priority] || 'Medium';
};

module.exports = {
  generateTicketId,
  getStatusLabel,
  getPriorityLabel
};
