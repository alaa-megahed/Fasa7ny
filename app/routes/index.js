var express = require('express');
var router = express.Router();
var search = require('./search.routes.js');
var business = require('./business.routes.js');


// router.use('/search', search); 
router.use('/search', search);  
router.use('/business', business); 
router.get('/', function (req, res) {
    res.send("Hello");
}); 

module.exports = router;  