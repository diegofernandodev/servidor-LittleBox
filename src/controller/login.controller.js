const mongoose = require("mongoose");

const {
  loginUser,
  resetPassword,
  restablecerPassword,
  logout
} = require("../services/login.service");
const { ResponseStructure } = require("../helpers/ResponseStructure");
const { addToRevokedTokens, isTokenRevoked } = require('../helpers/token-blacklist');

const loginController = {};

  loginController.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      // const tenantId = req.tenantId;
  
      // const result = await loginUser(email, password, tenantId);
      const result = await loginUser(email, password);
  
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

  loginController.logout =async(req,res)=>{
    try {
      const token = req.headers.authorization;

      console.log('Token recibido en el controlador de logout:', token);

      // Realizar el logout usando el servicio
      const result = await logout(token);

      // Respondemos con éxito
      ResponseStructure.status = 200;
      ResponseStructure.message = 'Logout exitoso';
      ResponseStructure.data = result;
  
      res.status(200).json(ResponseStructure);
    } catch (error) {
      // Manejar errores
      ResponseStructure.status = 500;
      ResponseStructure.message = 'Error al cerrar sesion';
      ResponseStructure.data = error.message;
  
      res.status(500).json(ResponseStructure);
    }
  }

  loginController.resetPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const tenantId = req.tenantId;
  
      // Generar token y enviar correo
      const token = await resetPassword.generateToken(email, tenantId);
      await resetPassword.sendEmail(email, token);
  
      ResponseStructure.status = 200;
      ResponseStructure.message = 'Correo electrónico de restablecimiento de contraseña enviado correctamente.';
      ResponseStructure.data = { email };
  
      res.status(200).json(ResponseStructure);
    } catch (error) {
      ResponseStructure.status = 500;
      ResponseStructure.message = 'Error al solicitar el token de restablecimiento de contraseña.';
      ResponseStructure.data = error.message;
  
      res.status(500).json(ResponseStructure);
    }
  };

  loginController.restablecerPassword = async (req, res) => {
    try {
     
      // const { token, newPassword } = req.query;
      const {password} = req.body;
      const token = req.headers.authorization;
      console.log("token: ", token, " password: ", password);

        if (!token || !password) {
            throw new Error('Falta el token o la nueva contraseña en la solicitud.');
        }
  
      // Restablecer la contraseña
      const user = await restablecerPassword.processResetToken(token, password);
  
      ResponseStructure.status = 200;
      ResponseStructure.message = 'Contraseña restablecida correctamente.';
      ResponseStructure.data = user;
  
      res.status(200).json(ResponseStructure);
    } catch (error) {
      ResponseStructure.status = 500;
      ResponseStructure.message = 'Error al restablecer la contraseña.';
      ResponseStructure.data = error.message;
  
      res.status(500).json(ResponseStructure);
    }
  };
  

  module.exports = loginController