const express = require('express')
var router = express.Router();

const logger = require('../../config/logger');

const { check, validationResult } = require('express-validator/check')
const { matchedData, sanitize } = require('express-validator/filter')

const bcrypt = require('bcryptjs');

var User = require('../models/user');

const tokenMiddleware = require('../middlewares/token');

router.post('/sign_up',[ 
    check('email').isEmail().withMessage('must be an email').trim().normalizeEmail(),
    check('username').exists(),
    check('password', 'passwords must be at least 8 chars long and contain one number').isLength({ min: 8 }).matches(/\d/)
  ], (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }
  
  const user = User(matchedData(req));
  
  user.save((err) => {
    if (err) {
      logger.error("Error while registering user: " + err);
      
      var errMsg
      
      if (err.code == 11000)
        errMsg = "Email already existing. Please choose another one.";
      else
        errMsg = "Couldn't save the user. Please try again.";
        
      return res.status(422).json({ error: errMsg });
    }
    
    logger.debug('User saved successfully: ' + user.email);
    res.json({ token: user.token });
  });

});

// To be more secure, I should check how many time a user failed to log in
// to avoid brute force attack.
router.post('/sign_in', [
    check('email').isEmail().withMessage('must be an email').trim().normalizeEmail(),
    check('password', 'passwords must be at least 5 chars long and contain one number').matches(/\d/)
  ], (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }
  
  const paramUser = matchedData(req);
  
  // Check in DB if the user exists
  User.findOne({ email: paramUser.email }, (err, user) => {
    if (err) {
      var errMsg = "Error while signing in user";
      logger.error(errMsg + ": " + err);
      return res.status(500).json({ error: errMsg });
    }
    
    var errMsg = "Email or password invalid";
    if (!user) 
      return res.status(401).json({ error: errMsg });
    
    // check if the password is valid
    var passwordIsValid = bcrypt.compareSync(paramUser.password, user.password);
    if (!passwordIsValid)
      return res.status(401).json({ error: errMsg });
    
    // Set new token
    token = tokenMiddleware.generateToken(user);
    user.update({ token: token }, (err, user) => {
      if (err) {
        var errMsg = "Error while signing in user";
        logger.error(errMsg + ": " + err);
        return res.status(500).json({ error: errMsg });
      }
      
      res.json({ token });
    });
  });
  
});

router.delete('/signout', tokenMiddleware.hasValidToken, (req, res) => {
  logger.error(req.token_data);
  res.status(200);
});

module.exports = router;
