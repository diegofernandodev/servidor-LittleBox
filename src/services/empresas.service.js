const Empresa = require("../models/empresas.Model");

/**
 * Obtiene todas las empresas.
 * @returns {Promise<Array>} - Un array de empresas.
 * @throws {Error} - Se lanza un error si hay algún problema al obtener las empresas.
 */
const obtenerEmpresas = async () => {
  try {
    const empresas = await Empresa.find();
    return empresas;
  } catch (error) {
    throw new Error(`Error al obtener las empresas: ${error.message}`);
  }
};

/**
 * Obtiene una empresa por su ID.
 * @param {string} empresaId - El ID de la empresa a obtener.
 * @returns {Promise<Object|null>} - La empresa encontrada o null si no se encuentra ninguna empresa con el ID dado.
 * @throws {Error} - Se lanza un error si hay algún problema al obtener la empresa por su ID.
 */
const obtenerEmpresaPorId = async (empresaId) => {
  try {
    const empresa = await Empresa.findById(empresaId);
    return empresa;
  } catch (error) {
    throw new Error(`Error al obtener la empresa por ID: ${error.message}`);
  }
};

/**
 * Guarda una nueva empresa.
 * @param {Object} empresa - La información de la empresa a guardar.
 * @returns {Promise<Object>} - La empresa guardada.
 * @throws {Error} - Se lanza un error si hay algún problema al guardar la empresa.
 */
const guardarEmpresa = async (empresa) => {
  try {
    const nuevaEmpresa = new Empresa(empresa);
    const empresaGuardada = await nuevaEmpresa.save();
    return empresaGuardada;
  } catch (error) {
    throw new Error(`Error al guardar la empresa: ${error.message}`);
  }
};

/**
 * Actualiza una empresa por su ID con nuevos datos.
 * @param {string} idEmpresaActual - El ID de la empresa a actualizar.
 * @param {Object} datosEmpresaActualizado - Los nuevos datos para la empresa.
 * @returns {Promise<Object|null>} - La empresa actualizada o null si no se encuentra ninguna empresa con el ID dado.
 * @throws {Error} - Se lanza un error si hay algún problema al actualizar la empresa por su ID.
 */
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

/**
 * Elimina una empresa por su ID.
 * @param {string} empresaId - El ID de la empresa a eliminar.
 * @returns {Promise<Object|null>} - La empresa eliminada o null si no se encuentra ninguna empresa con el ID dado.
 * @throws {Error} - Se lanza un error si hay algún problema al eliminar la empresa por su ID.
 */
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

/**
 * Modifica una empresa por su ID con nuevos datos.
 * @param {string} empresaId - El ID de la empresa a modificar.
 * @param {Object} nuevosDatos - Los nuevos datos para la empresa.
 * @returns {Promise<Object|null>} - La empresa modificada o null si no se encuentra ninguna empresa con el ID dado.
 * @throws {Error} - Se lanza un error si hay algún problema al modificar la empresa por su ID.
 */
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