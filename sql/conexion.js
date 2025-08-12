// Conexión/Conexion.js
const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'Makrex0465!',
    server: 'localhost',
    database: 'Agrobelloso',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

let pool;

async function getPool() {
    if (pool) return pool;
    try {
        pool = await sql.connect(config);
        console.log("Conexión a la base de datos establecida");
        return pool;
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        throw error;
    }
}

module.exports = {
    sql,
    getPool
};