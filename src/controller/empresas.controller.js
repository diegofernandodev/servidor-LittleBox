const {
  obtenerEmpresas,
  obtenerEmpresaPorId,
  guardarEmpresa,
  actualizarEmpresaId,
  eliminarEmpresaPorId,
  modificarEmpresaPorId,
} = require("../services/empresas.service");
const { ResponseStructure } = require("../helpers/ResponseStructure");

const empresasController = {};

empresasController.obtenerEmpresaPorId = async (req, res) => {
  try {
    const empresaId = req.params.id;
    const empresa = await obtenerEmpresaPorId(empresaId);

    ResponseStructure.status = 200;
    ResponseStructure.message = "Empresa encontrada exitosamente";
    ResponseStructure.data = empresa;

    res.status(200).json(ResponseStructure);
  } catch (error) {
    console.error("Error al obtener la empresa:", error);

    ResponseStructure.status = 404;
    ResponseStructure.message = "Empresa no encontrada";
    ResponseStructure.data = null;

    res.status(404).json(ResponseStructure);
  }
};

empresasController.obtenerEmpresas = async (req, res) => {
  try {
    const listaEmpresas = await obtenerEmpresas();
    ResponseStructure.status = 200
    ResponseStructure.message = "Empresas encontradas exitosamente";
    ResponseStructure.data = listaEmpresas;
    res.status(200).send(ResponseStructure);
  } catch (error) {
    const errorsCatch = error.errors;
    const errors = {};

    for (let i in errorsCatch) {
      errors[i] = errorsCatch[i].message;
    }

    ResponseStructure.status = 500;
    ResponseStructure.message = "Error al obtener empresas";
    ResponseStructure.data = errors;

    res.status(500).json(ResponseStructure);
  }
};

empresasController.guardarEmpresa = async (req, res) => {
  try {
    const nuevaEmpresa = {
      ...req.body,
    };

    const empresaGuardada = await guardarEmpresa(nuevaEmpresa);
    const idCurrent = empresaGuardada._id;

    const empresaId = await actualizarEmpresaId(idCurrent);
    empresaGuardada.empresaId = empresaId;
    ResponseStructure.status = 200;
    ResponseStructure.message = "Empresa guardada exitosamente";
    ResponseStructure.data = empresaGuardada;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    console.error("Error en el controlador al guardar la empresa:", error);

    const status = error.name === "ValidationError" ? 400 : 500;

    ResponseStructure.status = status;
    ResponseStructure.message = "Error al guardar la empresa";
    ResponseStructure.data = {
      error: error.message,
    };

    res.status(status).json(ResponseStructure);
  }
};

empresasController.eliminarEmpresaPorId = async (req, res) => {
  try {
    const empresaId = req.params.id;
    const empresaEliminada = await eliminarEmpresaPorId(empresaId);

    ResponseStructure.status = 200;
    ResponseStructure.message = "Empresa eliminada exitosamente";
    ResponseStructure.data = empresaEliminada;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    console.log(error);
    let status = 500;
    let message = "Error al eliminar la empresa";
    let data = {};

    if (error.message === "Empresa no encontrada") {
      status = 404;
      message = "Empresa no encontrada";
    } 

    ResponseStructure.status = status;
    ResponseStructure.message = message;
    ResponseStructure.data = data;

    res.status(status).json(ResponseStructure);
  }
};

empresasController.modificarEmpresaPorId = async (req, res) => {
  try {
    const nuevosDatos = req.body;
    const empresaId = req.params.id;
    
    const empresaModificada = await modificarEmpresaPorId(
      empresaId,
      nuevosDatos,
    );

    ResponseStructure.status = 200;
    ResponseStructure.message = "Empresa modificada exitosamente";
    ResponseStructure.data = empresaModificada;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    const errorsCatch = error.errors;
    const errors = {};

    for (let i in errorsCatch) {
      errors[i] = errorsCatch[i].message;
    }
    console.error("Error al modificar la empresa:", error);

    ResponseStructure.status = 400;
    ResponseStructure.message = "Error al modificar la empresa";
    ResponseStructure.data = errors;

    res.status(400).json(ResponseStructure);
  }
};

module.exports = empresasController;
