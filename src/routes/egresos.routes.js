const { Router } = require("express");
const router = Router();
const {
  obtenerEgresoPorId,
  obtenerEgresos,
  modificarEgresoPorId,
  eliminarEgresoPorId,
  guardarEgreso,
} = require("../controller/egresos.controller");

const multitenancyMiddleware = require("../middleware/multitenancyMiddleware");


router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener todos los egresos
router.get("/obtenerTodosLosEgresos", multitenancyMiddleware,obtenerEgresos);

// Ruta para obtener un egreso por su ID
router.get("/obtenerEgreso/:id", multitenancyMiddleware,obtenerEgresoPorId);

// Ruta para modificar un egreso por su ID
router.put("/modificarEgreso/:id", multitenancyMiddleware,modificarEgresoPorId);

// Ruta para eliminar un egreso por su ID
router.delete("/eliminarEgreso/:id", multitenancyMiddleware,eliminarEgresoPorId);

// Ruta para guardar un nuevo egreso
router.post("/guardarEgreso", multitenancyMiddleware,guardarEgreso);

module.exports = router;
