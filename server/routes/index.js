const express = require('express')

const app = express()

//rutas usuario
app.use(require('./usuario'));

//ruta login
app.use(require('./login'));

//ruta categoria
app.use(require('./categoria'));

//ruta producto
app.use(require('./producto'));

//ruta archivos
app.use(require('./upload'));

//ruta imagenes
app.use(require('./imagenes'));

module.exports = app;