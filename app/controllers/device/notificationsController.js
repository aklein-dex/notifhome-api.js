const express = require('express')
var router = express.Router();

const bodyParser = require('body-parser')

const { check, validationResult } = require('express-validator/check')
const { matchedData, sanitize } = require('express-validator/filter')


var mongoose = require('mongoose');
var Notification = require('../../models/notification');


const tokenMiddleware = require('../../middlewares/token');


router.get('/notifications', tokenMiddleware.hasValidToken, (req, res) => {
  Notification.find({}, function(err, notifications) {
    if (err) 
      console.log(err)
    
    
    res.json({ notifications});
  });


});


module.exports = router;
