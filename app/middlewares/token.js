const jwt = require('jsonwebtoken')


const logger = require('../../config/logger');

exports.generateToken = function(user) {
  return jwt.sign({user_id: user._id}, 'TODOChangeSecretKey', { expiresIn: '7 days' });
}

// This token doesn't have an expiration date
exports.generateTokenForDevice = function(device) {
  return jwt.sign({device_id: device._id}, 'TODOChangeSecretKey');
}

verifyToken = function(token) {
  var data;
  try {
    data = jwt.verify(token, 'TODOChangeSecretKey');
  } catch(err) {
    return null;
  }
  
  return data;
}

// Make sure the header has an access_token
exports.hasValidToken = function(req, res, next) {
  if (req.headers['access-token']) { 
    
    data = verifyToken(req.headers['access-token']);
    if (data) {
      req.token_data = data;
    } else {
      // Forbidden
      return res.sendStatus(403);
    }
  } else {
    // Forbidden
    return res.sendStatus(403);
  }
  // Next middleware
  next();
}
