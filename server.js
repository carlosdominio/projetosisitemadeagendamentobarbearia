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