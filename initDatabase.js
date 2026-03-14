const connect = require("./database");

async function createTables() {
    const db = await connect();

    await db.exec(`
        CREATE TABLE IF NOT EXISTS boards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS colunas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            board_id INTEGER
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT,
            descricao TEXT,
            coluna_id INTEGER
        );
    `);

    console.log("Tabelas criadas com sucesso");
}

createTables();