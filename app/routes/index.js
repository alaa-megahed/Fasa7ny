const router = require('express').Router();
const bookings = require('./bookings.routes');

router.use('/bookings', bookings);
