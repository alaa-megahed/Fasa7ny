var mongoose = require('mongoose');
var Business = mongoose.model('Business');

exports.makePagePublic = function(req, res) {
  // var businessId = req.user;
  var businessId = req.query.id; //just for testing
  Business.findByIdAndUpdate(
    businessId,
    {$set:{public:1}},
    function(err) {
      if(err) {
        console.log("error in making page public");
      } else {
        console.log("Page public");
      }
    }
  )
}
