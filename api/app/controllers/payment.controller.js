var configAuth = require("../../config/auth"),
    stripe = require("stripe")(configAuth.stripe.secretKey);

// Token is created using Stripe.js or Checkout!
// Get the payment token submitted by the form:

exports.pay = function(req,res)
{
	var token = req.body.stripeToken; 
	var amount = req.body.amount;
	var charge = stripe.charges.create({
	  amount: amount,
	  currency: "egp",
	  source: token,
	}, function(err, charge) {
	  	if(err)
	  	{
	  		switch (err.type) 
	  		{
			  case 'StripeCardError':
			    err.message = "Card Error. Please try again" ; // => e.g. "Your card's expiration year is invalid."
			    break;
			  case 'StripeInvalidRequestError':
			     err.message = "Invalid Input" ;// Invalid parameters were supplied to Stripe's API
			    break;
			  case 'StripeAPIError':
			     err.message = "Oops!! Something went wrong. Please try again.";// An error occurred internally with Stripe's API
			    break;
			  case 'StripeConnectionError':
			     err.message = "Connection error. Please try again." // Some kind of error occurred during the HTTPS communication
			    break;
			  case 'StripeAuthenticationError':
			    err.message = "Oops!! Something went wrong. Please try again.";// You probably used an incorrect API key
			    break;
			  case 'StripeRateLimitError':
			    err.message = "Oops!! Something went wrong. Please try again.";// Too many requests hit the API too quickly
			    break;
			}
	  	}
	    else
		{
 			res.status(200).json(charge);
		}
	});
}

