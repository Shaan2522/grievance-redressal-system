const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

class WhatsAppBot {
  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Generate QR Code for authentication
    this.client.on('qr', (qr) => {
      console.log('📱 WhatsApp QR Code:');
      qrcode.generate(qr, { small: true });
    });

    // Bot is ready
    this.client.on('ready', () => {
      console.log('✅ WhatsApp bot is ready!');
    });

    // Handle incoming messages
    this.client.on('message', async (message) => {
      await this.handleMessage(message);
    });
  }

  async handleMessage(message) {
    const userMessage = message.body.toLowerCase().trim();
    const chatId = message.from;
    
    console.log(`📩 Received: "${userMessage}" from ${chatId}`);
    
    // Bot responses based on user input
    if (userMessage === 'hi' || userMessage === 'hello' || userMessage === 'शिकायत') {
      await this.sendWelcomeMessage(chatId);
    } else if (userMessage === '1') {
      await this.startComplaintSubmission(chatId);
    } else if (userMessage === '2') {
      await this.startComplaintTracking(chatId);
    } else {
      await this.handleComplaintInput(chatId, userMessage);
    }
  }

  async sendWelcomeMessage(chatId) {
    const welcomeMessage = `
🏛️ *Welcome to Grievance Redressal System*
नमस्ते! शिकायत निवारण सिस्टम में आपका स्वागत है

Please choose an option:
कृपया एक विकल्प चुनें:

1️⃣ Submit New Complaint (नई शिकायत दर्ज करें)
2️⃣ Track Existing Complaint (मौजूदा शिकायत ट्रैक करें)

Type the number of your choice.
अपनी पसंद का नंबर टाइप करें।
    `;
    
    await this.client.sendMessage(chatId, welcomeMessage);
  }

  async startComplaintSubmission(chatId) {
    const message = `
📝 *Submit New Complaint*
नई शिकायत दर्ज करें

Let's start with your details:
आइए आपकी जानकारी से शुरू करते हैं:

Please provide your full name:
कृपया अपना पूरा नाम बताएं:
    `;
    
    await this.client.sendMessage(chatId, message);
    // Store user state for complaint submission flow
    this.setUserState(chatId, 'awaiting_name');
  }

  async startComplaintTracking(chatId) {
    const message = `
🔍 *Track Your Complaint*
अपनी शिकायत ट्रैक करें

Please enter your Ticket ID:
कृपया अपना टिकट आईडी दर्ज करें:

Example: RHT123456ABCD
उदाहरण: RHT123456ABCD
    `;
    
    await this.client.sendMessage(chatId, message);
    this.setUserState(chatId, 'awaiting_ticket_id');
  }

  async handleComplaintInput(chatId, input) {
    const userState = this.getUserState(chatId);
    
    switch (userState) {
      case 'awaiting_name':
        await this.handleNameInput(chatId, input);
        break;
      case 'awaiting_ticket_id':
        await this.handleTicketTracking(chatId, input);
        break;
      // Add more states as needed
      default:
        await this.sendHelpMessage(chatId);
    }
  }

  async handleNameInput(chatId, name) {
    // Store name and ask for next detail
    this.setUserData(chatId, 'name', name);
    
    const message = `
✅ Name saved: ${name}
नाम सेव किया गया: ${name}

Now, please provide your phone number:
अब, कृपया अपना फोन नंबर बताएं:
    `;
    
    await this.client.sendMessage(chatId, message);
    this.setUserState(chatId, 'awaiting_phone');
  }

  async handleTicketTracking(chatId, ticketId) {
    try {
      // Call your existing API to track complaint
      const response = await fetch(`http://localhost:5000/api/complaints/track/${ticketId}`);
      const data = await response.json();
      
      if (data.success) {
        const complaint = data.data;
        const statusMessage = `
🎫 *Complaint Details*
शिकायत विवरण

📋 Ticket ID: ${complaint.id}
👤 Name: ${complaint.name}
🏢 Department: ${complaint.department}
🏘️ Ward: ${complaint.ward}
📊 Status: ${this.getStatusInHindi(complaint.status)}
📅 Submitted: ${new Date(complaint.submittedAt).toLocaleDateString('hi-IN')}

Your complaint is being processed.
आपकी शिकायत पर कार्रवाई की जा रही है।
        `;
        
        await this.client.sendMessage(chatId, statusMessage);
      } else {
        await this.client.sendMessage(chatId, '❌ Ticket ID not found. Please check and try again.\nटिकट आईडी नहीं मिला। कृपया जांचकर पुनः प्रयास करें।');
      }
    } catch (error) {
      console.error('Error tracking complaint:', error);
      await this.client.sendMessage(chatId, '❌ Error tracking complaint. Please try again later.\nशिकायत ट्रैक करने में त्रुटि। कृपया बाद में प्रयास करें।');
    }
  }

  async sendHelpMessage(chatId) {
    const helpMessage = `
❓ *Need Help?*
सहायता चाहिए?

Type "hi" to start over.
शुरू करने के लिए "hi" टाइप करें।

Or contact support: +91-1262-XXX-XXX
या सहायता से संपर्क करें: +91-1262-XXX-XXX
    `;
    
    await this.client.sendMessage(chatId, helpMessage);
  }

  getStatusInHindi(status) {
    const statusMap = {
      'received': 'प्राप्त (Received)',
      'in_progress': 'प्रगति में (In Progress)', 
      'resolved': 'हल हो गया (Resolved)'
    };
    return statusMap[status] || status;
  }

  // Simple in-memory state management (use Redis in production)
  setUserState(chatId, state) {
    if (!this.userStates) this.userStates = {};
    this.userStates[chatId] = state;
  }

  getUserState(chatId) {
    return this.userStates?.[chatId] || null;
  }

  setUserData(chatId, key, value) {
    if (!this.userData) this.userData = {};
    if (!this.userData[chatId]) this.userData[chatId] = {};
    this.userData[chatId][key] = value;
  }

  getUserData(chatId, key) {
    return this.userData?.[chatId]?.[key] || null;
  }

  async start() {
    await this.client.initialize();
  }

  async stop() {
    await this.client.destroy();
  }
}

module.exports = WhatsAppBot;
