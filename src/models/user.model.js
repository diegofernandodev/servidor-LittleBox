const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "El nombre de usuario es requerido"],
    unique: true,
    validator: (value) => {
      return typeof value === "string";
    },
    message:
      "El nombre de la categoria debe ser una cadena de texto",
    minLength: 6,
    maxLength: 128,
  },
  password: {
    type: String,
    required: [true, "La contraseña es requerida"],
    // minLength: 8,
    // validator: (value) => {
    //   return /[a-zA-Z0-9@#$%^&*_~]/.test(value);
    // },
    // message: "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un símbolo",
  },
  email: {
    type: String,
    required: [true, "El correo electrónico es requerido"],
    validator: (value) => {
      return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value);
    },
    message: "El correo electrónico no es válido",
  },
  empresaUser: {
    type: Schema.Types.ObjectId,
    ref: "Empresa",
    required: [true, "La empresa es requerida"],
  },
  // fechaCreacion: {
  //   type: Date,
  //   default: Date.now(),
  // },
  // fechaUltimaActualizacion: {
  //   type: Date,
  //   default: Date.now(),
  // },
  estado: {
    type: String,
    enum: ["activo", "inactivo"],
    default: "activo",
  },
  rol: {
    type: Schema.Types.ObjectId,
    ref: "rol",
    required: [true, "El rol es requerido"],
  },
  name: {
    type: String,
    required: [true, "El nombre es requerido"],
    minLength: 3,
    maxLength: 128,
  },
  // telefono: {
  //   type: String,
  //   required: [true, "El teléfono es requerido"],
  //   minLength: 7,
  //   maxLength: 15,
  //   validator: (value) => {
  //     return /^[0-9]+$/.test(value);
  //   },
  //   message: "El teléfono debe ser un número",
  // },
  imagenFirma:{
    type: String,
    required: [true, "La imagen de la firma es requerida"],
  },
  tenantId: {
    type: String,
    required: true,
  },
});

userSchema.methods.generateResetPasswordLink = function (token) {
  return `http://localhost:4000/newPassword?token=${token}&userId=${this._id}`;
};

module.exports = model("User", userSchema,"usuariosEmpresas");
