const UsuarioModel = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {

    // Revisa si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({
            errores: errores.array()
        })
    }

    // Extraer email y password
    const {email, password} = req.body;

    try {
        let usuario = await UsuarioModel.findOne({ email });
        if(!usuario){
            return res.status(400).json({ msg: 'El correo no existe' });
        }

        // Revisar password
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passCorrecto){
            return res.status(400).json({ msg: 'La contraseña es incorrecta' });
        }

        // Crear y firmar el jwt
        const payload = {
            usuario: {
                id: usuario.id
            }
        }

        // Firmar token
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600000
        }, (error, token) => {
            if(error) throw error;
            res.json({ token })
        });
        
    } catch (error) {
        console.log(error);
    }
}

// Obtener usuario autenticado
exports.usuarioAutenticado = async (req, res) => {

    try {
        const usuario = await UsuarioModel.findById(req.usuario.id).select('-password');
        res.json({ usuario });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }

}