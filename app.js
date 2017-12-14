var express = require('express');
var app = express();
var fs = require('fs');
var https = require('https');


var key = fs.readFileSync('privkey.pem');
var cert = fs.readFileSync('fullchain.pem');
//var ca = '';
var options = {
  key: key,
  cert: cert,
  //ca: ca
};

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//connect to MongoDB
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/pricebanana');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('connect mongodb success!');
});

//use sessions for tracking logins
app.use(session({
    secret: 'price banana',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

app.use(express.static(__dirname + '/assets'));
app.set('views',__dirname+'/views');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// parse incoming requests
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// include routes
require('./routes')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

//var options = {
//  key: key,
//  cert: cert,
////  ca: ca
//};
//
//var https = require('https');
//https.createServer(options, app).listen(443);

// listen on port 3000
// app.listen(3000, function() {
  //   console.log('Server is running on port 3000');
// });

//var CronJob = require('cron').CronJob;
//new CronJob('* * * * * *', function() {
//  console.log('You will see this message every second');
//}, null, true, 'America/Los_Angeles');

//Seconds: 0-59
//Minutes: 0-59
//Hours: 0-23
//Day of Month: 1-31
//Months: 0-11 (Jan-Dec)
//Day of Week: 0-6 (Sun-Sat)

//var CronJob = require('cron').CronJob;
//var job = new CronJob({
//  cronTime: '* * * * * *',
//  onTick: function() {
//      var helper = require(__dirname + '/helpers/cron');
//      helper.cron('qoo10');
//      this.stop();
//  },
//  start: false,
//  timeZone: 'Asia/Ho_Chi_Minh'
//});
//job.start();

//var CronJob = require('cron').CronJob;
//var delete_old_data = new CronJob({
//  cronTime: '01 01 01 * * *',
//  onTick: function() {
//      var helper = require(__dirname + '/helpers/cron');
//      helper.delete_old_data();
//  },
//  start: false
//});
//delete_old_data.start();

https.createServer(options, app).listen(443);
