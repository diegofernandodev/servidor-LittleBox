const mongoose = require("mongoose");

const {
  guardarUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  eliminarUsuarioPorId,
  modificarUsuarioPorId,
  loginUser,
  resetPassword,
} = require("../services/user.service");
const { ResponseStructure } = require("../helpers/ResponseStructure");

const userController = {};

userController.guardarUsuario = async (req, res) => {
  try {
    const newUser = {
      ...req.body,
      rol: req.body.rol,
    };

    // Obtener el tenantId del token
    const tenantId = req.tenantId;
    const rolGuardado = await guardarUsuario(newUser, tenantId);

    ResponseStructure.status = 200;
    ResponseStructure.message = "Usuario guardado exitosamente";
    ResponseStructure.data = rolGuardado;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    const status = error instanceof mongoose.Error.ValidationError ? 400 : 500;

    ResponseStructure.status = status;
    ResponseStructure.message = "Error al guardar el usuario";
    ResponseStructure.data = {
      error: error.message,
    };

    res.status(status).json(ResponseStructure);
  }
};
userController.obtenerUsuarios = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const listaUsers = await obtenerUsuarios(tenantId);
    ResponseStructure.status = 200
    ResponseStructure.message = "Usuarios encontrados exitosamente";
    ResponseStructure.data = listaUsers;
    res.status(200).send(ResponseStructure);
  } catch (error) {

    ResponseStructure.status = 500;
    ResponseStructure.message = "Error al obtener usuarios";
    ResponseStructure.data = error.message;

    res.status(500).json(ResponseStructure);
  }
};

userController.obtenerUsuarioPorId = async (req, res) => {
  try {
    const userId = req.params.id;
    const tenantId = req.tenantId;
    const user = await obtenerUsuarioPorId(userId, tenantId);

    ResponseStructure.status = 200;
    ResponseStructure.message = "Usuario encontrado exitosamente";
    ResponseStructure.data = user;

    res.status(200).json(ResponseStructure);
  } catch (error) {

    ResponseStructure.status = 404;
    ResponseStructure.message = "Usuario no encontrado";
    ResponseStructure.data = error.message;

    res.status(404).json(ResponseStructure);
  }
};

userController.eliminarUsuarioPorId = async (req, res) => {
  try {
    const userId = req.params.id;
    const tenantId = req.tenantId;
    const usuarioEliminado = await eliminarUsuarioPorId(tenantId, userId);

    ResponseStructure.status = 200;
    ResponseStructure.message = "Usuario eliminado exitosamente";
    ResponseStructure.data = usuarioEliminado;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    ResponseStructure.status = 500;
    ResponseStructure.message = "Error al eliminar el usuario";
    ResponseStructure.data = error.message;

    res.status(500).json(ResponseStructure);
  }
};

userController.modificarUsuarioPorId = async (req, res) => {
  try {
    const userId = req.params.id;
    const nuevosDatos = req.body;
    const token = req.headers.authorization;

    const { usuarioModificado, redirectToLogin } = await modificarUsuarioPorId(
      userId,
      token,
      nuevosDatos,
    );

    //la redireccion no funciona en tunderclient, pendiente usar el frontend para probar 
    // Si hay una indicación de redirección, redirigir al usuario a la página de inicio de sesión
    if (redirectToLogin) {
      return res.redirect('/login');
    }

    ResponseStructure.status = 200;
    ResponseStructure.message = "Usuario modificado exitosamente";
    ResponseStructure.data = usuarioModificado;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    ResponseStructure.status = 400;
    ResponseStructure.message = "Error al modificar el usuario";
    ResponseStructure.data = error.message;

    res.status(400).json(ResponseStructure);
  }
};

// userController.loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     // const tenantId = req.tenantId;

//     // const result = await loginUser(email, password, tenantId);
//     const result = await loginUser(email, password);

//     ResponseStructure.status = 200;
//     ResponseStructure.message = 'Login exitoso';
//     ResponseStructure.data = result;

//     res.status(200).json(ResponseStructure);
//   } catch (error) {
//     ResponseStructure.status = 500;
//     ResponseStructure.message = 'Error al iniciar sesión';
//     ResponseStructure.data = error.message;

//     res.status(500).json(ResponseStructure);
//   }
// };

// userController.resetPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const tenantId = req.tenantId;

//     const token = await resetPassword.generateToken(email, tenantId);
//     await resetPassword.sendEmail(email, token);

//     ResponseStructure.status = 200;
//     ResponseStructure.message = 'Correo electrónico de restablecimiento de contraseña enviado correctamente.';
//     ResponseStructure.data = { email };

//     res.status(200).json(ResponseStructure);
//   } catch (error) {
//     ResponseStructure.status = 500;
//     ResponseStructure.message = 'Error al solicitar el token de restablecimiento de contraseña.';
//     ResponseStructure.data = error.message;

//     res.status(500).json(ResponseStructure);
//   }
// };

module.exports = userController