var business = require('express').Router(); 
var businessController = require('../controllers/business.controller.js'); 

business.get('/:name', businessController.getBusiness); 


module.exports = business; 
