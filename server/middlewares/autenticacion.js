const jwt = require('jsonwebtoken')

// =============
// Verificar token
// =============

let verificaToken = (req, res, next) => {

    //obtengo del header el parametro token
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (error, decoded) => {
        if (error) {
            return res.status(401).json({
                ok: false,
                error: {
                    message: 'Token no valido'
                }
            })
        }

        req.usuario = decoded.usuario;
        next();
    })

};


// =============
// Verificar Admin Role
// =============

let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {

        return res.json({
            ok: false,
            error: {
                message: 'El usuario no es administrador'
            }
        })
    }




};

module.exports = {
    verificaToken: verificaToken,
    verificaAdminRole: verificaAdminRole
}