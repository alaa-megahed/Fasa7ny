process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('./config/mongoose'),
    config = require('./config/config'),
    express = require('./config/express'),
    db = mongoose(),
    app = express();

 

// what is this?!
 app.use(require('./app/routes/WebAdminRouter.js'));

var router = require('./app/routes/RegisteredUserRouter.js');
app.use(router);


app.listen(config.port);

module.exports = app;
console.log(process.env.NODE_ENV  + ' server running at http://localhost:' + config.port);
