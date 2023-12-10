const express = require("express");
const routesEgresos = require("../routes/egresos.routes");
const routesCategorias = require("../routes/categorias.routes");
const routesTerceros = require("../routes/terceros.routes");
const routesEmpresas = require("../routes/empresas.routes")
const multitenancyMiddleware = require("../middleware/multitenancyMiddleware");
const { seedCategorias } = require("../helpers/seed-categorias");
const cors = require("cors");

const appLittlebox = express();
const port = 4000;
appLittlebox.use(express.json());

appLittlebox.use(cors());

seedCategorias();

appLittlebox.use(multitenancyMiddleware);
appLittlebox.use(routesEmpresas);
appLittlebox.use(routesCategorias);
appLittlebox.use(routesEgresos);
appLittlebox.use(routesTerceros);

appLittlebox.set("port", process.env.PORT || port);

module.exports = appLittlebox;
