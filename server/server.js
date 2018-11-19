require('./config/config')

const express = require('express')
const app = express()
const path = require('path')

const mongoose = require('mongoose')

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public/')));

//Configuracion de rutas generales de la aplicacion
app.use(require('./routes/index'));

/*Mongoose connection*/
mongoose.connect(process.env.URLDB, (err, resp) => {
    if (err)
        throw err;
    console.log('Base de datos conectada');
});

/***** Host web aplicacion****** */
app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto: 3000`);
})