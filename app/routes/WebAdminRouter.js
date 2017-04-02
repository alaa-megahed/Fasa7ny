var express  = require('express');
var app      = express();
var path 	 = require('path');
var router   = express.Router();

var webAdmin  = require('../controllers/WebAdminController');


	router.get('/', function(req, res){
        res.sendFile(path.resolve('app/views/test.html'));
    });



    router.post('/add_business', webAdmin.AddBusiness);

  
  

module.exports = router;