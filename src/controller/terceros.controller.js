const {
  obtenerTerceros,
  obtenerTerceroPorId,
  guardarTercero,
  eliminarTerceroPorId,
  modificarTerceroPorId,
} = require("../services/terceros.service");
const { ResponseStructure } = require("../helpers/ResponseStructure");

const tercerosController = {};

tercerosController.obtenerTerceros = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const terceros = await obtenerTerceros(tenantId);

    ResponseStructure.status = 200;
    ResponseStructure.message = "Terceros encontrados exitosamente";
    ResponseStructure.data = terceros;

    res.status(200).json(ResponseStructure);
  } catch (error) {
    console.error("Error al obtener los terceros:", error);

    ResponseStructure.status = 404;
    ResponseStructure.message = "Terceros no encontrados";
    ResponseStructure.data = null;

    res.status(ResponseStructure.status).json(ResponseStructure);
  }
};

tercerosController.obtenerTerceroPorId = async (req, res) => {
  try {
    const terceroId = req.params.id;
    const tenantId = req.tenantId;
    const tercero = await obtenerTerceroPorId(terceroId, tenantId);

    ResponseStructure.status = 200;
    ResponseStructure.message = "Tercero encontrado exitosamente";
    ResponseStructure.data = tercero;

    res.status(200).json(ResponseStructure);
  } catch (error) {
    console.error("Error al obtener el tercero:", error);

    ResponseStructure.status = 404;
    ResponseStructure.message = "Tercero no encontrado";
    ResponseStructure.data = null;

    res.status(404).json(ResponseStructure);
  }
};
tercerosController.guardarTercero = async (req, res) => {
  try {
    const nuevoTercero = {
      ...req.body,
      // empresa: req.body.empresa,
    };

    const tenantId = req.tenantId;
    const terceroGuardado = await guardarTercero(nuevoTercero, tenantId);

    ResponseStructure.status = 200;
    ResponseStructure.message = "Tercero guardado exitosamente";
    ResponseStructure.data = terceroGuardado;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    console.error("Error en el controlador al guardar el tercero:", error);

    const status = error.name === "ValidationError" ? 400 : 500;

    ResponseStructure.status = status;
    ResponseStructure.message = "Error al guardar el tercero";
    ResponseStructure.data = {
      error: error.message,
    };

    res.status(ResponseStructure.status).json(ResponseStructure);
  }
};

tercerosController.eliminarTerceroPorId = async (req, res) => {
  try {
    const terceroId = req.params.id;
    const tenantId = req.tenantId;
    const terceroEliminado = await eliminarTerceroPorId(terceroId, tenantId);

    ResponseStructure.status = 200;
    ResponseStructure.message = "Tercero eliminado exitosamente";
    ResponseStructure.data = terceroEliminado;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    let status = 500;
    let message = "Error al eliminar el tercero";
    let data = {};

    if (error.message === "tercero no encontrado") {
      status = 404;
      message = "Tercero no encontrado";
    } else if (error.message === "Tenant incorrecto") {
      status = 403;
      message = "Tenant incorrecto";
    }

    ResponseStructure.status = status;
    ResponseStructure.message = message;
    ResponseStructure.data = data;

    res.status(ResponseStructure.status).json(ResponseStructure);
  }
};

tercerosController.modificarTerceroPorId = async (req, res) => {
  try {
    const nuevosDatos = req.body;
    const terceroId = req.params.id;
    const tenantId = req.tenantId;

    const egresoModificado = await modificarTerceroPorId(
      terceroId,
      nuevosDatos,
      tenantId
    );

    ResponseStructure.status = 200;
    ResponseStructure.message = "Tercero modificado exitosamente";
    ResponseStructure.data = egresoModificado;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    const errorsCatch = error.errors;
    const errors = {};

    for (let i in errorsCatch) {
      errors[i] = errorsCatch[i].message;
    }
    console.error("Error al modificar el tercero:", error);

    ResponseStructure.status = 400;
    ResponseStructure.message = "Error al modificar el tercero";
    ResponseStructure.data = errors;

    res.status(ResponseStructure.status).json(ResponseStructure);
  }
};

module.exports = tercerosController;
