const twilio = require('twilio');

class WhatsAppService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.fromNumber = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;
  }

  async sendMessage(to, message) {
    try {
      const result = await this.client.messages.create({
        from: this.fromNumber,
        to: `whatsapp:${to}`,
        body: message
      });
      return result;
    } catch (error) {
      console.error('WhatsApp send error:', error);
      throw error;
    }
  }

  async sendTemplate(to, templateData) {
    // For template messages (production)
    try {
      const result = await this.client.messages.create({
        from: this.fromNumber,
        to: `whatsapp:${to}`,
        contentSid: templateData.contentSid,
        contentVariables: JSON.stringify(templateData.variables)
      });
      return result;
    } catch (error) {
      console.error('WhatsApp template error:', error);
      throw error;
    }
  }
}

module.exports = new WhatsAppService();
