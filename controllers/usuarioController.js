const UsuarioModel = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

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
        // Revisar que el correo sea único
        let usuario = await UsuarioModel.findOne({ email });
        if(usuario){
            return res.status(400).json({
                msg: 'El usuario ya existe'
            })
        }
        
        // Crea el nuevo usuario
        usuario = new UsuarioModel(req.body);
        
        // Hashear contraseña de usuario
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);
        
        // Guardar usuario
        await usuario.save();

        // Crear y firmar el jwt
        const payload = {
            usuario: {
                id: usuario.id
            }
        }

        // Firmar token
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600
        }, (error, token) => {
            if(error) throw error;
            res.json({ token })
        });

        // Mensaje de confirmación
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error')
    }
}