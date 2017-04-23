var express  = require('express');
var webAdmin  = require('../controllers/web_admin.controller');
var router = express.Router();

	//router.get('/', function(req, res){
    //    res.render('test');
    //});



     router.get('/viewRequestedDelete', webAdmin.webAdminViewRequestedDelete);
     router.get('/deleteBusiness/:id', webAdmin.WebAdminDeleteBusiness);
     router.post('/add_business', webAdmin.AddBusiness);

     router.post('/createAdvertisement', webAdmin.addAdvertisement);
     router.post('/deleteAdvertisement', webAdmin.deleteAdvertisement);
     router.post('/updateAdvertisements', webAdmin.updateAdvertisements);
     router.get('/viewAdvertisements', webAdmin.viewAvailableAdvertisements);







module.exports = router;
