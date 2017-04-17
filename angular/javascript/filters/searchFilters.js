angular.module('fasa7ny')
    .filter('category', function () {
        return function (input, filterCategory) {
            if (typeof input == 'undefined' || input.length == 0) { return input }
            if (typeof filterCategory == 'undefined' || filterCategory.length == 0 || filterCategory == '' || filterCategory == 'all')
                return input;
            var out = [];

            for (var i = 0; i < input.length && typeof input[i] != 'undefined'; i++) {
                if (typeof input[i] == 'undefined')
                    return;
                var categories = input[i].category;
                if (typeof input[i] != 'undefined' && typeof categories != 'undefined') {
                    for (var j = 0; typeof categories[i] != 'undefined' && j < categories.length; j++) {
                        if (categories[j] == filterCategory) {
                            out.push(input[i]);

                        }
                    }
                }

            }

            return out;
        }
    }); 