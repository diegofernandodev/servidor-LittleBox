const Counter = require("../models/counter.model");

const incrementarSecuencia = async (tenantId) => {
  try {
    console.log("Intentando incrementar la secuencia...");

    const counter = await Counter.findOneAndUpdate(
      { tenantId },
      { $inc: { seq: 1 } },
      { new: true, upsert: true } // Agregamos 'upsert' para crear el documento si no existe
    );

    console.log("Secuencia incrementada exitosamente:", counter.seq);
    return counter ? counter.seq : 1;
  } catch (error) {
    console.error("Error al incrementar la secuencia:", error);
    throw new Error("Error al incrementar la secuencia: " + error.message);
  }
};

module.exports = {
  incrementarSecuencia,
};


