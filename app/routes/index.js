const routes = require('express').Router();
const webAdmin = require('./webAdmin.routes');

routes.use('/webAdmin', webAdmin);