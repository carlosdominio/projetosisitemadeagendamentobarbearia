const { Pool } = require('pg');

// Configuração do banco de dados Neon
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// WhatsApp Business API Integration (Meta)
const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0/';
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

async function sendWhatsAppMessage(phoneNumber, message) {
    if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
        console.log('WhatsApp API não configurado - usando simulação');
        return { success: false, simulated: true };
    }

    try {
        const formattedPhone = phoneNumber.replace(/\D/g, '');
        const fullPhoneNumber = formattedPhone.startsWith('55') ? formattedPhone : `55${formattedPhone}`;

        const response = await fetch(`${WHATSAPP_API_URL}${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: fullPhoneNumber,
                type: 'text',
                text: {
                    body: message
                }
            })
        });

        const result = await response.json();
        return { success: response.ok, result, simulated: false };
    } catch (error) {
        console.error('Erro WhatsApp API:', error);
        return { success: false, error: error.message, simulated: false };
    }
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
        return res.status(400).json({ error: 'Número e mensagem são obrigatórios' });
    }

    const result = await sendWhatsAppMessage(phoneNumber, message);

    if (result.success) {
        res.json({ success: true, messageId: result.result?.messages?.[0]?.id });
    } else if (result.simulated) {
        res.json({ success: true, simulated: true, message: 'WhatsApp simulado - configure API para envio real' });
    } else {
        res.status(500).json({ error: 'Erro ao enviar WhatsApp', details: result.error });
    }
};