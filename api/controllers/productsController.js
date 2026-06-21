const db = require('../database/db');


exports.createProduct = (req, res) => {
    const { nome, preco, quantidade } = req.body;

    const sql = `INSERT INTO produtos (nome, preco, quantidade) VALUES (?, ?, ?)`;

    db.run(sql, [nome, preco, quantidade], function(err) {
        if (err) {
            return res.status(500).json(err.message);
        }
        res.json({ id: this.lastID, nome, preco, quantidade });
    });
};


exports.getProducts = (req, res) => {
    db.all(`SELECT * FROM produtos`, [], (err, rows) => {
        if (err) {
            return res.status(500).json(err.message);
        }
        res.json(rows);
    });
};


exports.getProductById = (req, res) => {
    const id = req.params.id;

    db.get(`SELECT * FROM produtos WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return res.status(500).json(err.message);
        }
        res.json(row);
    });
};


exports.updateProduct = (req, res) => {
    const id = req.params.id;
    const { nome, preco, quantidade } = req.body;

    const sql = `
        UPDATE produtos
        SET nome = ?, preco = ?, quantidade = ?
        WHERE id = ?
    `;

    db.run(sql, [nome, preco, quantidade, id], function(err) {
        if (err) {
            return res.status(500).json(err.message);
        }

        res.json({
            id: Number(id),
            nome,
            preco,
            quantidade
        });
    });
};


exports.deleteProduct = (req, res) => {
    const id = req.params.id;

    db.run(`DELETE FROM produtos WHERE id = ?`, [id], function(err) {
        if (err) {
            return res.status(500).json(err.message);
        }
        res.json({ message: 'Produto deletado' });
    });
};