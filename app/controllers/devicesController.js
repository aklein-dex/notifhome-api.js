const express = require('express')
var router = express.Router();

const logger = require('../../config/logger');

const { check, validationResult } = require('express-validator/check')
const { matchedData, sanitize } = require('express-validator/filter')

var Device = require('../models/device');


const tokenMiddleware = require('../middlewares/token');

router.post('/', [tokenMiddleware.hasValidToken, check('name').exists()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const device = Device(matchedData(req));
  device.save((err) => {
    if (err) {
      var errMsg = "Error while saving device";
      logger.error(errMsg + ": " + err);
      return res.status(500).json({ error: errMsg });
    }
    res.json({ device });
  });
});

router.get('/', tokenMiddleware.hasValidToken, (req, res) => {
  Device.find({}, (err, devices) => {
    if (err) {
      var errMsg = "Error while getting devices";
      logger.error(errMsg + ": " + err);
      return res.status(500).json({ error: errMsg });
    } 
    
    res.json({ devices });
  });
});

router.get('/:id', tokenMiddleware.hasValidToken, (req, res) => {
  Device.findById(req.params.id, (err, device) => {
    if (err) {
      var errMsg = "Error while getting device";
      logger.error(errMsg + ": " + err);
      return res.status(500).json({ error: errMsg });
    } 

    res.json(device);
  });
  
});

router.delete('/:id', tokenMiddleware.hasValidToken, (req, res) => {
  Device.findByIdAndRemove(req.params.id, (err, device) => {
    if (err) {
      var errMsg = "Error while deleting device";
      logger.error(errMsg + ": " + err);
      return res.status(500).json({ error: errMsg });
    } 

    return res.sendStatus(204);
  });
});

router.put('/:id', [tokenMiddleware.hasValidToken, check('name').exists()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const device = Device(matchedData(req));
  
  Device.findByIdAndUpdate(req.params.id, { name: device.name }, {new: true}, (err, updatedDevice) => {
    if (err) {
      var errMsg = "Error while updating device";
      logger.error(errMsg + ": " + err);
      return res.status(500).json({ error: errMsg });
    }
    
    return res.status(200).json({ device: updatedDevice });
  });
});


module.exports = router;
