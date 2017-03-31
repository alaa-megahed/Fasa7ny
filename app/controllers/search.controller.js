var Business = require('../models/Business');

SearchController = {

    showAll: function (req, res) {
       Business.find(function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result); 
                res.send(result);
            }
        });
    }
    ,
    /** Searches businesses by keyword inserted by user 
     */
    search: function (req, res) {
        var keyword = req.params.keyword; 
        console.log(keyword); 
        Business.find({ $text: { $search: keyword } }, function (err, businesses) {
            if (err)
                console.log(err)
            else {
                res.send(businesses); 
            }
        });

    }
}

module.exports = SearchController; 
