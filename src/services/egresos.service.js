const Egreso = require("../models/egresos.Model");
const categoriaModel = require("../models/categoria.model");
const terceroModel = require("../models/terceros.Model");
const counterService = require("../services/counter.service");

const obtenerEgresos = async (tenantId) => {
  try {
   
    // Verificar que el tenantId coincide con el tenantId de los egresos
    const egresosExisten = await Egreso.exists({ tenantId });

    if (!egresosExisten) {
      throw new Error("TenantId proporcionado no es válido o no se encuentra en la base de datos");
    }

    // Obtener la lista de egresos
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
  } catch (error) {
    throw error; // Propaga el error para que sea manejado en el controlador
  }
};

const obtenerEgresoPorId = async (egresoId, tenantId) => {

  try {

    // Verificar que el tenantId coincide con el tenantId del egreso
  const egresoExistente = await Egreso.findOne({ _id: egresoId, tenantId });

  if (!egresoExistente) {
    throw new Error("TenantId proporcionado no es valido o no se encuentra en la base de datos");
  }
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
  } catch (error) {
    if (error.name === 'CastError' && error.path === '_id') {
      throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }

  
};

const guardarEgreso = async (egreso, tenantId) => {
  // Asignar el egresoId y el tenantId al egreso
  egreso.tenantId = tenantId;
  egreso.egresoId = 0;

  // Validar que el objeto egreso tenga la estructura correcta y campos requeridos
  if (!egreso || !egreso.detalle || !egreso.valor) {
    throw new Error("El objeto egreso no es valido o no contiene campos requeridos");
  }

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
  try {
     // Verificar que el tenantId coincide con el tenantId del egreso
  const egresoExistente = await Egreso.findOne({ _id: egresoId, tenantId });

  if (!egresoExistente) {
    throw new Error("TenantId proporcionado no coincide con ningun Egreso en la base de datos");
  }

  const egresoEliminado = await Egreso.findOneAndDelete({ _id: egresoId, tenantId });
  return egresoEliminado;
  } catch (error) {
    if (error.name === 'CastError' && error.path === '_id') {
      throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }
};


const modificarEgresoPorId = async (egresoId, nuevosDatos, tenantId) => {

  try {
    // Verificar que el _id del egreso y el tenantId coincidan
   const egresoExistente = await Egreso.findOne({ _id: egresoId, tenantId });

   if (!egresoExistente) {
    throw new Error("TenantId proporcionado no existe o no coincide con _id del Egreso a modificar");
  }
  const egresoModificado =  await Egreso.findOneAndUpdate(
    { _id: egresoId, tenantId },
    nuevosDatos,
    { new: true }
  );

  // Si no se encuentra el egreso, lanzar un error
  if (!egresoModificado) {
    throw new Error("egreso no encontrado");
  }

  return egresoModificado;

  } catch (error) {
    if (error.name === 'CastError' && error.path === '_id') {
      throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }  
};

module.exports = {
  obtenerEgresos,
  obtenerEgresoPorId,
  guardarEgreso,
  eliminarEgresoPorId,
  modificarEgresoPorId,
  actualizarEgresoId,
};
