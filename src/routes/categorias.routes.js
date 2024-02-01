const { Router } = require("express");
const router = Router();
const {
    obtenerCategorias,
    obtenerCategoriaId,
    guardarCategoria,
    eliminarCategoriaId,
    modificarCategoriaPorId,
} = require("../controller/categorias.controller");

// const multitenancyMiddleware = require("../middleware/multitenancyMiddleware");
const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');
const checkRoleAuth = require('../middleware/roleAuth');

router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener todas las categorias
router.get("/obtenerTodasLasCategorias", verificarTokenMiddleware,checkRoleAuth(['gerente,administrador,colaborador']), obtenerCategorias);

// Ruta para obtener una categoria por su ID
router.get("/obtenerCategoria/:id",verificarTokenMiddleware,checkRoleAuth(['gerente,administrador,colaborador']), obtenerCategoriaId);

// Ruta para modificar una categoria por su ID
router.put("/modificarCategoria/:id",verificarTokenMiddleware,checkRoleAuth(['gerente,administrador,colaborador']), modificarCategoriaPorId);

// Ruta para eliminar una categoria por su ID
router.delete("/eliminarCategoria/:id",verificarTokenMiddleware,checkRoleAuth(['gerente,administrador']), eliminarCategoriaId);

// Ruta para guardar una nueva categoria
router.post("/guardarCategoria",verificarTokenMiddleware,checkRoleAuth(['gerente,administrador']), guardarCategoria);

module.exports = router;
