const Egreso = require("../models/egresos.Model");
const categoriaModel = require("../models/categoria.model");
const terceroModel = require("../models/terceros.Model");
const counterService = require("../services/counter.service");

const obtenerEgresos = async (tenantId) => {
  const egresos = await Egreso.find({ tenantId })
    .populate({
      path: "categoria",
      model: categoriaModel,
    })
    .populate({
      path: "tercero",
      model: terceroModel,
    });
  return egresos;
};

const obtenerEgresoPorId = async (egresoId, tenantId) => {
  const egreso = await Egreso.findById({ _id: egresoId, tenantId })
    .populate({
      path: "categoria",
      model: categoriaModel,
    })
    .populate({
      path: "tercero",
      model: terceroModel,
    });
  return egreso;
};

const guardarEgreso = async (egreso, tenantId) => {
  // Asignar el egresoId y el tenantId al egreso
  egreso.tenantId = tenantId;
  egreso.egresoId = 0;
  // Crear nuevo egreso
  const nuevoEgreso = new Egreso(egreso);

  // Guardar el egreso
  const egresoGuardado = await nuevoEgreso.save();

  return egresoGuardado;
};

const actualizarEgresoId = async (tenantId, idEgreseActual) => {
  // Incrementar la secuencia
  const egresoId = await counterService.incrementarSecuencia(tenantId);
  const filter = { _id: idEgreseActual };
  const dates = { egresoId: egresoId };
  await Egreso.findOneAndUpdate(filter, dates);
  return egresoId;
};

const eliminarEgresoPorId = async (egresoId, tenantId) => {
  const egreso = await Egreso.findOne({ _id: egresoId, tenantId });

  if (!egreso) {
    throw new Error("Egreso no encontrado");
  } else if (egreso.tenantId !== tenantId) {
    throw new Error("Tenant incorrecto");
  }

  return await Egreso.findOneAndDelete({ _id: egresoId, tenantId });
};


const modificarEgresoPorId = async (egresoId, nuevosDatos, tenantId) => {
  const egresoModificado =  await Egreso.findOneAndUpdate(
    { _id: egresoId, tenantId },
    nuevosDatos,
    { new: true }
  );
  if (!egresoModificado) {
    throw new Error("egreso no encontrado");
  }

  return egresoModificado;
};

module.exports = {
  obtenerEgresos,
  obtenerEgresoPorId,
  guardarEgreso,
  eliminarEgresoPorId,
  modificarEgresoPorId,
  actualizarEgresoId,
};
