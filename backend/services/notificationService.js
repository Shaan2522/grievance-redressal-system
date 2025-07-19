const whatsappService = require('./whatsappService');

class NotificationService {
  async sendStatusUpdate(complaint, newStatus, message) {
    if (!complaint.citizenInfo.phone) return;

    const statusLabels = {
      'received': 'Complaint Received / शिकायत प्राप्त',
      'in_progress': 'Active / प्रगति में', 
      'resolved': 'Resolved / हल हो गया'
    };

    const notificationMessage = `📋 Complaint Status Update
शिकायत स्थिति अपडेट

🎫 Ticket ID: *${complaint.ticketId}*
📊 New Status: *${statusLabels[newStatus]}*
नई स्थिति: *${statusLabels[newStatus]}*

💬 Update Message:
अपडेट संदेश:
${message}

📅 Updated: ${new Date().toLocaleDateString('en-IN')}
अपडेट किया गया: ${new Date().toLocaleDateString('hi-IN')}

Type "${complaint.ticketId}" to check full status.
पूरी स्थिति जांचने के लिए "${complaint.ticketId}" टाइप करें।`;

    try {
      await whatsappService.sendMessage(complaint.citizenInfo.phone, notificationMessage);
      console.log(`WhatsApp notification sent to ${complaint.citizenInfo.phone}`);
    } catch (error) {
      console.error('Failed to send WhatsApp notification:', error);
    }
  }
}

module.exports = new NotificationService();
