const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Configuração do banco de dados Neon
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// WhatsApp Business API Integration
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

// Rota para enviar WhatsApp
app.post('/api/whatsapp/send', async (req, res) => {
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
});

// Rotas básicas
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});

// Rota para agendamentos
app.get('/api/appointments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM appointments');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
});

app.post('/api/appointments', async (req, res) => {
    const { client_id, date, time, service } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO appointments (client_id, date, time, service) VALUES ($1, $2, $3, $4) RETURNING *',
            [client_id, date, time, service]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar agendamento' });
    }
});

// Rota para clientes
app.get('/api/clients', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM clients');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
});

app.post('/api/clients', async (req, res) => {
    const { name, email, phone } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO clients (name, email, phone) VALUES ($1, $2, $3) RETURNING *',
            [name, email, phone]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar cliente' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});