const routes = require('express').Router();
const bookings = require('./bookings.routes');

routes.use('/bookings', bookings);
