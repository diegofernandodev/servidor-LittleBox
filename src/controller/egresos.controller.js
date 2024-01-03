const mongoose = require("mongoose");

const {
  obtenerEgresoPorId,
  obtenerEgresos,
  guardarEgreso,
  eliminarEgresoPorId,
  modificarEgresoPorId,
  actualizarEgresoId,
} = require("../services/egresos.service");
const { ResponseStructure } = require("../helpers/ResponseStructure");

const egresosController = {};

egresosController.obtenerEgresoPorId = async (req, res) => {
  try {
    const egresoId = req.params.id;
    const tenantId = req.tenantId;
    const egreso = await obtenerEgresoPorId(egresoId, tenantId);

    ResponseStructure.status = 200;
    ResponseStructure.message = "Egreso encontrado exitosamente";
    ResponseStructure.data = egreso;

    res.status(200).json(ResponseStructure);
  } catch (error) {
    
    ResponseStructure.status = 404;
    ResponseStructure.message = "Egreso no encontrado";
    ResponseStructure.data = error.message;

    res.status(404).json(ResponseStructure);
  }
};

egresosController.obtenerEgresos = async (req, res) => {
  try {
    // Obtener el token desde el encabezado de autorización
    const token = req.headers.authorization;

    // Obtener la lista de egresos usando el servicio
    const listaEgresos = await obtenerEgresos(token);

    // Responder con la lista de egresos
    ResponseStructure.status = 200;
    ResponseStructure.message = "Egresos encontrados exitosamente";
    ResponseStructure.data = listaEgresos;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    // Manejar los errores y responder con el mensaje adecuado
    ResponseStructure.status = 500;
    ResponseStructure.message = "Error al obtener egresos";
    ResponseStructure.data = error.message;

    res.status(500).json(ResponseStructure);
  }
};

egresosController.guardarEgreso = async (req, res) => {
  try {
    const nuevoEgreso = {
      ...req.body,
      categoria: req.body.categoria,
    };

    const tenantId = req.tenantId;
    const egresoGuardado = await guardarEgreso(nuevoEgreso, tenantId);
    const idCurrent = egresoGuardado._id;

    const egresoId = await actualizarEgresoId(tenantId, idCurrent);
    egresoGuardado.egresoId = egresoId;
    ResponseStructure.status = 200;
    ResponseStructure.message = "Egreso guardado exitosamente";
    ResponseStructure.data = egresoGuardado;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    console.error("Error en el controlador al guardar el egreso:", error);

    // const status = error.name === "ValidationError" ? 400 : 500;
    const status = error instanceof mongoose.Error.ValidationError ? 400 : 500;

    ResponseStructure.status = status;
    ResponseStructure.message = "Error al guardar el egreso";
    ResponseStructure.data = {
      error: error.message,
    };

    res.status(status).json(ResponseStructure);
  }
};

egresosController.eliminarEgresoPorId = async (req, res) => {
  try {
    const egresoId = req.params.id;
    const tenantId = req.tenantId;
    const egresoEliminado = await eliminarEgresoPorId(egresoId, tenantId);

    ResponseStructure.status = 200;
    ResponseStructure.message = "Egreso eliminado exitosamente";
    ResponseStructure.data = egresoEliminado;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    ResponseStructure.status = 500;
    ResponseStructure.message = "Error al eliminar el egreso";
    ResponseStructure.data = error.message;
  
    res.status(500).json(ResponseStructure);
  }
};

egresosController.modificarEgresoPorId = async (req, res) => {

  try {
    const nuevosDatos = req.body;
    const egresoId = req.params.id;
    const tenantId = req.tenantId;
    
    const egresoModificado = await modificarEgresoPorId(
      egresoId,
      nuevosDatos,
      tenantId
    );
    ResponseStructure.status = 200;
    ResponseStructure.message = "Egreso modificado exitosamemte";
    ResponseStructure.data = egresoModificado;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    // const errorsCatch = error.errors;
    // const errors = {};

    // for (let i in errorsCatch) {
    //   errors[i] = errorsCatch[i].message;
    // }

    ResponseStructure.status = 400;
    ResponseStructure.message = "Error al modificar el egreso";
    ResponseStructure.data = error.message;

    res.status(400).json(ResponseStructure);
  }
};

module.exports = egresosController;
