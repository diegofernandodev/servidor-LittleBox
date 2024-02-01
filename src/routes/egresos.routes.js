const { Router } = require("express");
const router = Router();
const {
  obtenerEgresoPorId,
  obtenerEgresos,
  modificarEgresoPorId,
  eliminarEgresoPorId,
  guardarEgreso,
} = require("../controller/egresos.controller");

// const multitenancyMiddleware = require("../middleware/multitenancyMiddleware");
const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');
const checkRoleAuth = require('../middleware/roleAuth');


router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener todos los egresos
router.get("/obtenerTodosLosEgresos", verificarTokenMiddleware,checkRoleAuth(['administrador']),obtenerEgresos);

// Ruta para obtener un egreso por su ID
router.get("/obtenerEgreso/:id", verificarTokenMiddleware,checkRoleAuth(['gerente,administrador,colaborador']),obtenerEgresoPorId);

// Ruta para modificar un egreso por su ID
router.put("/modificarEgreso/:id", verificarTokenMiddleware,checkRoleAuth(['gerente,administrador']),modificarEgresoPorId);

// Ruta para eliminar un egreso por su ID
router.delete("/eliminarEgreso/:id", verificarTokenMiddleware,checkRoleAuth(['gerente']),eliminarEgresoPorId);

// Ruta para guardar un nuevo egreso
router.post("/guardarEgreso", verificarTokenMiddleware,checkRoleAuth(['administrador']),guardarEgreso);

module.exports = router;
