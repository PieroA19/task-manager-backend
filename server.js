const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const auth = require('basic-auth');
require('dotenv').config();

const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde "views"
app.use(express.static(path.join(__dirname, 'views')));

// Rutas API
app.use('/api/tasks', taskRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.send('Servidor del gestor de tareas funcionando ✅');
});

// Middleware de autenticación básica
function requireAuth(req, res, next) {
  const user = auth(req);
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;

  if (user && user.name === adminUser && user.pass === adminPass) {
    next();
  } else {
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    res.status(401).send('Autenticación requerida.');
  }
}

// Ruta protegida para vista de administrador
app.get('/admin', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error al conectar a MongoDB:', err);
  });
