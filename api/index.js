const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const produtosRoutes = require('./routes/produtos');

app.use(cors());
app.use(express.json());

// ... suas rotas e middlewares (cors, express.json, etc.)
//app.use('/produtos', produtosRoutes);
app.use('/api/produtos', produtosRoutes);

// Exportar o app para a Vercel gerenciar as requisições
module.exports = app;

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});