const { Error } = require("mongoose");
const Categoria = require("../models/categoria.model");
const EmpresaModel = require("../models/empresas.Model")

const getCategoriasPredeterminadas=async()=>{
  const categorias = await Categoria.find({
    global: true,
  });

  return categorias;
}


const obtenerCategorias = async (tenantId) => {
  
  const categoriasTenant = await Categoria.find({ tenantId })
  

  const categoriasPredeterminadas = await getCategoriasPredeterminadas();

  categoriasPredeterminadas.push(...categoriasTenant);

  return categoriasPredeterminadas;
};


const obtenerCategoriaId = async (categoriaId,tenantId) => {
  try {
    const categoria = await Categoria.findById({ _id: categoriaId, tenantId });

    if (!categoria || categoria.tenantId !== tenantId) {
      throw new Error("_id de categoria o tenant no válidos");
    }

    return categoria;
  } catch (error) {
    throw error; // Propaga el error para que sea manejado en el controlador
  }
};

const guardarCategoria = async (categoria, tenantId) => {
  // Agrega el campo tenantId al objeto de la categoría antes de guardar
  categoria.tenantId = tenantId;
  // Crear nueva categoria
  const nuevaCategoria = new Categoria(categoria);
  // Guardar la categoria
  const categoriaGuardada = await nuevaCategoria.save();

  return categoriaGuardada;
};

const eliminarCategoriaId = async (categoriaId, tenantId) => {
    
  try {
    const categoria = await Categoria.findOne({ _id: categoriaId, tenantId });

    if (!categoria || categoria.tenantId !== tenantId) {
      throw new Error("_id de categoria o tenant no válidos");
    }

    const categoriaEliminada = await Categoria.findOneAndDelete({
      _id: categoriaId,
      tenantId,
    });

    return categoriaEliminada;
  } catch (error) {
    throw error; // Propaga el error para que sea manejado en el controlador
  }
  
};

const modificarCategoriaPorId = async (categoriaId, nuevosDatos, tenantId) => {
  const categoriaModificada =  await Categoria.findOneAndUpdate(
    { _id: categoriaId, tenantId },
    nuevosDatos,
    { new: true }
  );
  if (!categoriaModificada) {
    throw new Error("Categoria no encontrada");
  }

  return categoriaModificada;
};

module.exports = {
  obtenerCategorias,
  obtenerCategoriaId,
  guardarCategoria,
  eliminarCategoriaId,
  modificarCategoriaPorId,
};
