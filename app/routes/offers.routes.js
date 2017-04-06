var express = require('express');
var multer = require('multer');
var router = express.Router();
var OffersController = require('../controllers/OffersController');
var upload = multer({ dest: 'public/uploads/' });

//Offer routes

router.get("/update_offer", function(req, res) {
  if(req.user && typeof req.query.id != "undefined") {
    var id = req.query.id;
    res.render("updateoffer.ejs", {id:id, user:req.user})
  } else res.send("you're not authorized to view this page");
});

router.get('/viewOffers', OffersController.viewOffers);
router.post('/createOffer', upload.single('image'), OffersController.createOffer);
router.post('/updateOffer', upload.single('image'), OffersController.updateOffer);
router.get('/deleteOffer', OffersController.deleteOffer);

module.exports = router;
