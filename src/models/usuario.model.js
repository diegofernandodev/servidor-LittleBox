const { Schema, model } = require("mongoose");

const usuarioSchema = new Schema({
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
    minLength: 8,
    validator: (value) => {
      return /[a-zA-Z0-9@#$%^&*_~]/.test(value);
    },
    message: "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un símbolo",
  },
  fechaNacimiento: {
    type: Date,
  },
  correoElectronico: {
    type: String,
    required: [true, "El correo electrónico es requerido"],
    validator: (value) => {
      return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value);
    },
    message: "El correo electrónico no es válido",
  },
  empresaUsuario: {
    type: Schema.Types.ObjectId,
    ref: "Empresa",
    required: [true, "La empresa es requerida"],
  },
  fechaCreacion: {
    type: Date,
    default: Date.now(),
  },
  fechaUltimaActualizacion: {
    type: Date,
    default: Date.now(),
  },
  estado: {
    type: String,
    enum: ["activo", "inactivo"],
    default: "activo",
  },
  roles: {
    type: Array,
    default: [],
  },
  nombre: {
    type: String,
    required: [true, "El nombre es requerido"],
    minLength: 3,
    maxLength: 128,
  },
  telefono: {
    type: String,
    required: [true, "El teléfono es requerido"],
    minLength: 7,
    maxLength: 15,
    validator: (value) => {
      return /^[0-9]+$/.test(value);
    },
    message: "El teléfono debe ser un número",
  },
  tenantId: {
    type: String,
    required: true,
  },
});


module.exports = model("Usuario", usuarioSchema,"usuariosEmpresas");
