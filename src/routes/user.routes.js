const { Router } = require("express");
const router = Router();
const {
    guardarUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    eliminarUsuarioPorId,
    modificarUsuarioPorId,
} = require("../controller/user.controller");
const{resetPassword, restablecerPassword, logout} = require("../controller/login.controller")

// const multitenancyMiddleware = require("../middleware/multitenancyMiddleware");
const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');

router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener todos los usuarios
router.get("/obtenerTodosLosUsuarios", verificarTokenMiddleware, obtenerUsuarios);

// Ruta para obtener un usuario por su ID
router.get("/obtenerUsuario/:id",verificarTokenMiddleware, obtenerUsuarioPorId);

// Ruta para modificar un usuario por su ID
router.put("/modificarUsuario",verificarTokenMiddleware, modificarUsuarioPorId);

// Ruta para eliminar un usuario por su ID
router.delete("/eliminarUsuario/:id",verificarTokenMiddleware, eliminarUsuarioPorId);

// Ruta para guardar una nueva categoria
router.post("/guardarUsuario",verificarTokenMiddleware, guardarUsuario);


// Ruta para enviar correo de restablecer contraseña
router.post("/resetPassword",verificarTokenMiddleware, resetPassword);

// Ruta para restablecer la contraseña
router.put("/newPassword",verificarTokenMiddleware, restablecerPassword);

// Ruta para cerrar sesion
router.post("/logout",verificarTokenMiddleware, logout);


module.exports = router;
