// const jwt = require('jsonwebtoken') //TODO : 😎

// const tokenSign = async (user) => { //TODO: Genera Token
//     // return jwt.sign(
//     //     {
//     //         _id: user._id, //TODO: <---
//     //         role: user.role
//     //     }, //TODO: Payload ! Carga útil
//     //     process.env.JWT_SECRET, //TODO ENV 
//     //     {
//     //         expiresIn: "2h", //TODO tiempo de vida
//     //     }
//     // );
//     const { _id, email, tenantId,rol } = user;

//   const payload = { userId: _id, email, tenantId, rol: user.rol };
//   const secret = process.env.JWT_SECRET; // Reemplaza 'tu_secreto' con tu secreto real
//   const options = { expiresIn: '1h' };

//   const token = jwt.sign(payload, secret, options);
//   return token;
// }

// const verifyToken = async (token) => {
//     try {
//         return jwt.verify(token, process.env.JWT_SECRET)
//     } catch (e) {
//         return null
//     }
// }

// const decodeSign = (token) => { //TODO: Verificar que el token sea valido y correcto
//     return jwt.decode(token, null)
// }



// module.exports = { tokenSign, decodeSign, verifyToken }

const jwt = require('jsonwebtoken');

const tokenSign = async (user) => {
  const { _id, email, tenantId, rol } = user;
  const payload = { userId: _id, email, tenantId, rol };
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: '1h' };
  const token = jwt.sign(payload, secret, options);
  return token;
}

const verifyToken = async (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // Puedes personalizar el manejo de errores según tus necesidades
    throw new Error('Token inválido o caducado');
  }
}

const decodeSign = (token) => {
  return jwt.decode(token, null);
}

module.exports = { tokenSign, decodeSign, verifyToken };
