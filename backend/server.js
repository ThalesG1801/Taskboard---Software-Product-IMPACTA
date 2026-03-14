const express = require("express");
const cors = require("cors");
const connect = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API TaskBoard funcionando");
});

app.post("/tarefas", async (req, res) => {
    const db = await connect();

    const { titulo, descricao, coluna_id } = req.body;

    await db.run(
        "INSERT INTO tarefas (titulo, descricao, coluna_id) VALUES (?, ?, ?)",
        [titulo, descricao, coluna_id]
    );

    res.send("Tarefa criada com sucesso");
});

app.get("/tarefas", async (req, res) => {
    const db = await connect();

    const tarefas = await db.all("SELECT * FROM tarefas");

    res.json(tarefas);
});
app.delete("/tarefas/:id", async (req, res) => {
    const db = await connect();

    const { id } = req.params;

    await db.run("DELETE FROM tarefas WHERE id = ?", [id]);

    res.send("Tarefa deletada com sucesso");
});
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});