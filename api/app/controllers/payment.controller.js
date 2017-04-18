var configAuth = require("../../config/auth"),
    stripe = require("stripe")(configAuth.stripe.secretKey);

// Token is created using Stripe.js or Checkout!
// Get the payment token submitted by the form:


var token = request.body.stripeToken; // Using Express

// Charge the user's card:
var charge = stripe.charges.create({
  amount: 1000,
  currency: "usd",
  description: "Example charge",
  source: token,
}, function(err, charge) {
  // asynchronously called
});
