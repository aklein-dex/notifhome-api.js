// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');
const tokenMiddleware = require('../middlewares/token');


var userSchema = new Schema({
  email:         { type: String, required: true, unique: true },
  username:      { type: String, required: true, min: 3, max: 18 },
  password:      { type: String, required: true },
  token:         { type: String },
  notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
  created_at:    Date,
  updated_at:    Date
});

// Hook before creating/saving a user
userSchema.pre('save', function(next) {
  
  if (this.isNew) {
    // Encrypt the password
    this.password = bcrypt.hashSync(this.password, 8);
    // Generate token
    this.token = tokenMiddleware.generateToken(this);
  }
  
  // get the current date
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
