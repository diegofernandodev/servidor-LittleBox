const { Router } = require("express");
const router = Router();
const {
  obtenerTerceros,
  obtenerTerceroPorId,
  guardarTercero,
  eliminarTerceroPorId,
  modificarTerceroPorId,
} = require("../controller/terceros.controller");

// const multitenancyMiddleware = require("../middleware/multitenancyMiddleware");
const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');


router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener todos los terceros
router.get("/obtenerTodosLosTerceros", verificarTokenMiddleware,obtenerTerceros);

// Ruta para obtener un tercero por su ID
router.get("/obtenerTercero/:id", verificarTokenMiddleware,obtenerTerceroPorId);

// Ruta para modificar un tercero por su ID
router.put("/modificarTercero/:id", verificarTokenMiddleware,modificarTerceroPorId);

// Ruta para eliminar un tercero por su ID
router.delete("/eliminarTercero/:id", verificarTokenMiddleware,eliminarTerceroPorId);

// Ruta para guardar un nuevo egreso
router.post("/guardarTercero", verificarTokenMiddleware,guardarTercero);

module.exports = router;
