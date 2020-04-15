const ProyectoModel = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {
    
    // Revisa si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({
            errores: errores.array()
        })
    }

    try {
        // Crear nuevo proyecto
        const proyecto = new ProyectoModel(req.body);

        // Guardar creador via jwt
        proyecto.creador = req.usuario.id;

        // Guardar proyecto
        proyecto.save();
        res.json(proyecto);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ups!'})
    }
}

// Obtener todos los proyectos del usuario
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await ProyectoModel.find({ creador: req.usuario.id }).sort({ creado: -1 });
        res.json(proyectos);
    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: 'Hubo un error' })
    }
}

// Actualizar proyecto
exports.actualizarProyecto = async (req, res) => {

    // Revisa si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({
            errores: errores.array()
        })
    }

    // Extraer info
    const {nombre} = req.body;
    const nuevoProyecto = {};
    
    if(nombre){
        nuevoProyecto.nombre = nombre;
    }

    try {
        // Revisar ID
        let proyecto = await ProyectoModel.findById(req.params.id);
        console.log(proyecto)

        // Existe proyecto
        if(!proyecto){
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Verificar creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // Actualizar
        proyecto = await ProyectoModel.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto}, { new: true });
        res.json({ proyecto });

    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: 'Ups!' });
    }
}

// Eliminar proyecto
exports.eliminarProyecto = async (req, res) => {
    try {
        // Revisar ID
        let proyecto = await ProyectoModel.findById(req.params.id);
        console.log(proyecto)

        // Existe proyecto
        if(!proyecto){
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Verificar creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // Eliminar proyecto
        await ProyectoModel.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Proyecto eliminado' });

    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: 'Ups!' });
    }


}