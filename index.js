const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Servir arquivos estáticos primeiro (antes das rotas dinâmicas)
app.use(express.static(path.join(__dirname, '.')));

// Rota de health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Aplicação funcionando!' });
});

// Rota catch-all para SPA (deve ser a última)
// Verifica se o arquivo existe fisicamente antes de servir index.html
app.get('*', (req, res) => {
    const filePath = path.join(__dirname, req.path);

    // Se o arquivo existe, serve normalmente (caso o static não tenha pegado)
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return res.sendFile(filePath);
    }

    // Caso contrário, serve o index.html para SPA routing
    res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;