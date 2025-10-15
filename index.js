const express = require('express');
const path = require('path');
const app = express();

// Servir arquivos estáticos primeiro (antes das rotas dinâmicas)
app.use(express.static(path.join(__dirname, '.')));

// Rota de health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Aplicação funcionando!' });
});

// Rota catch-all para SPA (deve ser a última)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;