const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const empresaModel = require("../models/empresas.Model");
const rolModel = require("../models/rolesUser.Model");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');



// const createUser = async (req, res) => {
//   try {
//     req.body.password = await bcrypt.hash(req.body.password, 12);
//     const user = await User.create({
//       nombre: req.body.nombre,
//       username: req.body.username,
//       empresaUser: req.body.empresaUser,
//       tenantId: req.body.tenantId,
//       email: req.body.email,
//       password: req.body.password,
//       roles: req.body.roles,
//       imagenFirma: req.file ? req.file.path : null ,     // pdfarchivo: req.file.path
//       // pdfArchivo: req.file ? req.file.path : null      

//     });

//     res.json(user);
//   } catch (e) {
//     console.error('Error:', e);
//     res.status(500).json({ error: 'Internal server error', message: e.message });
//   }
// };

const guardarUsuario = async (user, tenantId) => {
    try {
      // Asignar el tenantId al usuario
      user.tenantId = tenantId;
  
      // Hashear la contraseña (asegúrate de tener el campo password en el objeto usuario)
      user.password = await bcrypt.hash(user.password, 12);
  
      // Definir campos requeridos
      const camposRequeridos = ['name', 'username', 'password', 'rol', 'estado'];
  
      // Validar que el objeto user tenga la estructura correcta y campos requeridos
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
      throw error; // Propaga el error para que sea manejado en el controlador
    }
    
  };
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
        throw error; // Propaga el error para que sea manejado en el controlador
      }
    } 
  };

  const eliminarUsuarioPorId = async (userId, tenantId) => {
    try {
      // Verificar que el tenantId coincide con el tenantId del usuario
    const userExistent = await User.findOne({ _id: userId, tenantId });
  
    if (!userExistent) {
      throw new Error("TenantId proporcionado no es valido o no se encuentra en la base de datos");
    }
  
    const usuarioEliminado = await User.findOneAndDelete({ _id: userId, tenantId });
    return usuarioEliminado;
    } catch (error) {
      if (error.name === 'CastError' && error.path === '_id') {
        throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
      } else {
        throw error; // Propaga el error para que sea manejado en el controlador
      }
    }
  };

  const modificarUsuarioPorId = async (userId, nuevosDatos, tenantId) => {

    try {
    //   // Verificar que el tenantId coincide con el tenantId del usuario
    // const userExistent = await User.findOne({ _id: userId, tenantId });
  
    // Verificar si se proporciona un nuevo password
    if (nuevosDatos.password) {
        // Hashear el nuevo password antes de actualizarlo
        nuevosDatos.password = await bcrypt.hash(nuevosDatos.password, 12);
      }

      // Verificar que el _id y el tenantId coincidan
    const usuarioModificado = await User.findOneAndUpdate(
        { _id: userId, tenantId },
        { $set: nuevosDatos },
        { new: true }
      );

    // const usuarioModificado =  await User.findOneAndUpdate(
    //   { _id: userId, tenantId },
    //   nuevosDatos,
    //   { new: true }
    // );
  
    // Si no se encuentra el usuario, lanzar un error
    if (!usuarioModificado) {
      throw new Error("Usuario no encontrado o el tenantId no coincide");
    }
  
    return usuarioModificado;
  
    } catch (error) {
      if (error.name === 'CastError' && error.path === '_id') {
        throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
      } else {
        throw error; // Propaga el error para que sea manejado en el controlador
      }
    }  
  };

// const loginUser = async (req, res) => {
//     try {
//         const user = await User.findOne({ email: req.body.email });
//         if (!user) {
//             return res.json({ error: 'Error en usuario/contraseña' });
//         }

//         const pass = await bcrypt.compare(req.body.password, user.password);
//         if (!pass) {
//             return res.json({ error: 'Error en usuario/contraseña' });
//         }

//         res.json({ success: 'login correcto', token: crearToken(user) });
//     } catch (e) {
//         console.error('Error:', e);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

const loginUser = async (email, password, tenantId) => {
  try {
    // Verificar que el email y el tenantId coincidan
    const user = await User.findOne({ email, tenantId });

    if (!user) {
      throw new Error('Error en usuario/contraseña');
    }

    // Comparar la contraseña hasheada
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Error en usuario/contraseña');
    }

    // Crear y devolver el token de autenticación
    const token = crearToken(user);
    return { success: 'Login correcto', token };
  } catch (error) {
    throw new Error(`Error al iniciar sesión: ${error.message}`);
  }
};

const crearToken = (user) => {
  // Ejemplo simple usando jwt.sign
  const payload = { userId: user._id, email: user.email }
  const token = jwt.sign(payload, 'tu_secreto', { expiresIn: '1h' });
  return token;
};



const resetPassword = {
    generateToken: async (email) => {
        const token = jwt.sign({
            email,
        }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        return token;
    },

    sendEmail: async (email, token) => {
        // Aquí puedes agregar lógica adicional si es necesario
        return { success: true, message: 'Token generado correctamente.' };
    },
};


const restablecerPassword = {
    processResetToken: async (token) => {
        try {
            // Decodificar el token para obtener la información del usuario (en este caso, el correo electrónico)
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            // Buscar el usuario en la base de datos por el correo electrónico
            const user = await User.findOne({ email: decodedToken.email });

            if (!user) {
                throw new Error('Usuario no encontrado.');
            }

            // Devuelve el usuario encontrado para que el controlador pueda permitir al usuario restablecer la contraseña.
            return user;
        } catch (error) {
            console.error('Error al procesar el token:', error);
            throw new Error('Error al procesar el token.');
        }
    },
};


// function crearToken(user) {
//     const payload = {
//         user_id: user._id,
//     };
//     return jwt.sign(payload, 'running');
// }



module.exports = {
    guardarUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    eliminarUsuarioPorId,
    modificarUsuarioPorId,
    loginUser,
    // resetPassword,
    // restablecerPassword
};