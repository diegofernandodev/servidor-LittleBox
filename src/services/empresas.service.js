const Empresa = require("../models/empresas.Model");

const obtenerEmpresas = async () => {
  try {
    const empresas = await Empresa.find();
    return empresas;
  } catch (error) {
    throw new Error(`Error al obtener las empresas: ${error.message}`);
  }
};

const obtenerEmpresaPorId = async (empresaId) => {
  try {
    const empresa = await Empresa.findById(empresaId);
    return empresa;
  } catch (error) {
    throw new Error(`Error al obtener la empresa por ID: ${error.message}`);
  }
};

const guardarEmpresa = async (empresa) => {
  try {
    const nuevaEmpresa = new Empresa(empresa);
    const empresaGuardada = await nuevaEmpresa.save();
    return empresaGuardada;
  } catch (error) {
    throw new Error(`Error al guardar la empresa: ${error.message}`);
  }
};

const actualizarEmpresaId = async (idEmpresaActual, datosEmpresaActualizado) => {
  try {
    const empresaActualizada = await Empresa.findByIdAndUpdate(
      idEmpresaActual,
      { $set: datosEmpresaActualizado },
      { new: true }
    );
    return empresaActualizada;
  } catch (error) {
    throw new Error(`Error al actualizar la empresa por ID: ${error.message}`);
  }
};

const eliminarEmpresaPorId = async (empresaId) => {
  try {
    const empresa = await Empresa.findById(empresaId);

    if (!empresa) {
      throw new Error("Empresa no encontrada");
    }

    return await Empresa.findByIdAndDelete(empresaId);
  } catch (error) {
    throw new Error(`Error al eliminar la empresa por ID: ${error.message}`);
  }
};

const modificarEmpresaPorId = async (empresaId, nuevosDatos) => {
  try {
    const empresaModificada = await Empresa.findByIdAndUpdate(
      empresaId,
      nuevosDatos,
      { new: true }
    );

    if (!empresaModificada) {
      throw new Error("Empresa no encontrada");
    }

    return empresaModificada;
  } catch (error) {
    throw new Error(`Error al modificar la empresa por ID: ${error.message}`);
  }
};

module.exports = {
  obtenerEmpresas,
  obtenerEmpresaPorId,
  guardarEmpresa,
  actualizarEmpresaId,
  eliminarEmpresaPorId,
  modificarEmpresaPorId,
};
