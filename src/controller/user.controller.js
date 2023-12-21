const mongoose = require("mongoose");

const {
  guardarUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  eliminarUsuarioPorId,
  modificarUsuarioPorId,
  loginUser,
} = require("../services/user.service");
const { ResponseStructure } = require("../helpers/ResponseStructure");

const userController = {};

userController.guardarUsuario = async (req, res) => {
    try {
      const newUser = {
        ...req.body,
        rol: req.body.rol,
      };
  
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
      const usuarioEliminado = await eliminarUsuarioPorId(userId, tenantId);
  
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
      const nuevosDatos = req.body;
      const userId = req.params.id;
      const tenantId = req.tenantId;
      
      const usuarioModificado = await modificarUsuarioPorId(
        userId,
        nuevosDatos,
        tenantId
      );
      ResponseStructure.status = 200;
      ResponseStructure.message = "Usuario modificado exitosamemte";
      ResponseStructure.data = usuarioModificado;
  
      res.status(200).send(ResponseStructure);
    } catch (error) {
      // const errorsCatch = error.errors;
      // const errors = {};
  
      // for (let i in errorsCatch) {
      //   errors[i] = errorsCatch[i].message;
      // }
  
      ResponseStructure.status = 400;
      ResponseStructure.message = "Error al modificar el usuario";
      ResponseStructure.data = error.message;
  
      res.status(400).json(ResponseStructure);
    }
  };

  userController.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const tenantId = req.tenantId;
  
      const result = await loginUser(email, password, tenantId);
  
      ResponseStructure.status = 200;
      ResponseStructure.message = 'Login exitoso';
      ResponseStructure.data = result;
  
      res.status(200).json(ResponseStructure);
    } catch (error) {
      ResponseStructure.status = 500;
      ResponseStructure.message = 'Error al iniciar sesión';
      ResponseStructure.data = error.message;
  
      res.status(500).json(ResponseStructure);
    }
  };

  module.exports = userController