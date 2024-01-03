const express = require("express");
const session = require('express-session');
const routesEgresos = require("../routes/egresos.routes");
const routesCategorias = require("../routes/categorias.routes");
const routesTerceros = require("../routes/terceros.routes");
const routesEmpresas = require("../routes/empresas.routes");
const routesUsers = require("../routes/user.routes")
const routesLogin = require("../routes/login.routes")
const multitenancyMiddleware = require("../middleware/multitenancyMiddleware");
const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');
const { seedCategorias } = require("../helpers/seed-categorias");
const cors = require("cors");
const { loginUser } = require("../controller/user.controller");
require('dotenv').config();

const appLittlebox = express();
const port = 4000;

// Configuración de express-session
appLittlebox.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  }));

appLittlebox.use(express.json());

appLittlebox.use(cors());

seedCategorias();

appLittlebox.use(routesLogin);
appLittlebox.use(verificarTokenMiddleware);
// appLittlebox.use(verificarTokenMiddleware);
appLittlebox.use(routesEmpresas);
appLittlebox.use(routesCategorias);
appLittlebox.use(routesEgresos);
appLittlebox.use(routesTerceros);
appLittlebox.use(routesUsers);

appLittlebox.set("port", process.env.PORT || port);

module.exports = appLittlebox;
