const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'Makrex0465!',
  server: 'localhost',
  database: 'Agrobelloso',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

async function testConexion() {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Productos`;
    console.log('Datos obtenidos:', result.recordset);
    process.exit(0);
  } catch (err) {
    console.error('Error en la conexión o consulta:', err);
    process.exit(1);
  }
}

testConexion();
