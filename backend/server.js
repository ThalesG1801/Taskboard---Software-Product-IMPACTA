// server.js
const express = require("express");
const cors = require("cors");
const db = require("./database"); // Conexão com MariaDB

const app = express();
app.use(cors());
app.use(express.json());

// Rota teste
app.get("/", (req, res) => {
    res.send("API TaskBoard funcionando com MariaDB!");
});

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


app.put("/tarefas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descricao, coluna_id } = req.body;

        // Pega os dados atuais da tarefa
        const [rows] = await db.execute("SELECT * FROM tarefas WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).send("Tarefa não encontrada");
        }

        const tarefaAtual = rows[0];

        // Usa os valores novos OU mantém os antigos
        const novoTitulo = titulo ?? tarefaAtual.titulo;
        const novaDescricao = descricao ?? tarefaAtual.descricao;
        const novaColuna = coluna_id ?? tarefaAtual.coluna_id;

        await db.execute(
            "UPDATE tarefas SET titulo = ?, descricao = ?, coluna_id = ? WHERE id = ?",
            [novoTitulo, novaDescricao, novaColuna, id]
        );

        res.send("Tarefa atualizada com sucesso");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao atualizar tarefa");
    }
});
// Rodar servidor
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
