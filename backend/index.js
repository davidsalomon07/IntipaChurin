const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Importamos la conexión que acabamos de crear

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint de prueba para verificar que el servidor responde
app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'Servidor de Intipa Churin funcionando',
    db_status: 'Conectada' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});