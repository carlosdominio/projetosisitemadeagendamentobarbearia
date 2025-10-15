const express = require('express');
const path = require('path');
const app = express();

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '.')));

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota de health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Aplicação funcionando!' });
});

module.exports = app;