const whatsappService = require('../services/whatsappService');
const Complaint = require('../models/Complaint');
const { generateTicketId } = require('../utils/ticketGenerator');

class WhatsAppController {
  constructor() {
    this.userSessions = new Map(); // Store user conversation state
  }

  async handleWebhook(req, res) {
    try {
      const { Body, From, ProfileName } = req.body;
      const phoneNumber = From.replace('whatsapp:', '');
      const message = Body.trim().toLowerCase();

      console.log(`WhatsApp message from ${phoneNumber}: ${Body}`);

      await this.processMessage(phoneNumber, message, ProfileName);
      
      res.status(200).send('OK');
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).send('Error processing message');
    }
  }

  async processMessage(phoneNumber, message, profileName) {
    const session = this.getSession(phoneNumber);

    // Command routing
    if (message.includes('menu') || message.includes('help') || message === 'hi' || message === 'hello') {
      await this.sendMainMenu(phoneNumber, profileName);
    } else if (message === '1' || message.includes('submit') || message.includes('complaint')) {
      await this.startComplaintFlow(phoneNumber);
    } else if (message === '2' || message.includes('track') || message.includes('status')) {
      await this.startTrackingFlow(phoneNumber);
    } else if (session.state === 'awaiting_ticket_id') {
      await this.handleTrackingRequest(phoneNumber, message);
    } else if (session.state === 'complaint_flow') {
      await this.handleComplaintFlow(phoneNumber, message, session);
    } else {
      await this.sendMainMenu(phoneNumber, profileName);
    }
  }

  async sendMainMenu(phoneNumber, profileName = '') {
    const greeting = profileName ? `Hello ${profileName}!` : 'Hello!';
    const menuMessage = `${greeting} 🙏

Welcome to Grievance Redressal System
शिकायत निवारण प्रणाली में आपका स्वागत है

Please select an option:
कृपया एक विकल्प चुनें:

1️⃣ Submit New Complaint
   नई शिकायत दर्ज करें

2️⃣ Track Complaint Status  
   शिकायत की स्थिति देखें

Reply with the number or type your choice.
संख्या के साथ उत्तर दें या अपनी पसंद टाइप करें।

Type "menu" anytime to see options again.`;

    await whatsappService.sendMessage(phoneNumber, menuMessage);
    this.clearSession(phoneNumber);
  }

  async startComplaintFlow(phoneNumber) {
    const session = this.getSession(phoneNumber);
    session.state = 'complaint_flow';
    session.step = 'name';
    session.complaint = {};

    const message = `📝 Let's submit your complaint
आइए आपकी शिकायत दर्ज करें

Please provide the following information:

Step 1/7: Your Full Name
चरण 1/7: आपका पूरा नाम

Please enter your name:`;

    await whatsappService.sendMessage(phoneNumber, message);
  }

  async handleComplaintFlow(phoneNumber, message, session) {
    const { step, complaint } = session;

    switch (step) {
      case 'name':
        complaint.name = message;
        session.step = 'phone';
        await whatsappService.sendMessage(phoneNumber, 
          `Step 2/7: Phone Number\nचरण 2/7: फ़ोन नंबर\n\nPlease enter your 10-digit phone number:`);
        break;

      case 'phone':
        if (!/^\d{10}$/.test(message)) {
          await whatsappService.sendMessage(phoneNumber, 
            'Please enter a valid 10-digit phone number:\nकृपया एक वैध 10-अंकीय फ़ोन नंबर दर्ज करें:');
          return;
        }
        complaint.phone = message;
        session.step = 'ward';
        await whatsappService.sendMessage(phoneNumber, 
          `Step 3/7: Ward Selection\nचरण 3/7: वार्ड चुनें\n\nPlease select your ward (1-10):\nअपना वार्ड चुनें (1-10):\n\nExample: Ward 1, Ward 2, etc.`);
        break;

      case 'ward':
        if (!message.includes('ward') && !/^[1-9]|10$/.test(message)) {
          await whatsappService.sendMessage(phoneNumber, 
            'Please enter a valid ward (1-10) or "Ward 1", "Ward 2", etc.');
          return;
        }
        complaint.ward = message.includes('ward') ? message : `Ward ${message}`;
        session.step = 'department';
        await whatsappService.sendMessage(phoneNumber, 
          `Step 4/7: Department\nचरण 4/7: विभाग\n\nSelect department:\n1. Water Supply\n2. Sanitation\n3. Road\n4. Electricity\n5. Health\n6. Education\n7. Others\n\nReply with number or department name:`);
        break;

      case 'department':
        const departments = {
          '1': 'Water Supply',
          '2': 'Sanitation', 
          '3': 'Road',
          '4': 'Electricity',
          '5': 'Health',
          '6': 'Education',
          '7': 'Others'
        };
        complaint.department = departments[message] || message;
        session.step = 'type';
        await whatsappService.sendMessage(phoneNumber, 
          `Step 5/7: Complaint Type\nचरण 5/7: शिकायत का प्रकार\n\nBriefly describe the type of issue:\nसमस्या के प्रकार का संक्षिप्त वर्णन करें:\n\nExample: Water leakage, Road repair, etc.`);
        break;

      case 'type':
        complaint.complaintType = message;
        session.step = 'address';
        await whatsappService.sendMessage(phoneNumber, 
          `Step 6/7: Address\nचरण 6/7: पता\n\nPlease provide the complete address where the issue is located:\nकृपया उस पूरे पते को बताएं जहां समस्या है:`);
        break;

      case 'address':
        complaint.address = message;
        session.step = 'description';
        await whatsappService.sendMessage(phoneNumber, 
          `Step 7/7: Description\nचरण 7/7: विवरण\n\nPlease describe your complaint in detail:\nकृपया अपनी शिकायत का विस्तृत विवरण दें:`);
        break;

      case 'description':
        complaint.description = message;
        await this.submitComplaint(phoneNumber, complaint);
        break;
    }
  }

  async submitComplaint(phoneNumber, complaintData) {
    try {
      const ticketId = generateTicketId();
      
      const complaint = new Complaint({
        ticketId,
        citizenInfo: {
          name: complaintData.name,
          phone: complaintData.phone,
          email: '' // Optional via WhatsApp
        },
        complaintDetails: {
          department: complaintData.department,
          ward: complaintData.ward,
          type: complaintData.complaintType,
          description: complaintData.description,
          address: complaintData.address,
          priority: 'medium'
        },
        statusHistory: [{
          status: 'received',
          updatedBy: 'WhatsApp Bot',
          message: 'Complaint received via WhatsApp',
          timestamp: new Date()
        }]
      });

      await complaint.save();

      const successMessage = `✅ Complaint Submitted Successfully!
शिकायत सफलतापूर्वक दर्ज की गई!

📋 Your Ticket ID: *${ticketId}*
आपकी टिकट आईडी: *${ticketId}*

📝 Summary:
📞 Phone: ${complaintData.phone}
🏢 Department: ${complaintData.department}
🏘️ Ward: ${complaintData.ward}
📍 Address: ${complaintData.address}
📄 Type: ${complaintData.complaintType}

⏱️ Status: Complaint Received
स्थिति: शिकायत प्राप्त

🕐 Estimated Resolution: 7 days
अनुमानित समाधान: 7 दिन

💡 Save this Ticket ID to track your complaint status.
अपनी शिकायत की स्थिति ट्रैक करने के लिए इस टिकट आईडी को सेव करें।

Type "menu" for more options.`;

      await whatsappService.sendMessage(phoneNumber, successMessage);
      this.clearSession(phoneNumber);

    } catch (error) {
      console.error('Error submitting complaint:', error);
      await whatsappService.sendMessage(phoneNumber, 
        `❌ Error submitting complaint. Please try again or contact support.\nशिकायत दर्ज करने में त्रुटि। कृपया पुनः प्रयास करें।\n\nType "menu" to start over.`);
      this.clearSession(phoneNumber);
    }
  }

  async startTrackingFlow(phoneNumber) {
    const session = this.getSession(phoneNumber);
    session.state = 'awaiting_ticket_id';

    const message = `🔍 Track Your Complaint
अपनी शिकायत ट्रैक करें

Please enter your Ticket ID:
कृपया अपनी टिकट आईडी दर्ज करें:

Example: RHT123456ABCD
उदाहरण: RHT123456ABCD`;

    await whatsappService.sendMessage(phoneNumber, message);
  }

  async handleTrackingRequest(phoneNumber, ticketId) {
    try {
      const complaint = await Complaint.findOne({ ticketId: ticketId.toUpperCase() });

      if (!complaint) {
        await whatsappService.sendMessage(phoneNumber, 
          `❌ Complaint not found with Ticket ID: ${ticketId}\nटिकट आईडी के साथ शिकायत नहीं मिली: ${ticketId}\n\nPlease check your Ticket ID and try again.\nType "menu" for more options.`);
        this.clearSession(phoneNumber);
        return;
      }

      const statusLabels = {
        'received': 'Complaint Received / शिकायत प्राप्त',
        'in_progress': 'Active / प्रगति में',
        'resolved': 'Resolved / हल हो गया'
      };

      const statusMessage = `📋 Complaint Status / शिकायत की स्थिति

🎫 Ticket ID: *${complaint.ticketId}*
👤 Name: ${complaint.citizenInfo.name}
🏢 Department: ${complaint.complaintDetails.department}
🏘️ Ward: ${complaint.complaintDetails.ward}
📄 Type: ${complaint.complaintDetails.type}

📊 Current Status: *${statusLabels[complaint.status]}*
वर्तमान स्थिति: *${statusLabels[complaint.status]}*

📅 Submitted: ${new Date(complaint.timestamps.submitted).toLocaleDateString('en-IN')}
दर्ज किया गया: ${new Date(complaint.timestamps.submitted).toLocaleDateString('hi-IN')}

⏱️ Estimated Resolution: ${complaint.estimatedResolution}
अनुमानित समाधान: ${complaint.estimatedResolution}

📍 Address: ${complaint.complaintDetails.address}
📝 Description: ${complaint.complaintDetails.description}

Type "menu" for more options.`;

      await whatsappService.sendMessage(phoneNumber, statusMessage);
      this.clearSession(phoneNumber);

    } catch (error) {
      console.error('Error tracking complaint:', error);
      await whatsappService.sendMessage(phoneNumber, 
        `❌ Error retrieving complaint details. Please try again.\nशिकायत विवरण प्राप्त करने में त्रुटि।\n\nType "menu" to start over.`);
      this.clearSession(phoneNumber);
    }
  }

  getSession(phoneNumber) {
    if (!this.userSessions.has(phoneNumber)) {
      this.userSessions.set(phoneNumber, { state: null, step: null });
    }
    return this.userSessions.get(phoneNumber);
  }

  clearSession(phoneNumber) {
    this.userSessions.delete(phoneNumber);
  }
}

module.exports = new WhatsAppController();
