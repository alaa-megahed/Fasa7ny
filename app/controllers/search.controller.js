var Business = require('../models/Business');

SearchController = {

    showAll: function (req, res) {
        Business.find({ public: 1 }).
            exec(function (err, result) {
                if (err)
                    console.log(err);
                else
                    res.json(result);
            });
    },
    search: function (req, res) {
        var formData = req.body;
        var sortBy = formData.sortBy;
        console.log(formData);
        var queryBody = helper.makeQuery(formData); // retrieve query body

        var query = Business.find(queryBody);

        if (typeof sortBy !== 'undefined' && sortBy.length > 0) { //apply sort filter only if not empty
            var sortObj = {};
            sortObj[sortBy] = -1;
            query.sort(sortObj);

        }


        query.exec(function (err, result) {
            if (err)
                res.send(err);
            else {
                console.log(result);
                res.render('search.ejs', { result: result });
            }
        });

    }
}

//module that contains helper methods to the SearchController
helper = {
    /**
     * Extracts the relevent information from formData input
     * and returns the body of the query to be executed
     */
    makeQuery: function (formData) {

        var keyword = formData.keyword || ""; //text search index over name, description and area (no substring)
        var category = formData.category || "";
        var area = formData.area || "";
        var minRating = formData.minRating || "";

        var query = {};

        //match any substring with name, description or area to search keyword
        if (keyword.length > 0) {
            query["$or"] = [
                { name: new RegExp(keyword, 'i') },
                { description: new RegExp(keyword, 'i') },
                { area: new RegExp(keyword, 'i') }
            ];
        }

        // add filters one by one, according to user input
        var anding = [];
        //make sute business page is public
        anding.push({ public: 1 });
        if (category.length > 0) {
            anding.push({ category: new RegExp(category, 'i') });
        }
        if (area.length > 0) {
            anding.push({ area: new RegExp(area, 'i') });
        }
        if (minRating.length > 0) {
            var minRatingFloat = parseFloat(minRating);
            console.log(minRatingFloat);
            anding.push({ average_rating: { $gte: minRatingFloat } });
        }
        if (anding.length > 0) {
            query["$and"] = anding;
        }
        console.log(query);
        return query;
    }
}
module.exports = SearchController;
