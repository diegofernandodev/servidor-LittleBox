const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/LittleBox", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Conexión exitosa");
  })
  .catch((error) => {
    console.log("No fue posible realizar la conexión a la base de datos", error);
  });
