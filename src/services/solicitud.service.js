const Solicitud = require("../models/solicitud.model");
const categoriaModel = require("../models/categoria.model");
const terceroModel = require("../models/terceros.Model");
const counterService = require("../services/counter.service");

const obtenerSolicitudes = async (tenantId) => {
    try {
     
      // Verificar que el tenantId coincide con el tenantId de las solicitudes
      const solicitudesExisten = await Solicitud.exists({ tenantId });
  
      if (!solicitudesExisten) {
        throw new Error("TenantId proporcionado no es válido o no se encuentra en la base de datos");
      }
  
      // Obtener la lista de solicitudes
      const solicitudes = await Solicitud.find({ tenantId })
        .populate({
          path: "categoria",
          model: categoriaModel,
        })
        .populate({
          path: "tercero",
          model: terceroModel,
        });
  
      return solicitudes;
    } catch (error) {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  };

  const obtenerSolicitudesPorId = async (solicitudId, tenantId) => {

    try {
  
      // Verificar que el tenantId coincide con el tenantId de la solicitud
    const solicitudExistente = await Solicitud.findOne({ _id: solicitudId, tenantId });
  
    if (!solicitudExistente) {
      throw new Error("TenantId proporcionado no es valido o no se encuentra en la base de datos");
    }
    const solicitud = await Solicitud.findById({ _id: solicitudId, tenantId })
      .populate({
        path: "categoria",
        model: categoriaModel,
      })
      .populate({
        path: "tercero",
        model: terceroModel,
      });
    return solicitud;
    } catch (error) {
      if (error.name === 'CastError' && error.path === '_id') {
        throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
      } else {
        throw error; // Propaga el error para que sea manejado en el controlador
      }
    }  
  };

  const guardarSolicitud = async (solicitud, tenantId) => {
    // Asignar el solicitudId y el tenantId a la solicitud
    solicitud.tenantId = tenantId;
    solicitud.solicitudId = 0;
  
    // Validar que el objeto solicitud tenga la estructura correcta y campos requeridos
    if (!solicitud || !solicitud.detalle || !solicitud.valor) {
      throw new Error("El objeto solicitud no es valido o no contiene campos requeridos");
    }
  
    // Crear nueva solicitud
    const nuevaSolicitud = new Solicitud(solicitud);
  
    // Guardar la solicitud
    const solicitudGuardada = await nuevaSolicitud.save();
  
    return solicitudGuardada;
  };
  
  const actualizarSolicitudId = async (tenantId, idSolicitudActual) => {
    // Incrementar la secuencia
    const solicitudId = await counterService.incrementarSecuencia(tenantId);
    const filter = { _id: idSolicitudActual };
    const dates = { solicitudId: solicitudId };
    await Solicitud.findOneAndUpdate(filter, dates);
    return solicitudId;
  };

  const eliminarSolicitudPorId = async (solicitudId, tenantId) => {
    try {
       // Verificar que el tenantId coincide con el tenantId de la solicitud
    const solicitudExistente = await Solicitud.findOne({ _id: solicitudId, tenantId });
  
    if (!solicitudExistente) {
      throw new Error("TenantId proporcionado no coincide con ninguna Solicitud en la base de datos");
    }
  
    const solicitudEliminada = await Solicitud.findOneAndDelete({ _id: solicitudId, tenantId });
    return solicitudEliminada;
    } catch (error) {
      if (error.name === 'CastError' && error.path === '_id') {
        throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
      } else {
        throw error; // Propaga el error para que sea manejado en el controlador
      }
    }
  };

  const modificarSolicitudPorId = async (solicitudId, nuevosDatos, tenantId) => {

    try {
      // Verificar que el _id de la solicitud y el tenantId coincidan
     const solicitudExistente = await Solicitud.findOne({ _id: solicitudId, tenantId });
  
     if (!solicitudExistente) {
      throw new Error("TenantId proporcionado no existe o no coincide con _id de la solicitud a modificar");
    }
    const solicitudModificada =  await Solicitud.findOneAndUpdate(
      { _id: solicitudId, tenantId },
      nuevosDatos,
      { new: true }
    );
  
    // Si no se encuentra la solicitud, lanzar un error
    if (!solicitudModificada) {
      throw new Error("Solicitud no encontrada");
    }
  
    return solicitudModificada;
  
    } catch (error) {
      if (error.name === 'CastError' && error.path === '_id') {
        throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
      } else {
        throw error; // Propaga el error para que sea manejado en el controlador
      }
    }  
  };

  module.exports = {
    obtenerSolicitudes,
    obtenerSolicitudesPorId,
    guardarSolicitud,
    actualizarSolicitudId,
    eliminarSolicitudPorId,
    modificarSolicitudPorId
  };