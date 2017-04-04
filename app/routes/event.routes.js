var express = require('express');
//var app = express();
var router = express.Router();
var RegularEventController = require('../controllers/event.controller.js');



router.get('/', RegularEventController.getOccurrences);

router.post('/eventCreated', RegularEventController.createEvent);
router.post('/edit', RegularEventController.editEvent);
router.post('/cancel', RegularEventController.cancelEvent);
router.post('/cancelO', RegularEventController.cancelOccurrence);

module.exports = router;