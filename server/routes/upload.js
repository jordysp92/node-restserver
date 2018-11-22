const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;


    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    //validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Los tipos validos son ' + tiposValidos.join(', ')
            }
        })
    }

    let archivo = req.files.archivo;
    let nombreRecorte = archivo.name.split('.');

    let extension = nombreRecorte[nombreRecorte.length - 1];


    //Extensiones validas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Las extensiones validas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    // nombre de archivo unico
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;


    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (error) => {
        if (error)
            return res.status(500).json({
                ok: false,
                error
            });
        //Grabo imagen en usuario o producto
        if (tipo == 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);

        }

    });
});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (error, usuarioDB) => {
        if (error) {
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                error
            })
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no existe'
                }
            })
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((error, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })

    })
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (error, productoDB) => {
        if (error) {
            borraArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                error
            })
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Producto no existe'
                }
            })
        }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((error, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        })

    })
}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;