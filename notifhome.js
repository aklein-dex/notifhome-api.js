const express = require('express')
const app = express()

// http://www.jyotman.xyz/post/logging-in-node.js-done-right
const morgan = require('morgan');
const logger = require('./config/logger');

const bodyParser = require('body-parser')

var mongoose = require('mongoose');

// https://stackoverflow.com/questions/45284746/how-to-mock-mongoose
if (process.env.NODE_ENV === 'test') {
  const Mockgoose = require('mockgoose').Mockgoose;
  const mockgoose = new Mockgoose(mongoose);

  mockgoose.prepareStorage().then(function() {
    mongoose.connect('mongodb://localhost/notifhome', function(err) {
      console.log('mockgoose connected');
    });
  });
} else {
  mongoose.connect('mongodb://localhost/notifhome');
}


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(morgan('dev', {
    skip: function (req, res) {
        return res.statusCode < 400
    }, stream: process.stderr
}));

app.use(morgan('dev', {
    skip: function (req, res) {
        return res.statusCode >= 400
    }, stream: process.stdout
}));


var authController = require('./app/controllers/authController');
app.use('/auth', authController);

var devicesController = require('./app/controllers/devicesController');
app.use('/devices', devicesController);

var notificationsController = require('./app/controllers/notificationsController');
app.use('/notifications', notificationsController);

var deviceNotificationsController = require('./app/controllers/device/notificationsController');
app.use('/device', deviceNotificationsController);

app.listen(3000, () => logger.info('Example app listening on port 3000!'))

module.exports = app; // for testing
