const Tercero = require("../models/terceros.Model");
const EmpresaModel = require("../models/empresas.Model")

const obtenerTerceros = async (tenantId) => {

  try {
    // Verificar que el tenantId coincide con el tenantId de los terceros
  const tercerosExisten = await Tercero.exists({ tenantId });

  if (!tercerosExisten) {
    throw new Error("TenantId proporcionado no es valido o no se encuentra en la base de datos");
  }
  const terceros = await Tercero.find({ tenantId })
    // .populate({
    //   path: "Empresa",
    //   model: EmpresaModel,
    // })
  return terceros;
  } catch (error) {
    throw error; // Propaga el error para que sea manejado en el controlador
  }
};

const obtenerTerceroPorId = async (terceroId, tenantId) => {
  try {
    // Verificar que el tenantId coincide con el tenantId del tercero
  const terceroExistente = await Tercero.findOne({ _id: terceroId, tenantId });

  if (!terceroExistente) {
    throw new Error("TenantId proporcionado no es valido o no se encuentra en la base de datos");
  }
  const tercero = await Tercero.findById({ _id: terceroId, tenantId })
    
  return tercero;
  } catch (error) {
    if (error.name === 'CastError' && error.path === '_id') {
      throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }

  
};

const guardarTercero = async (tercero, tenantId) => {
  // Asignar el tenantId al tercero
  tercero.tenantId = tenantId;

   // Validar que el objeto egreso tenga la estructura correcta y campos requeridos
   if (!tercero || !tercero.nombreTercero || !tercero.documentoTercero) {
    throw new Error("El objeto tercero no es valido o no contiene campos requeridos");
  }
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

  try {
     // Verificar que el tenantId coincide con el tenantId del tercero
  const terceroExistente = await Tercero.findOne({ _id: terceroId, tenantId });

  if (!terceroExistente) {
    throw new Error("TenantId proporcionado no es valido o no se encuentra en la base de datos");
  }
  const terceroEleminado =  await Tercero.findOneAndDelete({ _id: terceroId, tenantId });
  return terceroEleminado
  } catch (error) {
    if (error.name === 'CastError' && error.path === '_id') {
      throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }
 
};


const modificarTerceroPorId = async (terceroId, nuevosDatos, tenantId) => {
  
  try {
      // Verificar que el tenantId coincide con el tenantId del tercero
  const terceroExistente = await Tercero.findOne({ _id: terceroId, tenantId });

  if (!terceroExistente) {
    throw new Error("TenantId proporcionado no es valido o no se encuentra en la base de datos");
  }
  const terceroModificado =  await Tercero.findOneAndUpdate(
    { _id: terceroId, tenantId },
    nuevosDatos,
    { new: true }
  );
  if (!terceroModificado) {
    throw new Error("Tercero no encontrado");
  }

  return terceroModificado;
  } catch (error) {
    if (error.name === 'CastError' && error.path === '_id') {
      throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }
};

module.exports = {
  obtenerTerceros,
  obtenerTerceroPorId,
  guardarTercero,
  actualizarTerceroPoroId,
  eliminarTerceroPorId,
  modificarTerceroPorId,
};
