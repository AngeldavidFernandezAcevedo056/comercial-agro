

// index.js
const express = require('express');
const path = require('path');
const app = express();

// 1. Motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// 3. Importar la ruta de productos
const productosRouter = require('../Vue/productos');
app.use('/productos', productosRouter); // esto hará que /productos muestre el EJS

// 4. Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



