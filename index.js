const express = require('express');
const path = require('path');
const app = express();

// Rota de health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Aplicação funcionando!' });
});

// Rota catch-all para SPA - serve index.html para todas as rotas não-API
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;