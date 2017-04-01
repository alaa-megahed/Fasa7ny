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
    }
}
module.exports = BusinessController; 