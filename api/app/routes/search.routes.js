var express = require('express');
var router = express.Router(); 
var searchController = require('../controllers/search.controller'); 

router.get('/', searchController.showAll); 

module.exports = router; 

