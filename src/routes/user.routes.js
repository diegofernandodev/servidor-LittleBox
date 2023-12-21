const { Router } = require("express");
const router = Router();
const {
    guardarUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    eliminarUsuarioPorId,
    modificarUsuarioPorId,
    loginUser,
} = require("../controller/user.controller");

const multitenancyMiddleware = require("../middleware/multitenancyMiddleware");

router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener todos los usuarios
router.get("/obtenerTodosLosUsuarios", multitenancyMiddleware, obtenerUsuarios);

// Ruta para obtener un usuario por su ID
router.get("/obtenerUsuario/:id",multitenancyMiddleware, obtenerUsuarioPorId);

// Ruta para modificar un usuario por su ID
router.put("/modificarUsuario/:id",multitenancyMiddleware, modificarUsuarioPorId);

// Ruta para eliminar un usuario por su ID
router.delete("/eliminarUsuario/:id",multitenancyMiddleware, eliminarUsuarioPorId);

// Ruta para guardar una nueva categoria
router.post("/guardarUsuario",multitenancyMiddleware, guardarUsuario);

// Ruta para iniciar sesión
router.post("/login",multitenancyMiddleware, loginUser);

module.exports = router;
