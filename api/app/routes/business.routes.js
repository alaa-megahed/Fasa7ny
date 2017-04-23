
var business = require('express').Router();
var businessController = require('../controllers/business.controller.js');
var statsController = require('../controllers/stats.controller.js');

var path 	 = require('path');
var multer = require('multer');
var upload = multer({ dest: 'public/uploads/' });

business.use('/makepagepublic', function(req, res) {
  res.render("makePagePublic.ejs", {user:req.user});
})

// business.get('/', function(req, res){
//         res.sendFile(path.resolve('public/views/businessPage.html'));
//        	// res.render('b.ejs');

//     });

// business.get('/edit', function(req, res){
//         res.sendFile(path.resolve('public/views/businessEdit.html'));
//        	// res.render('b.ejs');
//
//     });
business.get('/b/:id', businessController.getBusiness);


// business.get('/b/:id', function(req,res){
// 	console.log("routes");
// });

business.get('/requestRemoval',businessController.requestRemoval)
business.get('/deletePaymentMethod/:method', businessController.deletePaymentMethod);
business.post('/editInformation', upload.single('img'), businessController.editInformation);
business.get('/deletePhone/:phone', businessController.deletePhone);
business.get('/publicPage', businessController.makePagePublic);
business.get('/deleteImage/:image', businessController.deleteImage);
business.post('/changeProfilePicture', upload.single('img'), businessController.changeProfilePicture);
business.get('/hasBookings', businessController.hasBookings);
// business.get('/getAllBookings', businessController.getAllBookings);
business.get('/getEventOccs/:event', businessController.getEventOccs);
business.get('/getFacilityOccs/:facility', businessController.getFacilityOccs);
business.get('/getBooking/:booking', businessController.getBooking);



// business.get('/checkSession', businessController.checkSession);




module.exports = business;
