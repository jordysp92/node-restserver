const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

let Producto = require('../models/producto');


//Obtener productos
app.get('/productos', verificaToken, (req, resp) => {

    // se obtienen todos los productos
    //populate: usuario categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((error, productos) => {
            if (error) {
                return resp.status(500).json({
                    ok: false,
                    error
                });
            }

            Producto.count({}, (error, conteo) => {
                return resp.json({
                    ok: true,
                    productos: productos,
                    conteo: conteo
                });
            })


        })

});

//Obtener un producto por id
app.get('/productos/:id', verificaToken, (req, resp) => {
    //se obtiene un producto
    //populate: usuario categoria

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((error, productoDB) => {
            if (error) {
                return resp.status(500).json({
                    ok: false,
                    error
                });
            }
            if (!productoDB) {
                return resp.status(400).json({
                    ok: false,
                    error: {
                        message: 'El id no existe'
                    }
                });
            }
            resp.json({
                ok: true,
                producto: productoDB
            })
        })

});

//Buscar productos
app.get('/productos/buscar/:termino', verificaToken, (req, resp) => {
    let termino = req.params.termino;

    let regexTermino = new RegExp(termino, 'i');

    Producto.find({ nombre: regexTermino })
        .populate('categoria', 'nombre')
        .exec((error, productos) => {
            if (error) {
                return resp.status(500).json({
                    ok: false,
                    error
                });
            }
            resp.json({
                ok: true,
                productos: productos
            })
        })
})

//Se crea producto
app.post('/producto', verificaToken, (req, resp) => {
    //grabar usuario
    //grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        usuario: req.usuario._id,
        categoria: body.categoria
    });

    producto.save((error, productoDB) => {
        if (error) {
            return resp.status(500).json({
                ok: false,
                error
            });
        }

        if (!productoDB) {
            return resp.status(400).json({
                ok: false,
                error
            });
        } else {
            resp.json({
                ok: true,
                producto: productoDB
            })
        }
    })

});

//Se actualiza un producto
app.put('/productos/:id', verificaToken, (req, resp) => {
    //grabar usuario
    //grabar una categoria del listado

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (error, productoDB) => {
        if (error) {
            return resp.status(500).json({
                ok: false,
                error
            });
        }

        if (!productoDB) {
            return resp.status(500).json({
                ok: false,
                error: {
                    message: 'El id no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((error, productoGuardado) => {
            if (error) {
                return resp.status(500).json({
                    ok: false,
                    error
                });
            }

            resp.json({
                ok: true,
                producto: productoGuardado
            })
        })
    })

});

//Se borra producto
app.delete('/productos/:id', verificaToken, (req, resp) => {
    //borrar producto: cambiar estado disponible a false

    let id = req.params.id;

    Producto.findById(id, (error, productoDB) => {
        if (error) {
            return resp.status(500).json({
                ok: false,
                error
            });
        }
        if (!productoDB) {
            return resp.status(400).json({
                ok: false,
                error: {
                    message: 'El producto no existe'
                }
            });
        }

        productoDB.disponible = false;
        productoDB.save((error, productoBorrado) => {
            if (error) {
                return resp.status(500).json({
                    ok: false,
                    error
                });
            }

            resp.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto Borrado'
            })
        })
    });

});

module.exports = app;