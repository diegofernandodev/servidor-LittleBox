const { Router } = require("express");
const router = Router();
const {
    obtenerCategorias,
    obtenerCategoriaId,
    guardarCategoria,
    eliminarCategoriaId,
    modificarCategoriaPorId,
} = require("../controller/categorias.controller");

const multitenancyMiddleware = require("../middleware/multitenancyMiddleware");

router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener todas las categorias
router.get("/obtenerTodasLasCategorias", multitenancyMiddleware, obtenerCategorias);

// Ruta para obtener una categoria por su ID
router.get("/obtenerCategoria/:id",multitenancyMiddleware, obtenerCategoriaId);

// Ruta para modificar una categoria por su ID
router.put("/modificarCategoria/:id",multitenancyMiddleware, modificarCategoriaPorId);

// Ruta para eliminar una categoria por su ID
router.delete("/eliminarCategoria/:id",multitenancyMiddleware, eliminarCategoriaId);

// Ruta para guardar una nueva categoria
router.post("/guardarCategoria",multitenancyMiddleware, guardarCategoria);

module.exports = router;
