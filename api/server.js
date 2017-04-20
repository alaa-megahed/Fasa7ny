process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var WebAdmin = require('./app/models/WebAdmin');
var mongoose = require('./config/mongoose'),
    config   = require('./config/config'),
    express  = require('./config/express'),
    db       = mongoose(),
    app      = express();


var Business = require('./app/models/Business');

// var b = new Business();
// b.local.username = "nourhan";
// b.local.password = b.generateHash("password");
// b.name = "Nourhan";
// b.merchant_ID = "12345";
// b.save(function(err){if(err) throw err;});
// app.use(cors());

app.listen(config.port);


module.exports = app;
console.log(process.env.NODE_ENV  + ' server running at http://localhost:' + config.port);
