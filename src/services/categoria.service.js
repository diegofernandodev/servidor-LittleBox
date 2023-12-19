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
    const categoriaExistente = await Categoria.findOne({ _id: categoriaId, tenantId });

    if (!categoriaExistente) {
      throw new Error("TenantId proporcionado no existe o no coincide con _id de la categoria solicitada");
    }

    const categoria = await Categoria.findById({ _id: categoriaId, tenantId })
    return categoria;
  } catch (error) {
    if (error.name === 'CastError' && error.path === '_id') {
      throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }
};

const guardarCategoria = async (categoria, tenantId) => {
  // Agrega el campo tenantId al objeto de la categoría antes de guardar
  categoria.tenantId = tenantId;

   // Validar que el objeto egreso tenga la estructura correcta y campos requeridos
   if (!categoria || !categoria.nombre) {
    throw new Error("El objeto categoria no es valido o no contiene campos requeridos");
  }

  // Crear nueva categoria
  const nuevaCategoria = new Categoria(categoria);
  // Guardar la categoria
  const categoriaGuardada = await nuevaCategoria.save();

  return categoriaGuardada;
};

const eliminarCategoriaId = async (categoriaId, tenantId) => {
    
  try {
      // Verificar que el tenantId coincide con el tenantId de la categoria
    const categoriaExistente = await Categoria.findOne({ _id: categoriaId, tenantId });

    if (!categoriaExistente) {
      throw new Error("TenantId proporcionado no existe o no coincide con _id de la categoria a eliminar");
    }

    const categoriaEliminada = await Categoria.findOneAndDelete({
      _id: categoriaId,
      tenantId,
    });

    return categoriaEliminada;
  } catch (error) {
    if (error.name === 'CastError' && error.path === '_id') {
      throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }
  
};

const modificarCategoriaPorId = async (categoriaId, nuevosDatos, tenantId) => {
  
try {
   // Verificar que el _id de la categoría y el tenantId coincidan
   const categoriaExistente = await Categoria.findOne({ _id: categoriaId, tenantId });

   if (!categoriaExistente) {
     throw new Error("TenantId proporcionado no existe o no coincide con _id de la categoria a modificar");
   }
 
   const categoriaModificada =  await Categoria.findOneAndUpdate(
     { _id: categoriaId, tenantId },
     nuevosDatos,
     { new: true }
   );
 
    // Si no se encuentra la categoría, lanzar un error
    if (!categoriaModificada) {
     throw new Error("Categoria no encontrada");
   }
 
   return categoriaModificada;
} catch (error) {
  if (error.name === 'CastError' && error.path === '_id') {
    throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
  } else {
    throw error; // Propaga el error para que sea manejado en el controlador
  }
}

 
};

module.exports = {
  obtenerCategorias,
  obtenerCategoriaId,
  guardarCategoria,
  eliminarCategoriaId,
  modificarCategoriaPorId,
};
