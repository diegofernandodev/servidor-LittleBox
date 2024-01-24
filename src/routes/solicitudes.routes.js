const { Router } = require("express");
const router = Router();
const {
    obtenerSolicitudes,
    obtenerSolicitudesPorId,
    guardarSolicitud,
    eliminarSolicitudPorId,
    modificarSolicitudPorId
} = require("../controller/solicitud.controller");

// const multitenancyMiddleware = require("../middleware/multitenancyMiddleware");
const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');
const checkRoleAuth = require('../middleware/roleAuth');


router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener todas las solicitudes
router.get("/obtenerTodasLasSolicitudes", verificarTokenMiddleware,obtenerSolicitudes);

// Ruta para obtener una solicitud por su ID
router.get("/obtenerSolicitud/:id", verificarTokenMiddleware,obtenerSolicitudesPorId);

// Ruta para modificar una solicitud por su ID
router.put("/modificarSolicitud/:id", verificarTokenMiddleware, checkRoleAuth(['administrador']), modificarSolicitudPorId);

// Ruta para eliminar una solicitud por su ID
router.delete("/eliminarSolicitud/:id", verificarTokenMiddleware,  eliminarSolicitudPorId);

// Ruta para guardar una solicitud por su ID
router.post("/guardarSolicitud", verificarTokenMiddleware,  guardarSolicitud);

module.exports = router;