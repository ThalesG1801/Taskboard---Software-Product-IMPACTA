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

//Listar boards
app.get("/boards", async (req, res) => {
    try {
        const [boards] = await db.execute(
            "SELECT * FROM boards ORDER BY id"
        );

        res.json(boards);

    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao buscar boards");
    }
});

//Criar boards
app.post("/boards", async (req, res) => {
    try {
        const { nome } = req.body;

        await db.execute(
            "INSERT INTO boards (nome) VALUES (?)",
            [nome]
        );

        res.send("Board criado com sucesso");

    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao criar board");
    }
});

//Editar board
app.put("/boards/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nome } = req.body;

        await db.execute(
            "UPDATE boards SET nome = ? WHERE id = ?",
            [nome, id]
        );

        res.send("Board atualizado com sucesso");

    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao atualizar board");
    }
});

//Excluir board
app.delete("/boards/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await db.execute(
            "DELETE FROM tarefas WHERE board_id = ?",
            [id]
        );

        await db.execute(
            "DELETE FROM boards WHERE id = ?",
            [id]
        );

        res.send("Board removido com sucesso");

    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao excluir board");
    }
});

// Criar tarefa
app.post("/tarefas", async (req, res) => {
    try {
        const {titulo, descricao, coluna_id, prioridade, prazo, board_id} = req.body;
        await db.execute(
            "INSERT INTO tarefas (titulo, descricao, coluna_id, prioridade, prazo, board_id) VALUES (?, ?, ?, ?, ?, ?)",
            [titulo, descricao, coluna_id, prioridade, prazo, board_id]
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

        const board_id = req.query.board_id;

        let rows;

        if (board_id) {
            [rows] = await db.execute(
                "SELECT * FROM tarefas WHERE board_id = ?",
                [board_id]
            );
        } else {
            [rows] = await db.execute(
                "SELECT * FROM tarefas"
            );
        }

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
        const { titulo, descricao, coluna_id, prioridade, prazo } = req.body;

        const [rows] = await db.execute(
            "SELECT * FROM tarefas WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).send("Tarefa não encontrada");
        }

        const tarefaAtual = rows[0];

        const novoTitulo = titulo ?? tarefaAtual.titulo;
        const novaDescricao = descricao ?? tarefaAtual.descricao;
        const novaColuna = coluna_id ?? tarefaAtual.coluna_id;
        const novaPrioridade = prioridade ?? tarefaAtual.prioridade;
        const novoPrazo = prazo ?? tarefaAtual.prazo;

        await db.execute(
            "UPDATE tarefas SET titulo = ?, descricao = ?, coluna_id = ?, prioridade = ?, prazo = ? WHERE id = ?",
            [novoTitulo, novaDescricao, novaColuna, novaPrioridade, novoPrazo, id]
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
