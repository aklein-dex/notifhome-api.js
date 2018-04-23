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
    if (err) throw err;

    console.log('User saved successfully!');
    res.json({ device });
    res.sendStatus(200);
  });
});

router.get('/', tokenMiddleware.hasValidToken, (req, res) => {
  console.log(req.body)
  console.log(req.params)
});
router.post('/', tokenMiddleware.hasValidToken, (req, res) => {
});
router.get('/:id', tokenMiddleware.hasValidToken, (req, res) => {
});
router.delete('/:id', tokenMiddleware.hasValidToken, (req, res) => {
});
router.put('/:id', tokenMiddleware.hasValidToken, (req, res) => {
});




module.exports = router;
