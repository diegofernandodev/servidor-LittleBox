const Empresa = require("../models/empresas.Model");

const obtenerEmpresas = async () => {
  const empresas = await Empresa.find()
  return empresas;
};

const obtenerEmpresaPorId = async (empresaId) => {
  const empresa = await Empresa.findOne({ _id: empresaId })
  return empresa;
};

const guardarEmpresa = async (empresa) => {

  const nuevaEmpresa = new Empresa(empresa);

  // Guardar la empresa
  const empresaGuardada = await nuevaEmpresa.save();

  return empresaGuardada;
};

const actualizarEmpresaId = async (idEmpresaActual, datosEmpresaActualizado) => {
  const filter = { _id: idEmpresaActual };
  const update = {
    $set: datosEmpresaActualizado,
  };

  await Empresa.findOneAndUpdate(filter, update);
  return await Empresa.findOne(filter);
};


const eliminarEmpresaPorId = async (empresaId) => {
  const empresa = await Empresa.findOne({_id: empresaId});

  if (!empresa) {
    throw new Error("Empresa no encontrada");
  } 
  return await Empresa.findOneAndDelete({ _id: empresaId});
};


const modificarEmpresaPorId = async (empresaId, nuevosDatos) => {
  const empresaModificada = await Empresa.findOneAndUpdate(
    { _id: empresaId },
    nuevosDatos,
    { new: true }
  );
  if (!empresaModificada) {
    throw new Error("Empresa no encontrada");
  }

  return empresaModificada;
};

module.exports = {
  obtenerEmpresas,
  obtenerEmpresaPorId,
  guardarEmpresa,
  actualizarEmpresaId,
  eliminarEmpresaPorId,
  modificarEmpresaPorId,
};
