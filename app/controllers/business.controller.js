let Business = require('../models/Business');

let BusinessController = {

    showAllBusinesses: function (req, res) {

    }
    ,
    /** Searches businesses by keyword inserted by user 
     */
    searchBusiness: function (req, res) {
        var keyword = req.session.keyword;
        res.send(searchBusinessByKeyword(keyword));
    },
    searchBusinessByKeyword: function (keyword) {
        Business.find({ $text: { $search: keyword } }, function (err, result) {
            if (err)
                console.log(err)
            else
                return result;
        });
    }
}
