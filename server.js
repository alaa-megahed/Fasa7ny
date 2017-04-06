process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('./config/mongoose'),
    config   = require('./config/config'),
    express  = require('./config/express'),
    db       = mongoose(),
    app      = express();

<<<<<<< HEAD


=======
var router = require('./app/routes/index.js');


//requiring Schemas
require('./app/models/Booking');
require('./app/models/Business');
require('./app/models/Event');
require('./app/models/Offer');
require('./app/models/RegisteredUser');
require('./app/models/WebAdmin');

>>>>>>> c328b15fd48fd3dc55f32a03c487eec8f31e1813

var router = require('./app/routes/index.js');
app.use(router);


app.listen(config.port);

module.exports = app;
console.log(process.env.NODE_ENV  + ' server running at http://localhost:' + config.port);
