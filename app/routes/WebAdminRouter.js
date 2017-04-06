var express  = require('express');
//var app      = express();
//var path 	 = require('path');
var webAdmin  = require('../controllers/WebAdminController');
var router = express.Router();

	//router.get('/', function(req, res){
    //    res.render('test');
    //});

     
router.get('/viewRequestedDelete', webAdmin.webAdminViewRequestedDelete);
router.get('/deleteBusiness/:username', webAdmin.WebAdminDeleteBusiness);
router.post('/add_business', webAdmin.AddBusiness);

  

module.exports = router;