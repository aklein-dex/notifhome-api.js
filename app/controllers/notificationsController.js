const express = require('express')
var router = express.Router();

const bodyParser = require('body-parser')

const { check, validationResult } = require('express-validator/check')
const { matchedData, sanitize } = require('express-validator/filter')


var mongoose = require('mongoose');
var Notification = require('../models/notification');


const tokenMiddleware = require('../middlewares/token');

router.post('/notifications', [tokenMiddleware.hasValidToken, check('message').exists()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const notification = Notification(matchedData(req));
  //notification.user...
  //notification.device=...
  notification.save(function(err) {
    if (err)
      console.log(err)
    console.log('Notification saved successfully!');
    res.json({ notification });
  });
});

router.get('/notifications', tokenMiddleware.hasValidToken, (req, res) => {
  Notification.find({}, function(err, notifications) {
    if (err) 
      console.log(err)
    
    
    res.json({ notifications});
  });

});

module.exports = router;
