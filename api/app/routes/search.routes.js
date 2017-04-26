var search = require('express').Router(); 
var searchController = require('../controllers/search.controller.js'); 

search.get('/', searchController.showAll); 

module.exports = search; 