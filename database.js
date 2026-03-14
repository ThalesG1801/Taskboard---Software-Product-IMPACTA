const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function connect() {
    return open({
        filename: "../database/taskboard.db",
        driver: sqlite3.Database
    });
}

module.exports = connect;