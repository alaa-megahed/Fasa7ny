var express  = require('express');
//var app      = express();
//var path 	 = require('path');
var webAdmin  = require('../controllers/WebAdminController');
var router = express.Router();

	//router.get('/', function(req, res){
    //    res.render('test');
    //});

     
<<<<<<< HEAD
     router.get('/viewRequestedDelete', webAdmin.webAdminViewRequestedDelete);
     router.get('/deleteBusiness/:id', webAdmin.WebAdminDeleteBusiness);
     router.post('/add_business', webAdmin.AddBusiness);
=======
router.get('/viewRequestedDelete', webAdmin.webAdminViewRequestedDelete);
router.get('/deleteBusiness/:username', webAdmin.WebAdminDeleteBusiness);
router.post('/add_business', webAdmin.AddBusiness);
>>>>>>> c328b15fd48fd3dc55f32a03c487eec8f31e1813

  

module.exports = router;