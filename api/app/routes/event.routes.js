var express = require('express');
var app = express();
var router = express.Router();
var RegularEventController = require('../controllers/event.controller.js');
var path 	 = require('path');




router.get('/', function(req, res){
        res.sendFile(path.resolve('app/views/event.html'));
    });

router.post('/create', RegularEventController.createEvent);
router.post('/edit', RegularEventController.editEvent);
router.post('/cancel', RegularEventController.cancelEvent);
router.post('/cancelO', RegularEventController.cancelOccurrence);
router.post('/view', RegularEventController.getEvents);
router.post('/viewO', RegularEventController.getOccurrences);
router.get('/viewO',RegularEventController.getAllTimings);
router.get('/facilities',RegularEventController.getAllFacilities);
router.get('/getEvent/:id', RegularEventController.getEvent);
// router.get('/viewO/:facility_id',RegularEventController.getAllTimings);



module.exports = router;
