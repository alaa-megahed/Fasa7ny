var express = require('express');
var app = express();
var multer = require('multer');
var router = express.Router();
var RegularEventController = require('../controllers/event.controller.js');
var path 	 = require('path');
var upload = multer({ dest: 'public/uploads/' });



router.get('/', function(req, res){
        res.sendFile(path.resolve('app/views/event.html'));
    });

router.post('/createFacility', upload.single('img'), RegularEventController.createFacility);
router.post('/editFacility/:facilityId', upload.single('img'), RegularEventController.editFacility);
router.get('/deleteFacility/:facilityId', RegularEventController.deleteFacility);
router.get('/getEvents/:facilityId', RegularEventController.getDailyEvents);

router.post('/create', RegularEventController.createEvent);
router.post('/edit/:id', RegularEventController.editEvent);
router.get('/cancel/:id', RegularEventController.cancelEvent);
router.get('/cancelO/:occId', RegularEventController.cancelOccurrence);
router.get('/view', RegularEventController.getEvents);
router.get('/viewO/:eventId', RegularEventController.getOccurrences);
router.get('/getOnceEventDetails/:eventId', RegularEventController.getOnceEventDetails);

module.exports = router;
