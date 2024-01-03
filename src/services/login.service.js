const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const mail = require('@sendgrid/mail');
const { addToRevokedTokens, isTokenRevoked } = require('../helpers/token-blacklist');
const { listaNegraService } = require('../services/blackList.service');


const loginUser = async (email, password) => {
  try {
    console.log(`Intentando iniciar sesión para el usuario con email: ${email}`);
    // Verificar que el email coincida
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('Error en usuario/contraseña: Usuario no encontrado.');
    }

    // Comparar la contraseña hasheada
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', passwordMatch);

    if (!passwordMatch) {
      throw new Error('Error en usuario/contraseña: Contraseña incorrecta.');
    }

    // Crear y devolver el token de autenticación
    const token = crearToken(user);
    return { success: 'Login correcto', token, tenantId: user.tenantId }; // Incluir tenantId en la respuesta
  } catch (error) {
    console.error(error);
    throw new Error(`Error al iniciar sesión: ${error.message}`);
  }
};

const crearToken = (user) => {
  const { _id, email, tenantId } = user;

  const payload = { userId: _id, email, tenantId };
  const secret = process.env.JWT_SECRET; // Reemplaza 'tu_secreto' con tu secreto real
  const options = { expiresIn: '1h' };

  const token = jwt.sign(payload, secret, options);
  return token;
};

const logout = async (token) => {
  
  try {

    console.log('Token recibido en el servicio de logout:', token);

    // // Verificar si el token está en la lista negra
    // if (isTokenRevoked(token)) {
    //   console.log('Token ya revocado.');
    //   throw new Error('Token already revoked.');
    // }

    // Verificar si el token está en la lista negra en la base de datos
    const tokenEnListaNegra = await listaNegraService.tokenEnListaNegra(token);
    if (tokenEnListaNegra) {
      console.log('Token ya revocado.');
      throw new Error('Token already revoked.');
    }

    // Agregar el token a la lista negra
    // addToRevokedTokens(token);
    await listaNegraService.agregarToken(token);
    console.log('Token agregado a la lista negra:', token);

    // Otras operaciones de cierre de sesión según sea necesario

    return { success: true, message: 'Logout successful.' };
  } catch (error) {
    console.error(error);
    throw new Error(`Error al cerrar sesión: ${error.message}`);
  }
}

const resetPassword = {
  generateToken: async (email, tenantId) => {
    try {
      const user = await User.findOne({ email, tenantId });

      if (!user) {
        throw new Error('Usuario no encontrado.');
      }

      const tokenData = {
        email,
        userId: user._id, // Agrega la propiedad userId aquí
        tenantId,
      };

      const token = jwt.sign(
        tokenData,
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      console.log("Token generado:", token);

      // Llama a la función sendEmail con el token y el usuario
      await resetPassword.sendEmail(email, user, token);

      // // Llama a la función sendEmail 
      // await resetPassword.sendEmail(email, token);

      return token;
    } catch (error) {
      console.error('Error al generar el token de restablecimiento de contraseña:', error);
      throw new Error('Error al generar el token de restablecimiento de contraseña.');
    }
  },

  sendEmail: async (email, token) => {

    console.log("dentro de sendEmail", token);
    try {
      const config = {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: "littleboxx23@gmail.com",
          pass: "ccnh rvez uzho akcs"
        }
      }

      // Crea un transporte una vez
      const transport = nodemailer.createTransport(config);

      // Crea el enlace de restablecimiento de contraseña
      const url = `http://localhost:4000/newPassword?token=${token}`;

      const mensaje = {
        from: "littleboxx23@gmail.com",
        to: email,
        subject: 'Restablecimiento de contraseña',
        // text: `Para restablecer tu contraseña, utiliza el siguiente token: ${token}`,
        text: `Para restablecer tu contraseña, haz clic en el siguiente enlace:
          ${url}`,

      }


      // Envía el correo electrónico utilizando el mismo transporte
      const info = await transport.sendMail(mensaje);

      console.log("Correo electrónico enviado:", info);

      return { success: true, message: 'Correo electrónico enviado correctamente.' };
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
      throw new Error('Error al enviar el correo electrónico.');
    }
  },
};


const restablecerPassword = {
  processResetToken: async (token, password) => {
    try {
      // Decodificar el token para obtener la información del usuario (en este caso, el correo electrónico)
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      console.log("informacion del token", decodedToken);

      // Buscar el usuario en la base de datos por el correo electrónico
      const user = await User.findOne({ email: decodedToken.email });

      if (!user) {
        throw new Error('Usuario no encontrado.');
      }

      // Actualizar la contraseña del usuario
      user.password = await bcrypt.hash(password, 12);
      await user.save();

      return user;
    } catch (error) {
      console.error('Error al procesar el token:', error);
      throw new Error('Error al procesar el token.');
    }
  },
};

module.exports = {
  loginUser,
  resetPassword,
  restablecerPassword,
  crearToken,
  logout
};