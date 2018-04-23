const express = require('express')
const app = express()

const bodyParser = require('body-parser')

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/notifhome');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res) => res.send('Hello World!'))


var authController = require('./app/controllers/authController');
app.use('/auth', authController);

var devicesController = require('./app/controllers/devicesController');
app.use('/devices', devicesController);

var notificationsController = require('./app/controllers/notificationsController');
app.use('/devices', notificationsController);

var deviceNotificationsController = require('./app/controllers/device/notificationsController');
app.use('/device', deviceNotificationsController);

app.listen(3000, () => console.log('Example app listening on port 3000!'))
