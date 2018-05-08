const express = require('express')
var router = express.Router();

const logger = require('../../../config/logger');

var Device = require('../../models/device');
var Notification = require('../../models/notification');

const tokenMiddleware = require('../../middlewares/token');


router.get('/notifications', tokenMiddleware.hasValidToken, (req, res) => {
  
  Device.findOne({ _id: req.token_data.device_id }, (err, device) => {
    if (err) {
      var errMsg = "Can't find device";
      logger.error(errMsg + ": " + err);
      return res.status(500).json({ error: errMsg });
    }
    
    // get only new notifications
    Notification.find({'created_at': {"$gte": device.last_request_at}}, function(err, notifications) {
      if (err) {
        var errMsg = "Error while getting notification";
        logger.error(errMsg + ": " + err);
        return res.status(500).json({ error: errMsg });
      }
      
      res.json({ notifications});
    });
  });
});


module.exports = router;
