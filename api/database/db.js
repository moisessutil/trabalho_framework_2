/*
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./products.db', (err) => {
    if (err) {
        console.error('Erro ao conectar:', err.message);
    } else {
        console.log('Conectado ao SQLite');
    }
});


db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        preco REAL NOT NULL,
        quantidade INTEGER NOT NULL
    )
`);

module.exports = db; */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Verifica se estamos no ambiente da Vercel
const isVercel = process.env.VERCEL === '1';

// Se for Vercel, usamos um banco em memória (:memory:)
// Se for local, usamos o ficheiro físico
const dbPath = isVercel ? ':memory:' : path.join(__dirname, 'products.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar:', err.message);
    } else {
        console.log(`Conectado ao SQLite em: ${dbPath}`);
    }
});

// A lógica de criação da tabela permanece a mesma
db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        preco REAL NOT NULL,
        quantidade INTEGER NOT NULL
    )
`);

module.exports = db;