const { Pool } = require('pg');
require('dotenv').config();

// Configuramos la conexión usando tus variables del .env
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Verificación inicial de la conexión
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error crítico al conectar con PostgreSQL:', err.message);
    console.log('Revisa que tu servidor de Postgres esté encendido y que los datos del .env sean correctos.');
  } else {
    console.log('✅ Conexión exitosa a la base de datos: Intipa_Churin');
    console.log('Hora del servidor DB:', res.rows[0].now);
  }
});

module.exports = pool;