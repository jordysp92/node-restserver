const express = require('express')

const app = express()

//rutas usuario
app.use(require('./usuario'));

//ruta login
app.use(require('./login'));

module.exports = app;