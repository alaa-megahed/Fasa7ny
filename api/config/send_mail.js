var nodemailer = require("nodemailer");
    configAuth = require('./auth');

var generator = require('xoauth2').createXOAuth2Generator({
    user: 'fasa7ny.team@gmail.com',
    clientId: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    refreshToken: configAuth.googleAuth.refreshToken,
    accessToken: configAuth.googleAuth.accessToken // optional
});


// listen for token updates
// you probably want to store these to a db
generator.on('token', function(token){
    console.log('New token for %s: %s', token.user, token.accessToken);
});


// login
var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        xoauth2: generator
    }
});


module.exports = smtpTransport;