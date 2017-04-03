var Business = require('../models/Business');

var BusinessController = {
    getBusiness: function (req, res) {
        var name = req.params.name;
        Business.findOne({ name: name }).
            exec(function (err, result) {
                if (err)
                    console.log(err);
                else
                    res.send(result);
            });
    }, 
    equestRemoval = function(req,res) {
        // if(req.user){
        var id = req.query.id;
        Business.findByIdAndUpdate(id,{$set:{deleted:1}}, function(err,business){
            if(err) console.log("error in request removal");
            else console.log("Requested!");
        });

        // }

        // else{
        //  console.log('not logged in');
        // }
    }
}
module.exports = BusinessController; 