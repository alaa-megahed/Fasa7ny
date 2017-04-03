var WebAdmin  = require('mongoose').model('WebAdmin');
var Business  = require('mongoose').model('Business');
var generator = require('generate-password');
var Events = require('mongoose').model('Events');
const nodemailer = require('nodemailer');


exports.AddBusiness = function(req, res) {
  var username = req.body.username;

  var generatedPassword = generator.generate({
    length: 10,
    numbers: true
});
   var hashedPassword = generateHash(generatedPassword);
      Business.findOne({ username: username}, function(err, user) {
    if (err) { return next(err); }
    if (business) {
      res.send("user already exist");
    }
    else{
    var business = new Business(
      {
    username      : username,
    password      : hashedPassword ,
    merchant_ID   : req.body.merchant_ID,
    category      : req.body.category
    
      });

    business.save(function(err,business) {
       
              if(err)
                throw err;

            res.send("Business added");

       }); 


// create reusable transporter object using the default SMTP transport
/*let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'fasa7ny.team@gmail',
        pass: 'fasa7ny#franshly8'
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: 'fasa7ny.team@gmail.com', // sender address
    to: req.body.email, // list of receivers
    subject: 'Verfication', // Subject line
    text: 'The username is ' + req.body.username + ' and your password is : '+ generatedPassword, // plain text body
    html: '<b></b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});

*/
}
};




//i am not sure about attribute name deleted ? ,,, and business attribute name in offer... check eno m3ndosh booking

exports.WebAdminDeleteBusiness = function(req,res){

 
      
    Business.findByIdAndRemove(req.params.name, function(err,business){
      if(err) throw err;
    Offer.remove({business : req.params.name }, function(err) {
    if (err) throw err;
})
   Events.remove({business_id : req.params.name }, function(err) {
    if (err) throw err;
})  
});
    res.send("Business Deleted Successfully");
};
    



  /*  exports.webAdminViewRequestedDelete = function(req,res){
      Business.find({deleted : 1} , function(err,requests)
        res.render('requestedDelete',requests);
        )
    }*/