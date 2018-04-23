const jwt = require('jsonwebtoken')


exports.generateToken = function(user) {
  return jwt.sign({user}, 'TODOChangeSecretKey', { expiresIn: '30 days' });
}

verifyToken = function(token) {
  var data
  try {
    data = jwt.verify(token, 'TODOChangeSecretKey');
  } catch(err) {
    return null
  }
  
  return data
}

// Make sure the header has an access_token
exports.hasValidToken = function(req, res, next) {
  if (req.headers['access-token']) { 
    
    data = verifyToken(req.headers['access-token'])
    if (data) {
      req.token_data = data
    } else {
      // Forbidden
      res.sendStatus(403);
    }
    
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}
