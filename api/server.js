process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var WebAdmin = require('./app/models/WebAdmin');
var mongoose = require('./config/mongoose'),
    config   = require('./config/config'),
    express  = require('./config/express'),
    db       = mongoose(),
    app      = express();
    // cors     = require('cors');


var Business = require('./app/models/Business');

// var b = new Business();
// b.local.username = "nourhan";
// b.local.password = b.generateHash("password");
// b.name = "Nourhan";
// b.merchant_ID = "12345";
// b.save(function(err){if(err) throw err;});
// app.use(cors());

app.listen(config.port);

// app.use(cors);
// app.use(function(req, res, next) {
// res.header('Access-Control-Allow-Origin', req.headers.origin);
// res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
// res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
// res.header('Access-Control-Allow-Credentials', true);
// if ('OPTIONS' == req.method) {
//      res.send(200);
//  } else {
//      next();
//  }
// });




module.exports = app;
console.log(process.env.NODE_ENV  + ' server running at http://localhost:' + config.port);
