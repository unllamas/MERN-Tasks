const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const proyectoController = require('../controllers/proyectoController');

const auth = require('../middleware/auth');

// api/proyectos
router.post('/',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
);

// Obtener proyectos
router.get('/',
    auth,
    proyectoController.obtenerProyectos
);

// Actualizar proyectos vía ID
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);

// Eliminar proyecto
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);
 

module.exports = router;