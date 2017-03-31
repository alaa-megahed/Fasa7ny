var express = require('express');
var router = express.Router();
var search = require('./search.routes.js');


// router.use('/search', search); 
router.use('/search', search);  
router.get('/', function (req, res) {
    res.send("Hello");
}); 

module.exports = router;  