var Business = require('mongoose').model('Business');



	exports.requestRemoval = function(req,res)
	{
		// if(req.user){
		var id = req.query.id;
		Business.findByIdAndUpdate(id,{$set:{deleted:1}}, function(err,business){
			if(err) console.log("error in request removal");
			else console.log("Requested!");
		});

		// }

		// else{
		// 	console.log('not logged in');
		// }
	}

	

