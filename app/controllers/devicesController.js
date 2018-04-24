const express = require('express')
var router = express.Router();

const bodyParser = require('body-parser')

const { check, validationResult } = require('express-validator/check')
const { matchedData, sanitize } = require('express-validator/filter')


var mongoose = require('mongoose');
var Device = require('../models/device');


const tokenMiddleware = require('../middlewares/token');

router.post('/', [tokenMiddleware.hasValidToken, check('name').exists()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }
  
  const device = Device(matchedData(req));
  device.save(function(err) {
    if (err) 
      console.log(err)

    console.log('device saved successfully!');
    res.json({ device });
  });
});

router.get('/', tokenMiddleware.hasValidToken, (req, res) => {
  Device.find({}, function(err, devices) {
    if (err) 
      console.log(err)
    
    
    res.json({ devices });
  });
});

router.get('/:id', tokenMiddleware.hasValidToken, (req, res) => {
  Device.findById(req.params.id, function(err, device) {
    if (err)
      res.send(err);
    res.json(device);
  });
  
});

router.delete('/:id', tokenMiddleware.hasValidToken, (req, res) => {
  Device.findByIdAndRemove(req.params.id, function(err, device) {
    if (err) throw err;
    console.log(device)
    // we have deleted the user
    console.log('Device deleted!');
    res.json({ device });
  });
});

router.put('/:id', [tokenMiddleware.hasValidToken, check('name').exists()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }
  
  const device = Device(matchedData(req));
  
  Device.findByIdAndUpdate(req.params.id, { name: device.name }, function(err, device) {
    if (err) throw err;
    console.log(device)
    // we have deleted the user
    console.log('Device updated!');
    res.status(200);
  });
});


module.exports = router;
