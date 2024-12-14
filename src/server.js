const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const empresaRoutes = require('./routes/empresaRoutes');
const productoRoutes = require('./routes/productoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const personalRoutes = require('./routes/personalRoutes');
const transaccionRoutes = require('./routes/transaccionRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
   res.json({ message: 'API del Sistema de Inventario' });
});

// Rutas
app.use('/api/empresas', empresaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/personal', personalRoutes);
app.use('/api/transacciones', transaccionRoutes);

// Ruta de prueba para verificar la conexión a la base de datos
app.get('/api/test-db', async (req, res) => {
   try {
       const [rows] = await db.query('SELECT 1 as test');
       res.json({ message: 'Conexión a la base de datos exitosa', data: rows });
   } catch (error) {
       res.status(500).json({ message: 'Error conectando a la base de datos', error: error.message });
   }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
   console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Manejo de errores
app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).json({ message: 'Algo salió mal!', error: err.message });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
   res.status(404).json({ message: 'Ruta no encontrada' });
});
