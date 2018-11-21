const express = require('express');

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

//Se encarga de mostrar todas las categorias
app.get('/categoria', verificaToken, (req, resp) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((error, categorias) => {
            if (error) {
                return resp.status(500).json({
                    ok: false,
                    error
                });
            }

            Categoria.count({}, (error, conteo) => {
                return resp.json({
                    ok: true,
                    categorias: categorias,
                    conteo: conteo
                });
            })


        })
})

//Mostrar una categoria por id
app.get('/categoria/:id', verificaToken, (req, resp) => {
    let id = req.params.id;

    Categoria.findById(id, (error, categoriaDB) => {
        if (error) {
            return resp.status(500).json({
                ok: false,
                error
            });
        }

        if (!categoriaDB) {
            return resp.status(500).json({
                ok: false,
                error: {
                    message: 'La categoria no existe'
                }
            });
        }

        resp.json({
            ok: true,
            categoria: categoriaDB
        })
    })

})

//Se crea una nueva categoria
app.post('/categoria', verificaToken, (req, resp) => {
    // regresa la nueva categoria
    //req.usuario._id

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((error, categoriaDB) => {
        if (error) {
            resp.status(500).json({
                ok: false,
                error
            });
        }

        if (!categoriaDB) {
            resp.status(400).json({
                ok: false,
                error
            });
        } else {
            resp.json({
                ok: true,
                categoria: categoriaDB
            })
        }
    })

})

//Actualizar una categoria por id
app.put('/categoria/:id', verificaToken, (req, resp) => {

    let id = req.params.id;

    let body = req.body;

    let desCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, desCategoria, { new: true, runValidators: true }, (error, categoriaDB) => {
        if (error) {
            return resp.status(500).json({
                ok: false,
                error
            });
        }

        if (!categoriaDB) {
            return resp.status(400).json({
                ok: false,
                error
            });
        }

        resp.json({
            ok: true,
            categoria: categoriaDB
        })
    })
})

//Actualizar una categoria por id
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, resp) => {
    //solo un admin puede borrar categorias, borrado logico
    let id = req.params.id;

    Categoria
        .findByIdAndRemove(id, (error, categoriaDB) => {
            if (error) {
                return resp.status(500).json({
                    ok: false,
                    error
                });
            }

            if (!categoriaDB) {
                return resp.status(400).json({
                    ok: false,
                    error: {
                        message: 'El id no existe'
                    }
                });
            }

            resp.json({
                ok: true,
                message: 'Categoria borrada'
            })
        })
})



module.exports = app;