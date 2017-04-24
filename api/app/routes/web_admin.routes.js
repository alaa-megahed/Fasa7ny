var express  = require('express');
var webAdmin  = require('../controllers/web_admin.controller');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: 'public/uploads/'});
	//router.get('/', function(req, res){
    //    res.render('test');
    //});



     router.get('/viewRequestedDelete', webAdmin.webAdminViewRequestedDelete);
     router.get('/deleteBusiness/:id', webAdmin.WebAdminDeleteBusiness);
     router.post('/add_business', webAdmin.AddBusiness);

     router.post('/createAdvertisement', upload.single('image'), webAdmin.addAdvertisement);
     router.get('/deleteAdvertisement/:id', webAdmin.deleteAdvertisement);
     router.post('/updateAdvertisements', webAdmin.updateAvailableAdvertisements);
	 router.get('/viewAdvertisements', webAdmin.viewAllAdvertisements);

 




module.exports = router;

