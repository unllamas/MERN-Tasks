const express = require('express');
const router = express.Router();

const { check } = require('express-validator');

const usuarioController = require('../controllers/usuarioController')

// Crear usuario
// api/usuarios

router.post('/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un correo válido').isEmail(),
        check('password', 'La contraseña debe ser mínimo de 6 caracteres').isLength({ min: 6 }),
    ],
    usuarioController.crearUsuario
)

module.exports = router;