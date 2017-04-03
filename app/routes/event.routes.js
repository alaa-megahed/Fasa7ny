var express = require('express');
//var app = express();
var router = express.Router();
var RegularEventController = require('../controllers/event.controller.js');



router.get('/', RegularEventController.getOccurrences);

router.post('/eventCreated.ejs', RegularEventController.createEvent);
router.get('/haga.ejs', RegularEventController.editEvent);
router.post('/update', RegularEventController.editEvent);

module.exports = router;