const Tercero = require("../models/terceros.Model");
const EmpresaModel = require("../models/empresas.Model")

const obtenerTerceros = async (tenantId) => {
  const terceros = await Tercero.find({ tenantId })
    // .populate({
    //   path: "Empresa",
    //   model: EmpresaModel,
    // })
  return terceros;
};

const obtenerTerceroPorId = async (terceroId, tenantId) => {
  const tercero = await Tercero.findOne({ _id: terceroId, tenantId })
    
  return tercero;
};

const guardarTercero = async (tercero, tenantId) => {
  // Asignar el tenantId al tercero
  tercero.tenantId = tenantId;
  // Crear nuevo tercero
  const nuevoTercero = new Tercero(tercero);

  // Guardar el tercero
  const terceroGuardado = await nuevoTercero.save();

  return terceroGuardado;
};

const actualizarTerceroPoroId = async (tenantId, idTerceroActual) => {
  const filter = { _id: idTerceroActual };
  const dates = { tenantId: tenantId };
  await Tercero.findOneAndUpdate(filter, dates);
  return terceroId;
};

const eliminarTerceroPorId = async (terceroId, tenantId) => {
  const tercero = await Tercero.findOne({ _id: terceroId, tenantId });

  if (!tercero) {
    throw new Error("tercero no encontrado");
  } else if (tercero.tenantId !== tenantId) {
    throw new Error("Tenant incorrecto");
  }

  return await Tercero.findOneAndDelete({ _id: terceroId, tenantId });
};


const modificarTerceroPorId = async (terceroId, nuevosDatos, tenantId) => {
  const terceroModificado =  await Tercero.findOneAndUpdate(
    { _id: terceroId, tenantId },
    nuevosDatos,
    { new: true }
  );
  if (!terceroModificado) {
    throw new Error("Tercero no encontrado");
  }

  return terceroModificado;
};

module.exports = {
  obtenerTerceros,
  obtenerTerceroPorId,
  guardarTercero,
  actualizarTerceroPoroId,
  eliminarTerceroPorId,
  modificarTerceroPorId,
};
