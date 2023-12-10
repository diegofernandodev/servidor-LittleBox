const { Router } = require("express");
const router = Router();
const {
  obtenerEmpresas,
  obtenerEmpresaPorId,
  guardarEmpresa,
  eliminarEmpresaPorId,
  modificarEmpresaPorId,
} = require("../controller/empresas.controller");


router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener todas las empresas
router.get("/obtenerTodasLasEmpresas",obtenerEmpresas);

// Ruta para obtener una empresa por su ID
router.get("/obtenerEmpresa/:id",obtenerEmpresaPorId);

// Ruta para modificar una empresa por su ID
router.put("/modificarEmpresa/:id", modificarEmpresaPorId);

// Ruta para eliminar una empresa por su ID
router.delete("/eliminarEmpresa/:id", eliminarEmpresaPorId);

// Ruta para guardar una empresa por su ID
router.post("/guardarEmpresa",  guardarEmpresa);

module.exports = router;
