var business = require('express').Router();
var businessController = require('../controllers/business.controller.js');

business.use('/makepagepublic', function(req, res) {
  res.render("makePagePublic.ejs");
})
business.get('/:name', businessController.getBusiness);
business.post('/requestRemoval',businessController.requestRemoval)
business.post('/haga', businessController.deletePaymentMethod);
business.post('/hagat', businessController.editInformation);
business.post('/publicPage', businessController.makePagePublic);



module.exports = business;
