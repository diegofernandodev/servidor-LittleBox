const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const empresaModel = require("../models/empresas.Model");
const rolModel = require("../models/rolesUser.Model");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const mail = require('@sendgrid/mail');
const {tokenSign,verifyToken} = require("../helpers/generateToken")

/**
 * Función para guardar un nuevo usuario en la base de datos.
 * @param {Object} user - Objeto con los datos del usuario a guardar.
 * @param {string} tenantId - Identificador del tenant al que pertenece el usuario.
 * @returns {Promise<Object>} - Promesa que resuelve con el usuario guardado.
 */
const guardarUsuario = async (user, tenantId) => {
    try {
      // Asignar el tenantId al usuario
      user.tenantId = tenantId;
  
      // Hashear la contraseña
      user.password = await bcrypt.hash(user.password, 12);
  
      // Definir campos requeridos
      const camposRequeridos = ['name', 'username', 'password', 'rol', 'estado'];
  
      // Validar campos requeridos en el objeto user
      const tieneCamposRequeridos = camposRequeridos.every(campo => user[campo]);
      if (!user || !tieneCamposRequeridos) {
        throw new Error("El objeto user no es válido o no contiene campos requeridos");
      }
  
      // Crear nuevo usuario
      const newUser = new User(user);
  
      // Guardar el usuario
      const userSave = await newUser.save();
  
      return userSave;
    } catch (error) {
      throw new Error(`Error al guardar el usuario: ${error.message}`);
    }
};

/**
 * Función para obtener todos los usuarios de un tenant.
 * @param {string} tenantId - Identificador del tenant.
 * @returns {Promise<Array>} - Promesa que resuelve con un array de usuarios.
 */
const obtenerUsuarios = async (tenantId) => {
    try {
      // Verificar que el tenantId coincide con el tenantId de los usuarios
      const usersExisten = await User.exists({ tenantId });
  
      if (!usersExisten) {
        throw new Error("TenantId proporcionado no es valido o no se encuentra en la base de datos");
      }
      const users = await User.find({ tenantId })
        .populate({
          path: "empresaUser",
          model: empresaModel,
        })
        .populate({
          path: "rol",
          model: rolModel,
        });
      return users;
    } catch (error) {
      throw error;
    }
};

/**
 * Función para obtener un usuario por su ID y tenant.
 * @param {string} userId - Identificador del usuario.
 * @param {string} tenantId - Identificador del tenant.
 * @returns {Promise<Object>} - Promesa que resuelve con el usuario encontrado.
 */
const obtenerUsuarioPorId = async (userId, tenantId) => {
    try {
      // Verificar que el tenantId coincide con el tenantId del usuario
      const userExistent = await User.findOne({ _id: userId, tenantId });
  
      if (!userExistent) {
        throw new Error("TenantId proporcionado no es valido o no se encuentra en la base de datos");
      }
      const user = await User.findById({ _id: userId, tenantId })
      .populate({
          path: "empresaUser",
          model: empresaModel,
        })
        .populate({
          path: "rol",
          model: rolModel,
        });
  
      return user;
    } catch (error) {
      if (error.name === 'CastError' && error.path === '_id') {
        throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
      } else {
        throw error;
      }
    } 
};

/**
 * Función para eliminar un usuario por su ID y tenant.
 * @param {string} userId - Identificador del usuario.
 * @param {string} tenantId - Identificador del tenant.
 * @returns {Promise<Object>} - Promesa que resuelve con el usuario eliminado.
 */
const eliminarUsuarioPorId = async (tenantId, userId) => {
    try {

      // Verificar que el tenantId coincide con el tenantId del usuario
      const userExistent = await User.findOne({ _id: userId, tenantId});
  
      if (!userExistent) {
        throw new Error("TenantId proporcionado no es valido o no se encuentra en la base de datos");
      }
  
      const usuarioEliminado = await User.findOneAndDelete({ _id: userId, tenantId});
      return usuarioEliminado;
    } catch (error) {
      if (error.name === 'CastError' && error.path === '_id') {
        throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
      } else {
        throw error;
      }
    }
};


/**
 * Función para modificar un usuario por su ID y tenant.
 * @param {string} token - Token de autenticación del usuario.
 * @param {Object} nuevosDatos - Objeto con los nuevos datos del usuario a actualizar.
 * @returns {Promise<Object>} - Promesa que resuelve con el usuario modificado y un nuevo token.
 */

  const modificarUsuarioPorId = async (userId, token, nuevosDatos) => {
    try {
      // Decodificar el token para obtener la información del usuario (en este caso, userId, tenantId, email)
      const decodedToken = await verifyToken(token);
  
      console.log('Datos recibidos:', nuevosDatos);
  
      // Verificar si se proporciona un nuevo password
      if (nuevosDatos.password) {
        // Hashear el nuevo password antes de actualizarlo
        nuevosDatos.password = await bcrypt.hash(nuevosDatos.password, 12);
      }
  
      // Verificar si se proporciona un nuevo correo electrónico
      if (nuevosDatos.email && nuevosDatos.email !== decodedToken.email) {

       // El correo electrónico ha cambiado, redirigir al proceso de inicio de sesión
      return { redirectToLogin: true };
      
      }
  
      // El correo electrónico no ha cambiado, continuar con la actualización
      const usuarioModificado = await User.findOneAndUpdate(
        { _id: userId, tenantId: decodedToken.tenantId },
        { $set: nuevosDatos },
        { new: true }
      );
  
      // Si no se encuentra el usuario, lanzar un error
      if (!usuarioModificado) {
        throw new Error("Usuario no encontrado o el tenantId no coincide");
      }
  
      return { usuarioModificado, newToken: null };
    } catch (error) {
      if (error.name === 'CastError' && error.path === '_id') {
        throw new Error("_id proporcionado no es válido o no se encontró en la base de datos");
      } else {
        throw error; // Propaga el error para que sea manejado en el controlador
      }
    }
  };

  const aprobarRechazarSolicitud = async (idSolicitud, nuevoEstado, usuario) => {
  const solicitud = await Solicitud.findById(idSolicitud);

  if (!solicitud) {
    throw new Error('Solicitud no encontrada');
  }

  if (solicitud.estado !== 'pendiente') {
    throw new Error('La solicitud ya ha sido procesada');
  }

  // Verificar si el usuario tiene el rol de administrador
  if (usuario.rol === 'administrador') {
    solicitud.estado = nuevoEstado;
    const solicitudActualizada = await solicitud.save();
    return solicitudActualizada;
  } else {
    throw new Error('Usuario no tiene permisos para aprobar/rechazar esta solicitud');
  }
};

module.exports = {
    guardarUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    eliminarUsuarioPorId,
    modificarUsuarioPorId,
};