const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const tareaController = require('../controllers/tareaController');

const auth = require('../middleware/auth');

// api/tareas

// Crear tarea
router.post('/',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
);

// Obtener tareas por proyecto
router.get('/',
    auth,
    tareaController.obtenerTareas
);

// Actualizar tarea
router.put('/:id',
    auth,
    tareaController.actualizarTarea
);

// Eliminar tarea
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
);

module.exports = router; 