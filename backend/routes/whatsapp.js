// const express = require('express');
// const router = express.Router();
// const whatsappController = require('../controllers/whatsappController');

// // Webhook endpoint for receiving WhatsApp messages
// router.post('/webhook', whatsappController.handleWebhook.bind(whatsappController));

// // Webhook verification (required by WhatsApp)
// router.get('/webhook', (req, res) => {
//   const mode = req.query['hub.mode'];
//   const token = req.query['hub.verify_token'];
//   const challenge = req.query['hub.challenge'];

//   const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'your_verify_token';

//   if (mode && token) {
//     if (mode === 'subscribe' && token === VERIFY_TOKEN) {
//       console.log('WhatsApp webhook verified');
//       res.status(200).send(challenge);
//     } else {
//       res.sendStatus(403);
//     }
//   }
// });

// module.exports = router;
