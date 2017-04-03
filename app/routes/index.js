var express = require('express');
var router = express.Router();
var search = require('./search.routes.js');
var business = require('./business.routes.js');


router.use('/search', search);  
router.use('/business', business); 
router.use('/contact', function(req, res) {
    res.send('Contact us with a business proposal at fasa7ny@gmail.com'); 
}); 
router.get('/', function (req, res) {
    res.send("Hello");
}); 

module.exports = router;  