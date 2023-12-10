const { Router } = require("express");
const router = Router();
const {
  obtenerTerceros,
  obtenerTerceroPorId,
  guardarTercero,
  eliminarTerceroPorId,
  modificarTerceroPorId,
} = require("../controller/terceros.controller");

const multitenancyMiddleware = require("../middleware/multitenancyMiddleware");


router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener todos los terceros
router.get("/obtenerTodosLosTerceros", multitenancyMiddleware,obtenerTerceros);

// Ruta para obtener un tercero por su ID
router.get("/obtenerTercero/:id", multitenancyMiddleware,obtenerTerceroPorId);

// Ruta para modificar un tercero por su ID
router.put("/modificarTercero/:id", multitenancyMiddleware,modificarTerceroPorId);

// Ruta para eliminar un tercero por su ID
router.delete("/eliminarTercero/:id", multitenancyMiddleware,eliminarTerceroPorId);

// Ruta para guardar un nuevo egreso
router.post("/guardarTercero", multitenancyMiddleware,guardarTercero);

module.exports = router;
