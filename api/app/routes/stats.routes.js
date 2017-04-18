var stats = require('express').Router(); 
var StatsController = require('../controllers/stats.controller'); 

stats.post('/year', StatsController.getYearStats); 
stats.post('/month', StatsController.getMothStats); 
stats.post('/week', StatsController.getWeekStats); 

module.exports = stats; 