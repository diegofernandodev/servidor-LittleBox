const {
  obtenerCategorias,
  obtenerCategoriaId,
  guardarCategoria,
  eliminarCategoriaId,
  modificarCategoriaPorId,
} = require("../services/categoria.service");
const { ResponseStructure } = require("../helpers/ResponseStructure");
const categoriasController = {};

categoriasController.obtenerCategoriaId = async (req, res) => {
  try {
    const categoriaId = req.params.id;
    const verCategoria = await obtenerCategoriaId(categoriaId);
    ResponseStructure.status = 200;
    ResponseStructure.message = "Categoria encontrada exitosamente";
    ResponseStructure.data = verCategoria;

    res.status(200).json(ResponseStructure);
  } catch (error) {
    console.error("Error al obtener la categoria:", error);

    ResponseStructure.status = 404;
    ResponseStructure.message = "Categoria no encontrada";
    ResponseStructure.data = null;

    res.status(404).json(ResponseStructure);
  }
};

categoriasController.obtenerCategorias = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const listaCategorias = await obtenerCategorias(tenantId);
    ResponseStructure.message = "Categorias encontradas exitosamente";
    ResponseStructure.data = listaCategorias;
    res.status(200).send(ResponseStructure);
  } catch (error) {
    const errorsCatch = error.errors;
    const errors = {};

    for (let i in errorsCatch) {
      errors[i] = errorsCatch[i].message;
    }

    ResponseStructure.status = 500;
    ResponseStructure.message = "Error al obtener categorias";
    ResponseStructure.data = errors;

    res.status(500).json(ResponseStructure);
  }
};

categoriasController.guardarCategoria = async (req, res) => {
  try {
    const newCategoria = {
      ...req.body,
      // tenantId: req.tenantId,
    };
    const tenantId = req.tenantId;
    const categoriaGuardada = await guardarCategoria(newCategoria,tenantId);
    ResponseStructure.status = 200;
    ResponseStructure.message = "Categoria guardada exitosamente";
    ResponseStructure.data = categoriaGuardada;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    const errorsCatch = error.errors;
    const errors = {};

    for (let i in errorsCatch) {
      errors[i] = errorsCatch[i].message;
    }

    ResponseStructure.status = 500;
    ResponseStructure.message = "Error al guardar la categoria";
    ResponseStructure.data = errors;

    res.status(500).json(ResponseStructure);
  }
};


categoriasController.eliminarCategoriaId = async (req, res) => {
  try {
    const categoriaId = req.params.id;
    const tenantId = req.tenantId;
    const categoriaEliminada = await eliminarCategoriaId(categoriaId,tenantId);
    ResponseStructure.status = 200;
    ResponseStructure.message = "Categoria eliminada exitosamemte";
    ResponseStructure.data = categoriaEliminada;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    const errorsCatch = error.errors;
    const errors = {};

    for (let i in errorsCatch) {
      errors[i] = errorsCatch[i].message;
    }

    ResponseStructure.status = 500;
    ResponseStructure.message = "Error al eliminar la categoria";
    ResponseStructure.data = errors;

    res.status(500).json(ResponseStructure);
  }
};

categoriasController.modificarCategoriaPorId = async (req, res) => {
  // const categoriaId = req.params.id;

  try {
    const nuevosDatos = req.body;
    const categoriaId = req.params.id;
    const tenantId = req.tenantId;
    
    const categoriaModificada = await modificarCategoriaPorId(
      categoriaId,
      nuevosDatos,
      tenantId
    );
    ResponseStructure.status = 200;
    ResponseStructure.message = "Categoria modificada exitosamemte";
    ResponseStructure.data = categoriaModificada;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    const errorsCatch = error.errors;
    const errors = {};

    for (let i in errorsCatch) {
      errors[i] = errorsCatch[i].message;
    }

    ResponseStructure.status = 400;
    ResponseStructure.message = "Error al modificar la categoria";
    ResponseStructure.data = errors;

    res.status(400).json(ResponseStructure);
  }
};

module.exports = categoriasController;
