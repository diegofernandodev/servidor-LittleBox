const mongoose = require("mongoose");

const {
    obtenerSolicitudes,
    obtenerSolicitudesPorId,
    guardarSolicitud,
    actualizarSolicitudId,
    eliminarSolicitudPorId,
    modificarSolicitudPorId
} = require("../services/solicitud.service");
const { ResponseStructure } = require("../helpers/ResponseStructure");

const solicitudesController = {};

solicitudesController.obtenerSolicitudes = async (req, res) => {
    try {
      const tenantId = req.tenantId;
  
      // Obtener la lista de solicitudes usando el servicio
      const listaSolicitudes = await obtenerSolicitudes(tenantId);
  
      // Responder con la lista de solicitudes
      ResponseStructure.status = 200;
      ResponseStructure.message = "Solicitudes encontradas exitosamente";
      ResponseStructure.data = listaSolicitudes;
  
      res.status(200).send(ResponseStructure);
    } catch (error) {
      // Manejar los errores y responder con el mensaje adecuado
      ResponseStructure.status = 500;
      ResponseStructure.message = "Error al obtener solicitudes";
      ResponseStructure.data = error.message;
  
      res.status(500).json(ResponseStructure);
    }
  };

  solicitudesController.obtenerSolicitudesPorId = async (req, res) => {
    try {
      const solicitudId = req.params.id;
      const tenantId = req.tenantId;
      const solicitud = await obtenerSolicitudesPorId(solicitudId, tenantId);
  
      ResponseStructure.status = 200;
      ResponseStructure.message = "Solicitud encontrada exitosamente";
      ResponseStructure.data = solicitud;
  
      res.status(200).json(ResponseStructure);
    } catch (error) {
      
      ResponseStructure.status = 404;
      ResponseStructure.message = "Solicitud no encontrada";
      ResponseStructure.data = error.message;
  
      res.status(404).json(ResponseStructure);
    }
  };

  solicitudesController.guardarSolicitud = async (req, res) => {
    try {
      const nuevaSolicitud = {
        ...req.body,
        categoria: req.body.categoria,
      };
  
      const tenantId = req.tenantId;
      const solicitudGuardada = await guardarSolicitud(nuevaSolicitud, tenantId);
      const idCurrent = solicitudGuardada._id;
  
      const solicitudId = await actualizarSolicitudId(tenantId, idCurrent);
      solicitudGuardada.solicitudId = solicitudId;
      ResponseStructure.status = 200;
      ResponseStructure.message = "Solicitud guardada exitosamente";
      ResponseStructure.data = solicitudGuardada;
  
      res.status(200).send(ResponseStructure);
    } catch (error) {
      console.error("Error en el controlador al guardar la solicitud:", error);
  
      // const status = error.name === "ValidationError" ? 400 : 500;
      const status = error instanceof mongoose.Error.ValidationError ? 400 : 500;
  
      ResponseStructure.status = status;
      ResponseStructure.message = "Error al guardar la solicitud";
      ResponseStructure.data = {
        error: error.message,
      };
  
      res.status(status).json(ResponseStructure);
    }
  };

  solicitudesController.eliminarSolicitudPorId = async (req, res) => {
    try {
      const solicitudId = req.params.id;
      const tenantId = req.tenantId;
      const solicitudEliminada = await eliminarSolicitudPorId(solicitudId, tenantId);
  
      ResponseStructure.status = 200;
      ResponseStructure.message = "Solicitud eliminada exitosamente";
      ResponseStructure.data = solicitudEliminada;
  
      res.status(200).send(ResponseStructure);
    } catch (error) {
      ResponseStructure.status = 500;
      ResponseStructure.message = "Error al eliminar la solicitud";
      ResponseStructure.data = error.message;
    
      res.status(500).json(ResponseStructure);
    }
  };
  
  solicitudesController.modificarSolicitudPorId = async (req, res) => {
  
    try {
      const nuevosDatos = req.body;
      const solicitudId = req.params.id;
      const tenantId = req.tenantId;
      
      const solicitudModificada = await modificarSolicitudPorId(
        solicitudId,
        nuevosDatos,
        tenantId
      );
      ResponseStructure.status = 200;
      ResponseStructure.message = "Solicitud modificada exitosamemte";
      ResponseStructure.data = solicitudModificada;
  
      res.status(200).send(ResponseStructure);
    } catch (error) {
      // const errorsCatch = error.errors;
      // const errors = {};
  
      // for (let i in errorsCatch) {
      //   errors[i] = errorsCatch[i].message;
      // }
  
      ResponseStructure.status = 400;
      ResponseStructure.message = "Error al modificar la solicitud";
      ResponseStructure.data = error.message;
  
      res.status(400).json(ResponseStructure);
    }
  };

  module.exports = solicitudesController;