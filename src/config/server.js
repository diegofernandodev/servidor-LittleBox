// Importación de módulos y configuraciones necesarios para el servidor
const express = require("express");
const session = require('express-session');
const routesEgresos = require("../routes/egresos.routes");
const routesCategorias = require("../routes/categorias.routes");
const routesTerceros = require("../routes/terceros.routes");
const routesEmpresas = require("../routes/empresas.routes");
const routesUsers = require("../routes/user.routes");
const routesLogin = require("../routes/login.routes");
const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');
const { seedCategorias } = require("../helpers/seed-categorias");
const cors = require("cors");
const { loginUser } = require("../controller/user.controller");
require('dotenv').config();

// Configuración del servidor Express
const appLittlebox = express();
const port = 4000;

// Configuración de express-session
appLittlebox.use(session({
    secret: process.env.JWT_SECRET, // Secreto para la sesión
    resave: false,
    saveUninitialized: true,
}));

appLittlebox.use(express.json()); // Habilitar el uso de JSON en las solicitudes HTTP
appLittlebox.use(cors()); // Configuración de CORS para permitir solicitudes desde otros dominios

seedCategorias(); // Sembrar categorías, función para inicializar datos en la base de datos si es necesario

// Rutas del servidor
appLittlebox.use(routesLogin);
appLittlebox.use(verificarTokenMiddleware);
appLittlebox.use(routesEmpresas);
appLittlebox.use(routesCategorias);
appLittlebox.use(routesEgresos);
appLittlebox.use(routesTerceros);
appLittlebox.use(routesUsers);

appLittlebox.set("port", process.env.PORT || port);

module.exports = appLittlebox;
