const express = require('express')
var router = express.Router();

const bodyParser = require('body-parser')

const { check, validationResult } = require('express-validator/check')
const { matchedData, sanitize } = require('express-validator/filter')

const bcrypt = require('bcryptjs');

var mongoose = require('mongoose');
var User = require('../models/user');

const tokenMiddleware = require('../middlewares/token');

router.post('/signup',[ 
    check('email').isEmail().withMessage('must be an email').trim().normalizeEmail(),
    check('username').exists(),
    check('password', 'passwords must be at least 5 chars long and contain one number').isLength({ min: 5 }).matches(/\d/)
  ], (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }
  
  const user = User(matchedData(req));
  
  user.password = bcrypt.hashSync(user.password, 8);
  
  user.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully!');
    res.sendStatus(200);
  });

});


router.post('/signin', [
    check('email').isEmail().withMessage('must be an email').trim().normalizeEmail(),
    check('password', 'passwords must be at least 5 chars long and contain one number').isLength({ min: 5 }).matches(/\d/)
  ], (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }
  
  const paramUser = matchedData(req);
  
  // Check in DB if the user exists
  User.findOne({ email: paramUser.email }, function(err, user) {
    if (err) {
      console.log(err);
      return res.status(500)
    }

    if (!user) 
      return res.status(404)
    
    // check if the password is valid
    var passwordIsValid = bcrypt.compareSync(paramUser.password, user.password);
    if (!passwordIsValid) 
      return res.status(401);
  });
  
  token = tokenMiddleware.generateToken(paramUser)
  res.json({
      token
  });
});

router.delete('/signout',[], (req, res) => {});

module.exports = router;
