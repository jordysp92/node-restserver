const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let Schema = mongoose.Schema;

let usuariosSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El campo nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El campo correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'El campo password es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuariosSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();

    //Borro del esquema el campo password a devolver en el objeto usuario
    delete userObject.password;
    return userObject;
}

usuariosSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser unico'
});

module.exports = mongoose.model('Usuario', usuariosSchema);