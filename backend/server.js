// server.js
const express = require("express");
const cors = require("cors");
const db = require("./database"); // Conexão com MariaDB

const app = express();
app.use(cors());
app.use(express.json());

// Criar tarefa
app.post("/tarefas", async (req, res) => {
    try {
        const { titulo, descricao, coluna_id } = req.body;
        await db.execute(
            "INSERT INTO tarefas (titulo, descricao, coluna_id) VALUES (?, ?, ?)",
            [titulo, descricao, coluna_id]
        );
        res.send("Tarefa criada com sucesso");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao criar tarefa");
    }
});

// Listar tarefas
app.get("/tarefas", async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM tarefas");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao listar tarefas");
    }
});

// Deletar tarefa
app.delete("/tarefas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute("DELETE FROM tarefas WHERE id = ?", [id]);
        res.send("Tarefa deletada com sucesso");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao deletar tarefa");
    }
});

// Rodar servidor
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
