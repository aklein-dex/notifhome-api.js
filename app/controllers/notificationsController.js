const express = require('express')
var router = express.Router();

const logger = require('../../config/logger');

const bodyParser = require('body-parser')

const { check, validationResult } = require('express-validator/check')
const { matchedData, sanitize } = require('express-validator/filter')


var mongoose = require('mongoose');
var Notification = require('../models/notification');


const tokenMiddleware = require('../middlewares/token');

router.post('/', [tokenMiddleware.hasValidToken, check('message').exists()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const notification = Notification(matchedData(req));
  //notification.user...
  //notification.device=...
  notification.save(function(err) {
    if (err) {
      var errMsg = "Error while saving notification"
      logger.error(errMsg + ": " + err);
      return res.status(500).json({ error: errMsg });
    }

    res.json({ notification });
  });
});

router.get('/', tokenMiddleware.hasValidToken, (req, res) => {
  // TODO: it should return only new notifications
  Notification.find({}, function(err, notifications) {
    if (err) {
      var errMsg = "Error while getting notification"
      logger.error(errMsg + ": " + err);
      return res.status(500).json({ error: errMsg });
    }
    
    res.json({ notifications});
  });
});

module.exports = router;
