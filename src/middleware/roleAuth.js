// const { verifyToken } = require('../helpers/generateToken');
// const userModel = require('../models/user.model');

// const checkRoleAuth = (allowedRoles) => async (req, res, next) => {
//     try {
//         // Obtener el token desde el encabezado de autorización
//         const token = req.headers.authorization.split(' ').pop();

//         // Verificar el token y obtener los datos del usuario
//         const tokenData = await verifyToken(token);
//         const userData = await userModel.findById(tokenData._id);

//         // Verificar si el rol del usuario está permitido
//         if (allowedRoles.includes(userData.rol)) {
//             // Si el rol está permitido, permitir el acceso a la ruta
//             next();
//         } else {
//             // Si el rol no está permitido, devolver un error
//             res.status(403).json({ error: 'No tienes permisos para acceder a esta ruta.' });
//         }
//     } catch (error) {
//         console.error(error);
//         // Si hay algún error en la verificación del token, devolver un error
//         res.status(401).json({ error: 'Token inválido o caducado.' });
//     }
// };

// module.exports = checkRoleAuth;

const { verifyToken } = require('../helpers/generateToken');
const userModel = require('../models/user.model');

const checkRoleAuth = (allowedRoles) => async (req, res, next) => {
    try {
        // Obtener el token desde el encabezado de autorización
        const token = req.headers.authorization.split(' ').pop();

        // Verificar el token y obtener los datos del usuario
        const tokenData = await verifyToken(token);

        console.log("datos del tokenData", tokenData);

        if (!tokenData) {
            // Si el token no es válido o caducado, devolver un error
            res.status(401).json({ error: 'Token inválido o caducado.' });
            return;
        }

        const userData = await userModel
            .findById(tokenData.userId)
            .populate('rol');

        if (!userData) {
            // Si no se encuentra el usuario, devolver un error
            res.status(404).json({ error: 'Usuario no encontrado.' });
            return;
        }

        // Verificar si el rol del usuario está permitido
        if (userData.rol && allowedRoles.includes(userData.rol.nombre)) {
            // Si el rol está permitido, permitir el acceso a la ruta
            next();
        } else {
            // Si el rol no está permitido o no se encuentra, devolver un error
            const rolActual = userData.rol && userData.rol.nombre ? userData.rol.nombre : 'no asignado';
            res.status(403).json({ error: `No tienes permisos para acceder a esta ruta. Rol actual: ${rolActual}` });
        }
    } catch (error) {
        console.error(error);
        // Si hay algún otro error, devolver un error genérico
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

module.exports = checkRoleAuth;
