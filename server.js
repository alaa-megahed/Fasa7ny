process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var WebAdmin = require('./app/models/WebAdmin');
var mongoose = require('./config/mongoose'),
    config   = require('./config/config'),
    express  = require('./config/express'),
    db       = mongoose(),
    app      = express();


// var admin = new WebAdmin();
// admin.local.username = "radwa";
// admin.local.password = admin.generateHash("1234");
// admin.save(
//   function(err)
//     {if(err) throw err;}
// );

app.listen(config.port);

module.exports = app;
console.log(process.env.NODE_ENV  + ' server running at http://localhost:' + config.port);
