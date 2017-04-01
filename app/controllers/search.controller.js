var Business = require('../models/Business');

SearchController = {

    showAll: function (req, res) {
        Business.find().
            exec(function (err, result) {
                if (err)
                    console.log(err);
                else
                    res.send(result);
            });
    }
    ,
    /** Searches businesses by keyword inserted by user 
     */
    search: function (req, res) {
        var formData = req.body;
        var keyword = formData.keyword;
        var category = formData.category;
        var area = formData.area;
        var minRating = parseFloat(formData.minRating);
        var sortBy = formData.sortBy;
        console.log(keyword);
        var query = {
            $or: [
                { category: new RegExp(category, 'i') },
                { area: new RegExp(area, 'i') },
                { average_rating: { $gte: [minRating] } }
            ]
        };
        //add keyword to the query only if it's not empty
        if (keyword.length > 0) {
            query["$text"] = { $search: keyword };
        }
        Business.find(query).
            sort('-' + sortBy).
            select('name').
            exec(function (err, result) {
                if (err)
                    res.send(err);
                else {
                    res.send(result);
                }
            });

    }
}

//module that contains helper methods to the SearchController
helper = {
    makeQuery: function (formData) {
        var formData = req.body;
        var keyword = formData.keyword;
        var category = formData.category;
        var area = formData.area;
        var minRating = parseFloat(formData.minRating);
        var sortBy = formData.sortBy;
        if (keyword.length > 0) {
            query["$text"] = { $search: keyword };
        }
        var oring = []; 
        if(category.length > 0) {
            oring.push({category: new RegExp(category, 'i')}); 
        }
        if(area.length > 0) {
            oring.push({area: new RegExp(area, 'i')});
        }
    }
}
module.exports = SearchController; 
