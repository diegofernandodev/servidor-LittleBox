const { Router } = require("express");
const router = Router();
const {
    obtenerSolicitudes,
    obtenerSolicitudesPorId,
    guardarSolicitud,
    eliminarSolicitudPorId,
    modificarSolicitudPorId,
    cambiarEstadoSolicitud,
} = require("../controller/solicitud.controller");

// const multitenancyMiddleware = require("../middleware/multitenancyMiddleware");
const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');
const checkRoleAuth = require('../middleware/roleAuth');


router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener todas las solicitudes
router.get("/obtenerTodasLasSolicitudes", verificarTokenMiddleware,checkRoleAuth(['gerente', 'administrador', 'colaborador']),obtenerSolicitudes);

// Ruta para obtener una solicitud por su ID
router.get("/obtenerSolicitud/:id", verificarTokenMiddleware,checkRoleAuth(['administrador']),obtenerSolicitudesPorId);

// Ruta para modificar una solicitud por su ID
router.put("/modificarSolicitud/:id", verificarTokenMiddleware, checkRoleAuth(['gerente', 'administrador']), modificarSolicitudPorId);

// Ruta para modificar estado de una solicitud por su ID
router.put("/modificarEstadoSolicitud/:id", verificarTokenMiddleware, checkRoleAuth(['gerente', 'administrador']), cambiarEstadoSolicitud);

// Ruta para eliminar una solicitud por su ID
router.delete("/eliminarSolicitud/:id", verificarTokenMiddleware,checkRoleAuth(['gerente']),eliminarSolicitudPorId);

// Ruta para guardar una solicitud por su ID
router.post("/guardarSolicitud", verificarTokenMiddleware,checkRoleAuth(['administrador']),guardarSolicitud);

module.exports = router;