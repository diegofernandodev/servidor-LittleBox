const { Error } = require("mongoose");
const Categoria = require("../models/categoria.model");
const EmpresaModel = require("../models/empresas.Model")

const getCategoriasPredeterminadas=async()=>{
  const categorias = await Categoria.find({
    global: true,
  });

  return categorias;
}

// const obtenerCategorias = async (tenantId) => {
  
//   const categorias = await Categoria.find({ tenantId })
//   .populate({
//     path: "empresaCategoria",
//     model: EmpresaModel,
//   })
//   return categorias;
// };
const obtenerCategorias = async (tenantId) => {
  
  const categoriasTenant = await Categoria.find({ tenantId })
  // .populate({
  //   path: "empresaCategoria",
  //   model: EmpresaModel,
  // })

  const categoriasPredeterminadas = await getCategoriasPredeterminadas();

  categoriasPredeterminadas.push(...categoriasTenant);

  return categoriasPredeterminadas;
};


const obtenerCategoriaId = async (categoriaId,tenantId) => {
  const categoria = await Categoria.findById({ _id: categoriaId, tenantId })
  // .populate({
  //   path: "empresaCategoria",
  //   model: EmpresaModel,
  // })
  return categoria;
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
  const categoria = await Categoria.findOne({ _id: categoriaId, tenantId });

  if (!categoria) {
    throw new Error("Categoria no encontrada");
  } else if (categoria.tenantId !== tenantId) {
    throw new Error("Tenant incorrecto");
  }

  return await Categoria.findOneAndDelete({ _id: categoriaId, tenantId });
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
