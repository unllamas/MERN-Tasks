const TareaModel = require('../models/Tarea');
const ProyectoModel = require('../models/Proyecto');

const { validationResult } = require('express-validator');

// Crear tarea
exports.crearTarea = async (req, res) => {

    // Revisa si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({
            errores: errores.array()
        })
    }
    
    try {
        // Extraer proyecto y comprobar si existe
        const { proyecto } = req.body;
        const proyectoExiste = await ProyectoModel.findById(proyecto);
        if(!proyectoExiste){
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Verificar creador del proyecto
        if(proyectoExiste.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // Crear tarea
        const tarea = new TareaModel(req.body);
        await tarea.save();
        res.json(tarea);

    } catch (error) {
        res.status(500).send('Ups, cagaste')
    }

}

// Obtener tareas por proyecto
exports.obtenerTareas = async (req, res) => {
    try {
        // Extraer proyecto y comprobar si existe
        const { proyecto } = req.query;

        const proyectoExiste = await ProyectoModel.findById(proyecto);
        if(!proyectoExiste){
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Verificar creador del proyecto
        if(proyectoExiste.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // Obtener tareas por proyecto
        const tareas = await TareaModel.find({ proyecto }).sort({ creado: -1 });
        res.json({ tareas });

    } catch (error) {
        res.status(500).send('Ups, problemas con el server')
    }
}

// Actualizar tarea
exports.actualizarTarea = async (req, res) => {

    try {
        // Extraer proyecto y comprobar si existe
        const { proyecto, nombre, estado } = req.body;

        // Validar si tarea existe
        let tarea = await TareaModel.findById(req.params.id);
        if(!tarea) return res.status(404).json({ msg: 'No existe esa tarea' }); 

        // Extraer proyecto
        const proyectoExiste = await ProyectoModel.findById(proyecto);

        // Verificar creador del proyecto
        if(proyectoExiste.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // Crear objeto con nueva información
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        // Guardar tarea
        tarea = await TareaModel.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });
        res.json({tarea});

    } catch (error) {
        res.status(500).send('Ups, problemas con el server')
    }

}

// Eliminar tarea
exports.eliminarTarea = async (req, res) => {

    try {
        // Extraer proyecto y comprobar si existe
        const { proyecto } = req.query;

        // Validar si tarea existe
        let tarea = await TareaModel.findById(req.params.id);
        if(!tarea) return res.status(404).json({ msg: 'No existe esa tarea' }); 

        // Extraer proyecto
        const proyectoExiste = await ProyectoModel.findById(proyecto);

        // Verificar creador del proyecto
        if(proyectoExiste.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No autorizado' });
        }
        
        // Eliminar tarea
        await TareaModel.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Tarea eliminada' }); 

    } catch (error) {
        res.status(500).send('Ups, problemas con el serverrrr')
    }
}