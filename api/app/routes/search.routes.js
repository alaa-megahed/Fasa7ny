var search = require('express').Router(); 
var searchController = require('../controllers/search.controller.js'); 

search.get('/', searchController.showAll); 

// search.post('/', searchController.search);  


// search.get('/:keyword', searchController.search); 

module.exports = search; 